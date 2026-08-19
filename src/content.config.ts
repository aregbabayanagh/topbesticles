import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const categories = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/categories' }),
  schema: z.object({
    title: z.string(),
    // Keystatic persists the slug as the filename (entry.id), not as a data
    // field, so it's optional here. The real slug is always `entry.id`.
    slug: z.string().optional(),
    // Optional H1 override for the category page; falls back to `title`.
    heading: z.string().optional(),
    description: z.string(),
    // Homepage "Browse by category" grid shows at most 4 cards. When any
    // category is marked `featured`, only featured categories compete for
    // those slots; otherwise all categories do. `order` (ascending) breaks
    // ties within that pool — unset/equal values fall back to alphabetical.
    featured: z.boolean().optional(),
    order: z.number().optional(),
    coverImage: z.string().optional(),
    coverImageAlt: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
});

const listicles = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/listicles' }),
  schema: z.object({
    title: z.string(),
    // Keystatic persists the slug as the filename (entry.id), not as a data
    // field, so it's optional here. The real slug is always `entry.id`.
    slug: z.string().optional(),
    // Parent category — stored as the category's slug (relationship field).
    category: z.string(),
    // When true, the entry is excluded from the build entirely — no page,
    // no sitemap URL, no OG image, and it doesn't count toward any
    // category's listing. Every `getCollection('listicles', ...)` call in
    // the site must filter on `!data.draft`.
    draft: z.boolean().optional(),
    tags: z.array(z.string()).default([]),
    dek: z.string(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    quickAnswer: z.string(),
    keyTakeaways: z.array(z.string()).default([]),
    lastUpdated: z.coerce.date(),
    // Original publish date, used for the Article JSON-LD's datePublished.
    // Optional: pages without it simply skip that JSON-LD block.
    datePublished: z.coerce.date().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    // Short lede paragraph. The full article lives in the markdoc body.
    intro: z.string(),
    // Overrides the "The rankings" H2 above the ranked items. Optional so
    // existing listicles keep their default heading unchanged.
    rankingsHeading: z.string().optional(),
    // Extra "At a glance" comparison-table columns beyond the fixed
    // Rank/Name/Best for/Starting price set, inserted before Starting price.
    // Each item's `comparisonValues` must supply one value per column, in
    // the same order. Empty by default, so existing listicles render the
    // same four columns as before.
    comparisonColumns: z.array(z.object({ label: z.string() })).default([]),
    items: z.array(
      z.object({
        rank: z.number(),
        name: z.string(),
        logo: z.string().optional(),
        logoAlt: z.string().optional(),
        url: z.string().url(),
        startingPrice: z.string(),
        bestFor: z.string(),
        description: z.string(),
        pros: z.array(z.string()),
        cons: z.array(z.string()),
        founded: z.string().optional(),
        headquarters: z.string().optional(),
        founders: z.string().optional(),
        notableClients: z.string().optional(),
        reviewScore: z.string().optional(),
        // Source and month the starting price was checked, e.g. "Clutch
        // profile, August 2026" — shown as a fact row alongside Founded etc.
        pricingVerified: z.string().optional(),
        // Values for the listicle's extra `comparisonColumns`, in the same
        // order. Empty by default.
        comparisonValues: z.array(z.string()).default([]),
        // Social profile links, rendered as small icon links near the facts
        // block on the listicle page. Any/all may be left empty.
        linkedin: z.string().nullable().optional(),
        twitter: z.string().nullable().optional(),
        facebook: z.string().nullable().optional(),
        instagram: z.string().nullable().optional(),
        youtube: z.string().nullable().optional(),
        tiktok: z.string().nullable().optional(),
        // Independent controls for the outbound link's rel attribute:
        // `sponsored` drives both rel="sponsored" and the visible badge;
        // `linkRel` independently drives rel="nofollow". See [slug].astro.
        sponsored: z.boolean().optional(),
        linkRel: z.enum(['follow', 'nofollow']).optional(),
      })
    ),
    faq: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    ),
  }),
});

// ── Settings (singleton) ──────────────────────────────────────────────
// Site-wide values editable in Keystatic without touching code. Stored as a
// single flat file (src/content/settings.yaml), read via the `glob` loader
// like the other collections — it has exactly one entry, id "settings".
const settings = defineCollection({
  loader: glob({ pattern: 'settings.yaml', base: './src/content' }),
  schema: z.object({
    siteName: z.string(),
    tagline: z.string(),
    contactEmail: z.string(),
    metaDescription: z.string(),
    footerDisclosure: z.string(),
    social: z
      .object({
        twitter: z.string().nullable().optional(),
        linkedin: z.string().nullable().optional(),
        instagram: z.string().nullable().optional(),
      })
      .optional(),
  }),
});

export const collections = { categories, listicles, settings };
