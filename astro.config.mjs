import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';

export default defineConfig({
  site: 'https://topbesticles.com',
  integrations: [react(), markdoc(), keystatic()],
  vite: {
    optimizeDeps: {
      include: ['react-dom/client'],
    },
  },
});
