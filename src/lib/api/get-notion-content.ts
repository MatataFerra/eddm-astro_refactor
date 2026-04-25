import { fetchData, type ApiResponse } from '@/lib/fetch';
import { EXTERNAL_API_ENDPOINTS, NOTION_PARAM_KEY } from '@/lib/constants';
import { logError } from '@/lib/logger';

type GetNotionContentType = {
  strategy: 'slug' | 'notionPageId';
  query?: string;
};

export async function getTaleContentFromNotion<T>({
  strategy,
  query,
}: GetNotionContentType): Promise<ApiResponse<T> | null> {
  if (!query) return null;

  try {
    const response = await fetchData<T>(EXTERNAL_API_ENDPOINTS.NOTION_TALE, {
      params: { [NOTION_PARAM_KEY.slug]: query, strategy },
    });

    return response;
  } catch (error) {
    logError(error, { function: 'getTaleContentFromNotion', query, strategy });
    return null;
  }
}

export async function getArticleContentFromNotion<T>({
  strategy,
  query,
}: GetNotionContentType): Promise<ApiResponse<T> | null> {
  if (!query) return null;

  try {
    const response = await fetchData<T>(EXTERNAL_API_ENDPOINTS.NOTION_ARTICLE, {
      params: { [NOTION_PARAM_KEY.slug]: query, strategy },
    });

    return response;
  } catch (error) {
    logError(error, { function: 'getArticleContentFromNotion', query, strategy });
    return null;
  }
}

export async function getFurtherTimeArticlesContentFromNotion<T>({
  strategy,
  query,
}: GetNotionContentType): Promise<ApiResponse<T> | null> {
  if (!query) return null;

  try {
    const response = await fetchData<T>(EXTERNAL_API_ENDPOINTS.NOTION_FURTHER_TIME_ARTICLE, {
      params: { [NOTION_PARAM_KEY.slug]: query, strategy },
    });

    return response;
  } catch (error) {
    logError(error, { function: 'getFurtherTimeArticlesContentFromNotion', query, strategy });
    return null;
  }
}
