// Verifies the generated static output in dist/. Run after `npm run build`.
// Dependency-free on purpose: it parses HTML with simple, explicit patterns.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const ORIGIN = (process.env.PUBLIC_SITE_URL || 'http://localhost:4321').replace(/\/+$/, '');
const EXPECTED_NOINDEX = process.env.SITE_NOINDEX === 'true';

const EXPECTED_ARTICLES = [
  'best-french-reading-apps',
  'best-apps-to-learn-french',
  'duolingo-alternatives-for-french',
  'duolingo-vs-sorlio',
  'how-to-learn-french',
  'learn-french-by-reading',
  'a2-french-reading-practice',
  'learn-french-with-news',
];
const EXPECTED_PAGES = ['/', '/articles/', '/about/', ...EXPECTED_ARTICLES.map((s) => `/${s}/`)];
// External hosts that may legitimately be linked.
const ALLOWED_EXTERNAL_HOSTS = ['play.google.com', 'www.duolingo.com', 'www.coe.int'];
const FORBIDDEN_STRINGS = ['guides.sorlio.site', 'googletagmanager', 'google-analytics', 'fbq(', 'hotjar', 'TODO', 'lorem ipsum', 'PLACEHOLDER'];

let failures = 0;
let checks = 0;
function check(condition, message) {
  checks += 1;
  if (!condition) {
    failures += 1;
    console.error(`FAIL: ${message}`);
  }
}

function pageFile(urlPath) {
  return join(DIST, urlPath, 'index.html');
}

function read(file) {
  return readFileSync(file, 'utf8');
}

function allMatches(html, regex) {
  return [...html.matchAll(regex)].map((m) => m[1]);
}

function textOnly(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// 1. Required output exists
check(existsSync(join(DIST, 'sitemap-index.xml')), 'sitemap-index.xml was generated');
check(existsSync(join(DIST, 'robots.txt')), 'robots.txt was generated');
check(existsSync(join(DIST, '404.html')), '404.html was generated');
for (const p of EXPECTED_PAGES) {
  check(existsSync(pageFile(p)), `expected page is generated: ${p}`);
}

// 2. Per-page SEO and structure
const titles = new Map();
const descriptions = new Map();
const knownPaths = new Set(EXPECTED_PAGES.map((p) => p));
const linkedInternal = new Set();

for (const p of EXPECTED_PAGES) {
  const file = pageFile(p);
  if (!existsSync(file)) continue;
  const html = read(file);

  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  check(Boolean(title && title.trim().length > 0), `${p} has a non-empty <title>`);
  if (title) {
    check(!titles.has(title), `${p} title is unique (duplicate of ${titles.get(title)})`);
    titles.set(title, p);
  }

  const description = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  check(Boolean(description && description.length >= 50 && description.length <= 165), `${p} meta description is 50 to 165 characters`);
  if (description) {
    check(!descriptions.has(description), `${p} description is unique`);
    descriptions.set(description, p);
  }

  const canonical = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  check(canonical === `${ORIGIN}${p}`, `${p} canonical is ${ORIGIN}${p} (got ${canonical})`);

  const h1Count = allMatches(html, /<h1[^>]*>/g).length;
  check(h1Count === 1, `${p} has exactly one <h1> (found ${h1Count})`);

  const robots = (html.match(/<meta name="robots" content="([^"]*)"/) || [])[1];
  if (EXPECTED_NOINDEX) {
    check(robots === 'noindex, nofollow', `${p} is noindex in preview build`);
  } else {
    check(robots && !robots.includes('noindex'), `${p} is indexable in production build (robots: ${robots})`);
  }

  for (const bad of FORBIDDEN_STRINGS) {
    check(!html.toLowerCase().includes(bad.toLowerCase()), `${p} does not contain "${bad}"`);
  }

  // JSON-LD must parse
  for (const block of allMatches(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(block);
    } catch {
      check(false, `${p} has invalid JSON-LD`);
    }
  }

  // Internal links resolve and fragment targets exist
  for (const href of allMatches(html, /<a[^>]*\shref="([^"]+)"/g)) {
    if (href.startsWith('/') && !href.startsWith('//')) {
      const [pathPart, hash] = href.split('#');
      const normalised = pathPart.endsWith('/') ? pathPart : `${pathPart}/`;
      linkedInternal.add(normalised);
      if (pathPart === '/') continue;
      const isAsset = /\.[a-z0-9]+$/i.test(pathPart);
      if (!isAsset) {
        check(existsSync(pageFile(normalised)), `${p} links to missing page ${href}`);
      }
      if (hash && existsSync(pageFile(normalised))) {
        const targetHtml = read(pageFile(normalised));
        check(targetHtml.includes(`id="${hash}"`), `${p} links to missing anchor ${href}`);
      }
    } else if (href.startsWith('#')) {
      check(html.includes(`id="${href.slice(1)}"`), `${p} has in-page link to missing anchor ${href}`);
    } else if (/^https?:\/\//.test(href)) {
      const host = new URL(href).host;
      check(ALLOWED_EXTERNAL_HOSTS.includes(host), `${p} links to unapproved external host ${host}`);
      const anchor = html.match(new RegExp(`<a[^>]*href="${href.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}"[^>]*>`));
      // noopener only matters for links that open a new tab; none should do that without it.
      check(!anchor || !anchor[0].includes('target="_blank"') || /rel="[^"]*noopener/.test(anchor[0]), `${p} new-tab link to ${host} has rel="noopener"`);
    }
  }

  // Article-specific content checks
  if (EXPECTED_ARTICLES.some((s) => p === `/${s}/`)) {
    const words = textOnly(html).split(' ').length;
    check(words >= 900, `${p} has substantive article text (${words} words)`);
    check(html.includes('href="https://play.google.com/store/apps/details?id=app.sorlio.reader"'), `${p} links to the Google Play listing`);
    check(html.includes('class="breadcrumbs"'), `${p} has breadcrumbs`);
    check(html.includes('"@type":"BreadcrumbList"'), `${p} has BreadcrumbList structured data`);
    check(html.includes('"@type":"Article"'), `${p} has Article structured data`);
    check(html.includes('Sorlio Guides is published by the makers of Sorlio'), `${p} carries the publisher disclosure`);
    // Disclaimers say "not an independent review"; only affirmative testing claims are forbidden.
    check(!/\b(independently tested|we tested (the|each|every)|our tests showed|our testing showed|we ran (controlled )?tests)\b/i.test(textOnly(html)), `${p} makes no affirmative testing claim`);
  }
}

// Every linked internal page should be one we generate.
for (const link of linkedInternal) {
  const cleaned = link.replace(/\/+$/, '/');
  const ok = knownPaths.has(cleaned) || existsSync(pageFile(cleaned));
  check(ok, `internal link target exists: ${link}`);
}

// Titles and descriptions must be unique across the whole site
check(titles.size === EXPECTED_PAGES.length, 'every page has a distinct title');
check(descriptions.size === EXPECTED_PAGES.length, 'every page has a distinct description');

// 3. Sitemap
const sitemapIndex = read(join(DIST, 'sitemap-index.xml'));
const sitemapFiles = allMatches(sitemapIndex, /<loc>([^<]+)<\/loc>/g);
check(sitemapFiles.length >= 1, 'sitemap index references at least one sitemap');
const urls = new Set();
for (const loc of sitemapFiles) {
  const local = loc.replace(ORIGIN, '');
  const file = join(DIST, local.replace(/^\//, ''));
  if (!existsSync(file)) {
    check(false, `sitemap file exists: ${loc}`);
    continue;
  }
  for (const u of allMatches(read(file), /<loc>([^<]+)<\/loc>/g)) urls.add(u);
}
for (const p of EXPECTED_PAGES) {
  check(urls.has(`${ORIGIN}${p}`), `sitemap includes ${ORIGIN}${p}`);
}
check(!Array.from(urls).some((u) => u.includes('/404')), 'sitemap excludes 404');
check(Array.from(urls).every((u) => u.startsWith(ORIGIN)), 'every sitemap URL uses the configured production origin');
if (!EXPECTED_NOINDEX) {
  check(urls.size === EXPECTED_PAGES.length, `sitemap lists exactly ${EXPECTED_PAGES.length} pages (got ${urls.size})`);
}

// 4. robots.txt
const robots = read(join(DIST, 'robots.txt'));
if (EXPECTED_NOINDEX) {
  check(/Disallow: \//.test(robots), 'preview robots.txt disallows everything');
} else {
  check(!/Disallow: \/\s*$/m.test(robots), 'production robots.txt does not block the site');
  check(robots.includes(`Sitemap: ${ORIGIN}/sitemap-index.xml`), 'robots.txt points to the sitemap index');
}

// 5. Scan built assets for leftover shared-project references
const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
for (const file of walk(DIST).filter((f) => /\.(html|js|css)$/.test(f))) {
  const content = read(file);
  check(!content.includes('guides.sorlio.site'), `${relative(DIST, file)} does not hard-code guides.sorlio.site`);
}

console.log(`${checks - failures}/${checks} checks passed`);
if (failures > 0) {
  console.error(`${failures} check(s) failed`);
  process.exit(1);
}
