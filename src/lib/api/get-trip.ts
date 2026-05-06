import { fetchData, type ApiResponse } from '@/lib/fetch';
import { EXTERNAL_API_ENDPOINTS } from '@/lib/constants';
import { logError } from '@/lib/logger';

export async function getTrip<T>(): Promise<ApiResponse<T> | null> {
  try {
    const response = await fetchData<T>(EXTERNAL_API_ENDPOINTS.TRIP);

    return response;
  } catch (error) {
    logError(error, { function: 'getTrip' });
    return null;
  }
}
