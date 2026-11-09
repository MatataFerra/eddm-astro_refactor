// Pide al proveedor la imagen al ancho justo. URLs de otros hosts quedan igual.
export function resizeImage(url: string, width: number): string {
  if (url.includes('res.cloudinary.com') && url.includes('/image/upload/')) {
    return url.replace('/image/upload/', `/image/upload/f_auto,q_auto,w_${width}/`);
  }

  if (url.includes('ik.imagekit.io')) {
    const [base, query = ''] = url.split('?');
    const params = new URLSearchParams(query);
    const tr = params.get('tr');
    params.set('tr', tr ? `${tr},w-${width}` : `w-${width},q-75`);
    return `${base}?${params.toString().replace(/%2C/g, ',')}`;
  }

  return url;
}

export function resizeSrcset(url: string, widths: number[]): string | undefined {
  if (!widths.length || resizeImage(url, widths[0]) === url) return undefined;
  return widths.map((w) => `${resizeImage(url, w)} ${w}w`).join(', ');
}
