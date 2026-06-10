import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';

// process.argv contains 'build' when running `astro build`, 'dev' when running `astro dev`.
// Keystatic adds server-only routes that require an adapter and break static output,
// so it must only be present during local development.
const isBuild = process.argv.some(a => a === 'build');

const integrations = [react(), markdoc()];
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
