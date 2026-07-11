import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

// process.argv contains 'build' when running `astro build`, 'dev' when running `astro dev`.
// Keystatic adds server-only routes that require an adapter and break static output,
// so it must only be present during local development.
const isBuild = process.argv.some(a => a === 'build');

// ── Sitemap lastmod lookup ──────────────────────────────────────────────
// The build date is the fallback <lastmod> for pages that aren't listicles
// (homepage, etc.). Listicle pages get their real `lastUpdated` date instead.
const BUILD_DATE = new Date().toISOString();

// Build a map of listicle URL path -> its true `lastUpdated` (ISO string).
//
// NOTE: We can't call getCollection() from 'astro:content' here — the content
// layer runtime only exists during the build itself, not while astro.config is
// being evaluated. So we read the very same Keystatic `listicles` collection
// files off disk and parse their frontmatter, giving each URL its TRUE date
// instead of stamping every page with the build time.
const listiclesDir = fileURLToPath(new URL('./src/content/listicles', import.meta.url));
const lastmodByPath = {};
for (const file of fs.readdirSync(listiclesDir)) {
  if (!file.endsWith('.mdoc')) continue;
  const raw = fs.readFileSync(path.join(listiclesDir, file), 'utf8');
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) continue;
  const data = yaml.load(fm[1]) ?? {};
  const slug = file.replace(/\.mdoc$/, '');
  // Convert to a proper ISO date; fall back to build date if missing.
  const lastmod = data.lastUpdated ? new Date(data.lastUpdated).toISOString() : BUILD_DATE;
  lastmodByPath[`/listicles/${slug}/`] = lastmod;
}

const integrations = [
  react(),
  markdoc(),
  sitemap({
    serialize(item) {
      // item.url is the absolute URL; normalise its path to always end in "/".
      const pathname = new URL(item.url).pathname;
      const key = pathname.endsWith('/') ? pathname : `${pathname}/`;

      if (key === '/') {
        // Homepage: highest priority, refreshed most often.
        item.changefreq = 'daily';
        item.priority = 1.0;
        item.lastmod = BUILD_DATE;
      } else if (key in lastmodByPath) {
        // Listicle: use its real lastUpdated date from the collection.
        item.changefreq = 'weekly';
        item.priority = 0.8;
        item.lastmod = lastmodByPath[key];
      } else {
        // Anything else: sensible default + build-date fallback.
        item.changefreq = 'monthly';
        item.priority = 0.6;
        item.lastmod = BUILD_DATE;
      }

      return item;
    },
  }),
];
if (!isBuild) {
  const { default: keystatic } = await import('@keystatic/astro');
  integrations.push(keystatic());
}

export default defineConfig({
  site: 'https://topbesticles.com',
  integrations,
  vite: {
    optimizeDeps: {
      // Force Vite to pre-bundle react-dom/client so its named ESM exports
      // (createRoot, hydrateRoot) are available when Keystatic hydrates in dev.
      include: ['react-dom/client'],
    },
  },
});
