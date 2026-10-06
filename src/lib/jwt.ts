const API_KEY = import.meta.env.FRONTEND_API_KEY;

export function getAuthToken(): string {
  if (!API_KEY) {
    throw new Error('FRONTEND_API_KEY not defined');
  }
  return `Bearer ${API_KEY}`;
}
