import { fetchData, type ApiResponse } from '@/lib/fetch';
import { EXTERNAL_API_ENDPOINTS } from '@/lib/constants';
import { logError } from '@/lib/logger';

export async function getCurrentLocation<T>(): Promise<ApiResponse<T> | null> {
  try {
    const response = await fetchData<T>(EXTERNAL_API_ENDPOINTS.LOCATION);

    return response;
  } catch (error) {
    logError(error, {
      function: 'getCurrentLocation',
      endpoint: EXTERNAL_API_ENDPOINTS.LOCATION,
      file: 'src/lib/api/get-current-location.ts',
    });
    return null;
  }
}
