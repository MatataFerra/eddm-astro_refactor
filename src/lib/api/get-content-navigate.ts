import { fetchData, type ApiResponse } from '@/lib/fetch';
import { EXTERNAL_API_ENDPOINTS } from '@/lib/constants';
import { logError } from '@/lib/logger';

export async function getContentNavigateArticles<T>(): Promise<ApiResponse<T> | null> {
  try {
    const result = await fetchData<T>(EXTERNAL_API_ENDPOINTS.ARTICLES_CONTENT_NAVIGATE);
    return result;
  } catch (error) {
    logError(error, { function: 'getContentNavigateArticles' });
    return null;
  }
}

export async function getContentNavigateFurtherTimeArticles<T>(): Promise<ApiResponse<T> | null> {
  try {
    return await fetchData<T>(EXTERNAL_API_ENDPOINTS.FURTHER_TIME_CONTENT_NAVIGATE);
  } catch (error) {
    logError(error, { function: 'getContentNavigateFurtherTimeArticles' });
    return null;
  }
}

export async function getContentNavigateTales<T>(): Promise<ApiResponse<T> | null> {
  try {
    return await fetchData<T>(EXTERNAL_API_ENDPOINTS.TALES_CONTENT_NAVIGATE);
  } catch (error) {
    logError(error, { function: 'getContentNavigateTales' });
    return null;
  }
}

export async function getterHandler<T>(
  contentType: 'articles' | 'tales' | 'further-time'
): Promise<ApiResponse<T> | null> {
  try {
    const endpointMap = {
      articles: EXTERNAL_API_ENDPOINTS.ARTICLES_CONTENT_NAVIGATE,
      tales: EXTERNAL_API_ENDPOINTS.TALES_CONTENT_NAVIGATE,
      'further-time': EXTERNAL_API_ENDPOINTS.FURTHER_TIME_CONTENT_NAVIGATE,
    };

    const endpoint = endpointMap[contentType];
    if (!endpoint) {
      throw new Error(`Invalid content type: ${contentType}`);
    }

    return await fetchData<T>(endpoint);
  } catch (error) {
    logError(error, { function: 'getContentNavigate', contentType });
    return null;
  }
}

export async function getAllContentNavigate<T>(): Promise<ApiResponse<T> | null> {
  try {
    return await fetchData<T>(EXTERNAL_API_ENDPOINTS.CONTENT_NAVIGATE);
  } catch (error) {
    logError(error, { function: 'getAllContentNavigate' });
    return null;
  }
}
