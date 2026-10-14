import type { CollectionEntry } from 'astro:content';

export type Category = CollectionEntry<'guides'>['data']['category'];

export const CATEGORY_LABELS: Record<Category, string> = {
  'app-comparisons': 'App comparisons',
  'learning-method': 'Learning method',
  grammar: 'Grammar for readers',
  vocabulary: 'Vocabulary',
  'practice-resources': 'Practice resources',
};

export const CATEGORY_BLURBS: Record<Category, string> = {
  'app-comparisons': 'Which French-learning apps suit which goals, and how they differ.',
  'learning-method': 'How to structure your French study, and what the research says about it.',
  grammar: 'The grammar you meet while reading, explained so you can recognise it in a text.',
  vocabulary: 'Word families, patterns and word lists that make French reading faster.',
  'practice-resources': 'Reading passages with questions and answers you can use this week.',
};

// Order used in navigation and on the home page.
export const CATEGORY_ORDER: Category[] = [
  'learning-method',
  'grammar',
  'vocabulary',
  'practice-resources',
  'app-comparisons',
];

// Short labels for the compact section bar.
export const CATEGORY_SHORT: Record<Category, string> = {
  'app-comparisons': 'Comparisons',
  'learning-method': 'Method',
  grammar: 'Grammar',
  vocabulary: 'Vocabulary',
  'practice-resources': 'Practice',
};
