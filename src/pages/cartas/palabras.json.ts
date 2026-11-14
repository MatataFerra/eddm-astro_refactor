import type { APIRoute } from 'astro';
import { getConcordance } from '@/lib/adapters/concordance-adapter';

export const prerender = true;

export const GET: APIRoute = async () =>
  new Response(JSON.stringify(await getConcordance()), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
