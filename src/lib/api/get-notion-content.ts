import { fetchData, type ApiResponse } from '@/lib/fetch';
import { EXTERNAL_API_ENDPOINTS, NOTION_PARAM_KEY } from '@/lib/constants';
import { logError } from '@/lib/logger';

type GetNotionContentType = {
  query?: string;
};

export async function getArticleContentFromNotion<T>({
  query,
}: GetNotionContentType): Promise<ApiResponse<T> | null> {
  if (!query) return null;

  try {
    const response = await fetchData<T>(EXTERNAL_API_ENDPOINTS.NOTION_ARTICLE, {
      params: { [NOTION_PARAM_KEY.slug]: query },
    });

    return response;
  } catch (error) {
    logError(error, {
      function: 'getArticleContentFromNotion',
      query,

      file: 'src/lib/api/get-notion-content.ts',
      endpoint: EXTERNAL_API_ENDPOINTS.NOTION_ARTICLE,
    });
    return null;
  }
}
