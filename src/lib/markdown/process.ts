import { marked } from 'marked';

type ProcessedSection = {
  title: string | undefined;
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

  const sections = content
    .split(/(?=^###\s)/gm)
    .map((s) => s.trim())
    .filter(Boolean);

  const processedSections = await Promise.all(
    sections.map(async (section) => {
      // Busca heading opcional
      const titleMatch = section.match(/^###\s+(.*)$/m);

      const title = titleMatch?.[1]?.trim();

      const mediaRegex = /(?:!\[(.*?)\]|\[(.*?)\])\((https?:\/\/.*?)\)/g;

      const mediaMatches = [...section.matchAll(mediaRegex)];

      const media = await Promise.all(
        mediaMatches.map(async (m) => {
          const altOrName = m[1] || m[2] || '';
          const url = m[3].trim();

          const isVideo = /\.(webm|mp4|mov|ogg|m4v)($|\?)/i.test(url);

          let dimensions = {
            width: 1200,
            height: 900,
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
        .replace(/^###\s+.*$/m, '')
        .replace(/(?:!\[.*?\]|\[.*?\])\(https?:\/\/.*?\)/g, '')
        .trim();

      return {
        title,
        htmlContent: marked.parse(rawText),
        media,
      };
    })
  );

  return processedSections.filter((s) => s.title || s.htmlContent || s.media.length);
}
