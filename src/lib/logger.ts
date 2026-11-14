const LOG_ENDPOINT = import.meta.env.API_URL ?? '';
const LOG_TOKEN = import.meta.env.LOG_TOKEN ?? '';

const THROTTLE_MS = 5000;
const MAX_CONTEXT_LENGTH = 100;
const seen = new Map<string, number>();

function getErrorKey(error: unknown): string {
  if (error instanceof Error) return error.message.slice(0, 50);
  return String(error).slice(0, 50);
}

// El contexto puede traer lo que escribió un visitante (p. ej. el slug): se recorta
function trimContext(context: Record<string, string | number> = {}) {
  return Object.fromEntries(
    Object.entries(context).map(([key, value]) => [
      key,
      typeof value === 'string' ? value.slice(0, MAX_CONTEXT_LENGTH) : value,
    ])
  );
}

export async function logError(error: unknown, context?: Record<string, string | number>) {
  const key = getErrorKey(error);
  const last = seen.get(key) ?? 0;
  if (Date.now() - last < THROTTLE_MS) return;
  seen.set(key, Date.now());

  // eslint-disable-next-line no-console -- solo en dev, para no perder errores silenciados
  if (import.meta.env.DEV) console.error('[logError]', context, error);

  // Sin backend o sin token no hay a dónde mandarlo
  if (!LOG_ENDPOINT || !LOG_TOKEN) return;

  const isError = error instanceof Error;

  const payload = {
    errorType: isError ? error.constructor.name : 'Unknown',
    message: isError ? error.message.slice(0, 200) : String(error).slice(0, 200),
    stack: isError ? error.stack?.split('\n').slice(0, 5) : undefined,
    route: typeof window !== 'undefined' ? window.location.pathname : undefined,
    context: {
      ...trimContext(context),
      app: 'eddm-astro-frontend-v2.2026',
      env: import.meta.env.MODE,
    },
  };

  try {
    await fetch(`${LOG_ENDPOINT}/api/logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-log-token': LOG_TOKEN,
      },
      body: JSON.stringify(payload),
    });
  } catch {
    // silencioso — nunca romper la app por un log fallido
  }
}
