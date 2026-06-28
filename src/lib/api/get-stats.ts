import { fetchData, type ApiResponse } from '@/lib/fetch';
import { EXTERNAL_API_ENDPOINTS } from '@/lib/constants';
import { logError } from '@/lib/logger';

export async function getAllStats<T>(): Promise<ApiResponse<T> | null> {
  try {
    return await fetchData<T>(EXTERNAL_API_ENDPOINTS.STATS);
  } catch (error) {
    logError(error, {
      function: 'getAllStats',
      endpoint: EXTERNAL_API_ENDPOINTS.STATS,
      file: 'src/lib/api/get-stats.ts',
    });
    return null;
  }
}
