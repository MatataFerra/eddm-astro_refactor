import { FRONTEND_API_KEY as API_KEY } from 'astro:env/server';

export function getAuthToken(): string {
  if (!API_KEY) {
    throw new Error('FRONTEND_API_KEY not defined');
  }
  return `Bearer ${API_KEY}`;
}
