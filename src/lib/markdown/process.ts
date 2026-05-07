import { marked } from 'marked';

type ProcessedSection = {
  title: string;
  htmlContent: string | Promise<string>;
  media: {
    type: 'image' | 'video';
    alt: string;
    src: string;
    poster?: string;
    width?: number;
    height?: number;
  }[];
};

const imageSizeCache = new Map();

async function getImageSize(url: string) {
  const cached = imageSizeCache.get(url);

  if (cached) return cached;

  try {
    const infoUrl = url.replace('/upload/', '/upload/fl_getinfo/');

    const response = await fetch(infoUrl);
    const json = await response.json();

    const result = {
      width: json.input.width,
      height: json.input.height,
    };

    imageSizeCache.set(url, result);

    return result;
  } catch {
    return {
      width: 1200,
      height: 900,
    };
  }
}

export async function processDiario(content: string | undefined): Promise<ProcessedSection[]> {
  if (!content) return [];

  const sections = content.split(/(?=### \d+ de )/g);

  const processedSections = await Promise.all(
    sections.map(async (section) => {
      const titleMatch = section.match(/### (.*)/);
      const title = titleMatch ? titleMatch[1] : '';

      const mediaRegex = /(?:!\[(.*?)\]|\[(.*?)\])\((https?:\/\/.*?)\)/g;
      const mediaMatches = [...section.matchAll(mediaRegex)];

      const media = await Promise.all(
        mediaMatches.map(async (m) => {
          const altOrName = m[1] || m[2] || '';
          const url = m[3].trim();

          const isVideo = /\.(webm|mp4|mov|ogg|m4v)($|\?)/i.test(url);

          let dimensions = {
            width: 1200 as number,
            height: 900 as number,
          };

          if (!isVideo) {
            dimensions = await getImageSize(url);
          }

          return {
            type: isVideo ? ('video' as const) : ('image' as const),
            alt: altOrName,
            src: url,
            poster: isVideo
              ? url
                  .replace('/video/upload/', '/video/upload/so_1,f_jpg/')
                  .replace(/\.[^.]+$/, '.jpg')
              : undefined,
            ...dimensions,
          };
        })
      );

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
  );

  return processedSections.filter((s) => s.title !== '');
}
