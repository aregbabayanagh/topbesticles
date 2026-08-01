import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderOgImage } from '../../lib/og-image';
import { getSettings } from '../../lib/settings';

// One OG image per real page, generated at build time — no runtime image
// service. The `slug` here always mirrors the real page's URL path (see
// Base.astro, which derives `/og/<slug>.png` from Astro.url.pathname), so
// adding a page here means adding the matching entry below.
//
// Categories and listicles are pulled straight from their collections, so
// new entries there get an OG image automatically with no code changes.
// A brand-new hand-authored static page (not from a collection) needs one
// line added to `paths` below — same as it already needs its own .astro file.
export async function getStaticPaths() {
  const [settings, categories, listicles] = await Promise.all([
    getSettings(),
    getCollection('categories'),
    getCollection('listicles'),
  ]);

  const paths = [
    { params: { slug: 'home' }, props: { title: settings.siteName, subtitle: settings.tagline } },
    { params: { slug: 'category' }, props: { title: 'Browse all categories', subtitle: undefined } },
    { params: { slug: 'contact' }, props: { title: 'Get in touch', subtitle: undefined } },
    ...categories.map((category) => ({
      params: { slug: `category/${category.id}` },
      props: { title: category.data.heading || category.data.title, subtitle: undefined },
    })),
    ...listicles.map((listicle) => ({
      params: { slug: listicle.id },
      props: { title: listicle.data.title, subtitle: undefined },
    })),
  ];

  return paths;
}

export const GET: APIRoute = async ({ props }) => {
  const { title, subtitle } = props as { title: string; subtitle?: string };
  const png = await renderOgImage({ title, subtitle });

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
