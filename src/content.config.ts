import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const categories = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/categories' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    coverImage: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
});

const listicles = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/listicles' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
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
