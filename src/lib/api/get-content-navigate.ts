import { fetchData, type ApiResponse } from '@/lib/fetch';
import { EXTERNAL_API_ENDPOINTS } from '@/lib/constants';
import { logError } from '@/lib/logger';

export async function getContentNavigateArticles<T>(): Promise<ApiResponse<T> | null> {
  try {
    const result = await fetchData<T>(EXTERNAL_API_ENDPOINTS.SECTION_CONTENT_NAVIGATE('articles'));
    return result;
  } catch (error) {
    logError(error, {
      function: 'getContentNavigateArticles',
      endpoint: EXTERNAL_API_ENDPOINTS.SECTION_CONTENT_NAVIGATE('articles'),
      file: 'src/lib/api/get-content-navigate.ts',
    });
    return null;
  }
}

export async function getContentNavigateFurtherTimeArticles<T>(): Promise<ApiResponse<T> | null> {
  try {
    return await fetchData<T>(EXTERNAL_API_ENDPOINTS.SECTION_CONTENT_NAVIGATE('further'));
  } catch (error) {
    logError(error, {
      function: 'getContentNavigateFurtherTimeArticles',
      endpoint: EXTERNAL_API_ENDPOINTS.SECTION_CONTENT_NAVIGATE('further'),
      file: 'src/lib/api/get-content-navigate.ts',
    });
    return null;
  }
}

export async function getContentNavigateTales<T>(): Promise<ApiResponse<T> | null> {
  try {
    return await fetchData<T>(EXTERNAL_API_ENDPOINTS.SECTION_CONTENT_NAVIGATE('tales'));
  } catch (error) {
    logError(error, {
      function: 'getContentNavigateTales',
      endpoint: EXTERNAL_API_ENDPOINTS.SECTION_CONTENT_NAVIGATE('tales'),
      file: 'src/lib/api/get-content-navigate.ts',
    });
    return null;
  }
}

export async function getContentNavigatePoems<T>(): Promise<ApiResponse<T> | null> {
  try {
    return await fetchData<T>(EXTERNAL_API_ENDPOINTS.SECTION_CONTENT_NAVIGATE('poems'));
  } catch (error) {
    logError(error, {
      function: 'getContentNavigatePoems',
      endpoint: EXTERNAL_API_ENDPOINTS.SECTION_CONTENT_NAVIGATE('poems'),
      file: 'src/lib/api/get-content-navigate.ts',
    });
    return null;
  }
}

export async function getAllContentNavigate<T>(): Promise<ApiResponse<T> | null> {
  try {
    return await fetchData<T>(EXTERNAL_API_ENDPOINTS.CONTENT_NAVIGATE);
  } catch (error) {
    logError(error, {
      function: 'getAllContentNavigate',
      endpoint: EXTERNAL_API_ENDPOINTS.CONTENT_NAVIGATE,
      file: 'src/lib/api/get-content-navigate.ts',
    });
    return null;
  }
}
