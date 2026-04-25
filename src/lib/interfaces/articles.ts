import { z } from 'astro/zod';
import { ExtendedArticleSchema } from '@/lib/schemas';
import type { ApiResponse } from '@/lib/fetch';
import type { ContentBySlug } from '@/lib/interfaces/share';

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

export type ArticlePromise = Promise<ApiResponse<ContentBySlug<Article>> | null>;
