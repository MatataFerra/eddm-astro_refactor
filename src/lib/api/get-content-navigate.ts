import { fetchData, type ApiResponse } from '@/lib/fetch';
import { EXTERNAL_API_ENDPOINTS, type NavigateSection } from '@/lib/constants';
import { logError } from '@/lib/logger';

export async function getContentNavigate<T>(
  section: NavigateSection
): Promise<ApiResponse<T> | null> {
  try {
    const result = await fetchData<T>(EXTERNAL_API_ENDPOINTS.SECTION_CONTENT_NAVIGATE(section));
    return result;
  } catch (error) {
    logError(error, {
      function: 'getContentNavigate',
      endpoint: EXTERNAL_API_ENDPOINTS.SECTION_CONTENT_NAVIGATE(section),
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
