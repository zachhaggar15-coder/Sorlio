// Central site facts. Change them here, nowhere else.

export const SITE = {
  name: 'Sorlio Guides',
  tagline: 'Practical guides to learning French through reading',
  // Publisher relationship must stay visible on every page.
  publisher: 'Sorlio',
  description:
    'Independent-minded guides to French learning, from choosing apps to reading French news. Published by the makers of Sorlio, an Android app.',
  // Verified Google Play listing for the existing Android app.
  playStoreUrl: 'https://play.google.com/store/apps/details?id=app.sorlio.reader',
  locale: 'en-GB',
};

/** Compose a canonical absolute URL for a site-relative path (paths start with /). */
export function absoluteUrl(site: URL | undefined, path: string): string {
  return new URL(path, site ?? 'http://localhost:4321').href;
}

/** True only when the build is explicitly marked as a non-production preview. */
export function isNoindexBuild(): boolean {
  return process.env.SITE_NOINDEX === 'true';
}
