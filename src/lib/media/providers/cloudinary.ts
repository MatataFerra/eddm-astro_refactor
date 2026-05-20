export async function getCloudinarySize(url: string) {
  const infoUrl = url.replace('/upload/', '/upload/fl_getinfo/');

  const response = await fetch(infoUrl);

  const json = await response.json();

  return {
    width: json.input.width,
    height: json.input.height,
  };
}

export function getCloudinaryPoster(url: string) {
  return url.replace('/video/upload/', '/video/upload/so_1,f_jpg/').replace(/\.[^.]+$/, '.jpg');
}
