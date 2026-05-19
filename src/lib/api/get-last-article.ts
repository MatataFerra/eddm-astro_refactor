import { fetchData, type ApiResponse } from '@/lib/fetch';
import { EXTERNAL_API_ENDPOINTS } from '@/lib/constants';
import { logError } from '@/lib/logger';

export async function getLastArticle<T>(): Promise<ApiResponse<T> | null> {
  try {
    return await fetchData<T>(EXTERNAL_API_ENDPOINTS.LAST_ARTICLE);
  } catch (error) {
    logError(error, { function: 'getContentNavigateTales' });
    return null;
  }
}
