# Sorlio Guides

Independent French-learning guides, published by the makers of Sorlio. The site is a static Astro project with no database, no authentication, no paid APIs and no runtime content service.

Sorlio Guides is not an independent review organisation. It promotes Sorlio, an Android app, and says so on every page.

## Requirements

- Node.js 20.3 or later (tested on Node 24)
- npm

## Local setup

```bash
npm install
```

## Development commands

```bash
npm run dev       # local development server at http://localhost:4321
npm run check     # Astro and TypeScript diagnostics
npm run lint      # ESLint
npm run build     # production static build into dist/
npm run preview   # serve the built dist/ folder
npm run verify    # check the built output (run after build)
npm test          # check, lint, build and verify in order
```

## Production build

```bash
PUBLIC_SITE_URL=https://your-domain.example npm run build
```

`PUBLIC_SITE_URL` sets every canonical URL, Open Graph URL, sitemap entry and the `robots.txt` sitemap line. If it is not set, the build uses `http://localhost:4321`, which is correct for local work and wrong for production. **Always set it for a production build.**

For a preview or staging deployment that must not be indexed, set `SITE_NOINDEX=true`. This adds `noindex` to every page and disallows all crawling in `robots.txt`. Do not set it in production.

## Project structure

```
astro.config.mjs            Site URL, sitemap, table wrapping
src/content.config.ts       Guide schema (validated at build time)
src/content/guides/        One Markdown file per guide
src/pages/                  Home, /articles/, /about/, 404, robots.txt, guide route
src/layouts/                BaseLayout (SEO head), GuideLayout (article template)
src/components/             Breadcrumbs, PlayCta, GuideCard
src/lib/                    site.ts (site facts, URL helpers), categories.ts
src/styles/global.css       All styling: one stylesheet, colour tokens on :root
public/                     favicon.svg, og-default.svg
scripts/verify-dist.mjs     Post-build checks on dist/
docs/                       Keyword map and future article backlog
```

## Adding an article

1. Create a Markdown file in `src/content/guides/`. The filename becomes the URL, so `my-topic.md` is served at `/my-topic/`.
2. Add frontmatter. Every field below is required unless marked optional:

```markdown
---
title: "A title between 10 and 90 characters"
description: "A description between 50 and 165 characters."
category: learning-method          # app-comparisons | learning-method | practice-resources
searchIntent: informational        # commercial-comparison | informational | practice
primaryKeyword: my topic
publishedDate: 2026-10-14
updatedDate: 2026-10-14            # must be on or after publishedDate
featured: false                    # optional, default false
draft: false                       # optional, default false
order: 100                         # optional, lower numbers appear first
productClaimsVerified: false       # set true only after a person has checked every product claim
sources:                           # optional
  - label: "Author (year). Title. Publisher."
    url: "https://example.org"     # optional
---
```

3. Write the body with `##` for main sections and `###` for subsections. **Do not use `#`** because the layout supplies the single H1.
4. Run `npm run build && npm run verify`.

The build fails if required metadata is missing or the length rules are broken, which keeps a bad guide from reaching production.

## Editing metadata

Change the frontmatter in the guide's file. Titles and descriptions are the two fields that drive search snippets, so keep them specific and check their lengths. Update `updatedDate` when you make a substantial change, and leave `publishedDate` alone.

## Publishing and unpublishing

- **Publish:** set `draft: false` (or remove the line) and rebuild.
- **Unpublish:** set `draft: true`. The page is not generated, so it is removed from the sitemap, listings and internal links. Remove or redirect any internal links that point to it, because the verification script will fail on them.
- **Preview a draft locally:** set `draft: true`, run `npm run dev`, and check the page. It will not appear in production builds.

## Managing internal links

- Link to guides with root-relative paths and a trailing slash, for example `/best-french-reading-apps/`.
- Link to a section within a guide with `#` and the heading slug.
- Do not add links only to increase counts. Each link should help the reader.
- `npm run verify` fails when a link points to a page that is not generated.

## Testing

`npm test` runs the full set of checks in order:

1. `astro check` (TypeScript and Astro diagnostics)
2. `eslint .`
3. `astro build`
4. `scripts/verify-dist.mjs`, which checks:
   - all eight articles, the home page, the articles index and the About page are generated
   - unique, sized titles and meta descriptions, and a correct canonical URL on each page
   - exactly one H1 per page, and indexability in production
   - internal links resolve, and in-page anchors exist
   - external links point only to approved hosts
   - the sitemap lists every public page and excludes the 404
   - `robots.txt` allows crawling in production and blocks it in preview
   - no analytics, tracking or leftover placeholder text in the output

## Connecting the repository to Vercel

1. In Vercel, choose **Add New → Project** and import `zachhaggar15-coder/Sorlio` from GitHub.
2. Leave **Root Directory** empty. This repository contains only the guides site, so its root is the project root.
3. Confirm the framework preset is **Astro**. Build command: `npm run build`. Output directory: `dist`. Install command: `npm install`.
4. Add the environment variable `PUBLIC_SITE_URL` for Production with your chosen domain, for example `https://example.com` (no trailing slash).
5. Deploy. Do not add `SITE_NOINDEX` to Production.

## Configuring the domain

1. In the Vercel project, open **Settings → Domains** and add your domain.
2. Point DNS to the values Vercel shows.
3. Set `PUBLIC_SITE_URL` to the same domain and redeploy, so canonical URLs and the sitemap match.
4. Confirm `https://your-domain/robots.txt` lists the sitemap and that a guide page shows the right canonical URL in its source.

## Submitting the sitemap to Google Search Console

1. Add the property for your domain in Search Console and verify ownership.
2. Open **Sitemaps**, enter `sitemap-index.xml`, and submit.
3. Check that all eleven public URLs are discovered, and use URL Inspection on one article to confirm it is indexable.

## Measurement

Search Console shows impressions, clicks, queries, indexed pages and average position. It does not show Google Play installs. Outbound clicks to Google Play can be observed only if you add analytics or a link tracker, which this site deliberately does not include. Any install attribution would need a separate, privacy-reviewed decision and is not implemented here.

## Known limitations

- Product claims about Sorlio and competitors are general and must be verified against the live Google Play listing and official product sites before publication. The build cannot check them.
- Dependency audit: `npm audit --omit=dev` reports issues in Astro's own transitive dependencies (`esbuild`, `sharp`). The fix is to move to Astro 7, a breaking change that has not been tested here. The `esbuild` issue affects only the development server.
- The site has not been checked in a browser at phone width in this build session. Run `npm run preview` and inspect the layout on a narrow screen before launch.
