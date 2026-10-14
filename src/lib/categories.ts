import type { CollectionEntry } from 'astro:content';

export type Category = CollectionEntry<'guides'>['data']['category'];

export const CATEGORY_LABELS: Record<Category, string> = {
  'app-comparisons': 'App comparisons',
  'learning-method': 'Learning method',
  'practice-resources': 'Practice resources',
};

export const CATEGORY_BLURBS: Record<Category, string> = {
  'app-comparisons': 'Which French-learning apps suit which goals, and how they differ.',
  'learning-method': 'How to structure your French study, and what the research says about it.',
  'practice-resources': 'Reading and listening practice you can use this week.',
};
