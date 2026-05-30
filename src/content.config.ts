import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const listicles = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/listicles' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    category: z.string(),
    dek: z.string(),
    heroImage: z.string().optional(),
    quickAnswer: z.string(),
    lastUpdated: z.coerce.date(),
    items: z.array(
      z.object({
        rank: z.number(),
        name: z.string(),
        image: z.string().optional(),
        startingPrice: z.string(),
        bestFor: z.string(),
        description: z.string(),
        pros: z.array(z.string()),
        cons: z.array(z.string()),
        url: z.string().url(),
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

export const collections = { listicles };
