import type { APIRoute } from 'astro';
import { isNoindexBuild } from '../lib/site';

// Preview builds (SITE_NOINDEX=true) are told to stay out of search entirely.
// Production allows everything and points crawlers at the sitemap index.
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site ?? 'http://localhost:4321').href;
  const body = isNoindexBuild()
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
