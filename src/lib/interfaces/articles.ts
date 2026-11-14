import { z } from 'astro/zod';
import { ExtendedArticleSchema } from '@/lib/schemas';

export type Article = z.infer<typeof ExtendedArticleSchema>;
export type PartialContentNavigateFields = Pick<Article, 'createdAt'>;
export type PickedContentNavigate = Pick<
  Article,
  | 'id'
  | 'order'
  | 'slug'
  | 'category'
  | 'title'
  | 'header'
  | 'createdAt'
  | 'summary'
  | 'description'
>;
