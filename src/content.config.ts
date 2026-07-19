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
    tags: z.array(z.string()).default([]),
    dek: z.string(),
    heroImage: z.string().optional(),
    quickAnswer: z.string(),
    lastUpdated: z.coerce.date(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    // Short lede paragraph. The full article lives in the markdoc body.
    intro: z.string(),
    items: z.array(
      z.object({
        rank: z.number(),
        name: z.string(),
        logo: z.string().optional(),
        url: z.string().url(),
        startingPrice: z.string(),
        bestFor: z.string(),
        description: z.string(),
        pros: z.array(z.string()),
        cons: z.array(z.string()),
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

export const collections = { categories, listicles };
