import { marked } from 'marked';

type ProcessedSection = {
  title: string;
  htmlContent: string | Promise<string>;
  media: {
    type: 'image' | 'video';
    alt: string;
    src: string;
    poster?: string;
  }[];
};

export function processDiario(content: string | undefined): ProcessedSection[] {
  if (!content) return [];

  const sections = content.split(/(?=### \d+ de )/g);

  const processedSections = sections
    .map((section) => {
      const titleMatch = section.match(/### (.*)/);
      const title = titleMatch ? titleMatch[1] : '';

      const mediaRegex = /(?:!\[(.*?)\]|\[(.*?)\])\((https?:\/\/.*?)\)/g;
      const mediaMatches = [...section.matchAll(mediaRegex)];

      const media = mediaMatches.map((m) => {
        const altOrName = m[1] || m[2] || '';
        const url = m[3].trim();

        const isVideo = /\.(webm|mp4|mov|ogg|m4v)($|\?)/i.test(url);

        return {
          type: isVideo ? ('video' as const) : ('image' as const),
          alt: altOrName,
          src: url,
          poster: isVideo
            ? url.replace('/video/upload/', '/video/upload/so_1,f_jpg/').replace(/\.[^.]+$/, '.jpg')
            : undefined,
        };
      });

      const rawText = section
        .replace(/### .*/, '')
        .replace(/(?:!\[.*?\]|\[.*?\])\(https?:\/\/.*?\)/g, '')
        .trim();

      return {
        title,
        htmlContent: marked.parse(rawText),
        media,
      };
    })
    .filter((s) => s.title !== '');

  return processedSections;
}
