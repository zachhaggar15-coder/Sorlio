import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const CATEGORIES = [
  'app-comparisons',
  'learning-method',
  'practice-resources',
] as const;

export const INTENTS = [
  'commercial-comparison',
  'informational',
  'practice',
] as const;

const guides = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
  schema: z
    .object({
      title: z.string().min(10).max(90),
      description: z.string().min(50).max(165),
      category: z.enum(CATEGORIES),
      searchIntent: z.enum(INTENTS),
      primaryKeyword: z.string().min(3),
      publishedDate: z.coerce.date(),
      updatedDate: z.coerce.date(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      // Position used for ordering in listings. Lower numbers appear first.
      order: z.number().int().default(100),
      // Only set this when a person has checked the content against a source.
      // Articles default to "unverified" until a human has reviewed them.
      productClaimsVerified: z.boolean().default(false),
      sources: z
        .array(z.object({ label: z.string(), url: z.string().url().optional(), note: z.string().optional() }))
        .default([]),
    })
    .refine((d) => d.updatedDate >= d.publishedDate, {
      message: 'updatedDate must be on or after publishedDate',
      path: ['updatedDate'],
    }),
});

export const collections = { guides };
