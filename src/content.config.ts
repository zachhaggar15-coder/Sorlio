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
      // Shown as a "How this comparison was made" box. Optional.
      methodology: z.string().min(40).optional(),
      // Visible FAQ. The same text is emitted as FAQPage structured data.
      faq: z
        .array(z.object({ question: z.string().min(10), answer: z.string().min(20) }))
        .max(6)
        .default([]),
      sources: z
        .array(z.object({ label: z.string(), url: z.string().url().optional(), note: z.string().optional() }))
        .default([]),
    })
    .refine((d) => d.updatedDate >= d.publishedDate, {
      message: 'updatedDate must be on or after publishedDate',
      path: ['updatedDate'],
    }),
});

// Verified product facts. A record is only published when verified is true,
// and the build fails if a verified record is more than 90 days past its check.
const MAX_CHECK_AGE_DAYS = 90;

const products = defineCollection({
  loader: glob({ pattern: '**/*.{json,yaml,yml}', base: './src/content/products' }),
  schema: z
    .object({
      name: z.string().min(2),
      developer: z.string().min(2),
      platforms: z.string().min(2),
      freeAccess: z.string().min(5),
      paidAccess: z.string().min(5),
      priceModel: z.string().min(3),
      sourceUrl: z.string().url(),
      checkedDate: z.coerce.date(),
      verified: z.boolean().default(false),
    })
    .refine(
      (d) => {
        if (!d.verified) return true;
        const ageDays = (Date.now() - d.checkedDate.getTime()) / 86_400_000;
        return ageDays <= MAX_CHECK_AGE_DAYS;
      },
      { message: `verified product facts must be re-checked within ${MAX_CHECK_AGE_DAYS} days`, path: ['checkedDate'] },
    ),
});

export const collections = { guides, products };
