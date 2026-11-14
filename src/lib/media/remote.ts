// Medir una foto no puede colgar la página ni bajar un archivo gigante
const TIMEOUT_MS = 5000;
const MAX_BYTES = 8 * 1024 * 1024;

/** `fetch` con timeout para leer metadatos de medios remotos */
export function fetchMedia(url: string, init?: RequestInit) {
  return fetch(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) });
}

/** Lee el cuerpo hasta `MAX_BYTES`; si el archivo es más grande devuelve `null` */
export async function readLimited(response: Response): Promise<Buffer | null> {
  const declared = Number(response.headers.get('content-length'));
  if (declared > MAX_BYTES || !response.body) {
    await response.body?.cancel();
    return null;
  }

  const chunks: Uint8Array[] = [];
  let total = 0;
  const reader = response.body.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}
