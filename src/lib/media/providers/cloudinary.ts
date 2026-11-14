import { fetchMedia } from '@/lib/media/remote';

export async function getCloudinarySize(url: string) {
  const infoUrl = url.replace('/upload/', '/upload/fl_getinfo/');

  const response = await fetchMedia(infoUrl);
  if (!response.ok) return null;

  const json = await response.json();
  if (!json?.input?.width || !json?.input?.height) return null;

  return {
    width: json.input.width,
    height: json.input.height,
  };
}

export function getCloudinaryPoster(url: string) {
  return url.replace('/video/upload/', '/video/upload/so_1,f_jpg/').replace(/\.[^.]+$/, '.jpg');
}
