// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The production domain has not been chosen yet. Set PUBLIC_SITE_URL in
// Vercel (or your shell) once it is known; localhost is used otherwise.
const siteUrl = (process.env.PUBLIC_SITE_URL || 'http://localhost:4321').replace(/\/+$/, '');

/**
 * Wrap every Markdown table in a scroll container so wide comparison tables
 * scroll inside their own box on phones instead of pushing the page sideways.
 * The table element itself is left untouched, so its semantics are preserved.
 */
function wrapTables() {
  /** @param {any} node */
  const visit = (node) => {
    if (!node.children) return;
    node.children = node.children.map((/** @type {any} */ child) => {
      if (child.type === 'element' && child.tagName === 'table') {
        visit(child);
        return {
          type: 'element',
          tagName: 'div',
          properties: { className: ['table-scroll'], tabIndex: 0, role: 'region', ariaLabel: 'Scrollable table' },
          children: [child],
        };
      }
      visit(child);
      return child;
    });
  };
  /** @param {any} tree */
  return (tree) => visit(tree);
}

export default defineConfig({
  site: siteUrl,
  trailingSlash: 'always',
  output: 'static',
  markdown: {
    rehypePlugins: [wrapTables],
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  build: {
    format: 'directory',
  },
  devToolbar: { enabled: false },
});
