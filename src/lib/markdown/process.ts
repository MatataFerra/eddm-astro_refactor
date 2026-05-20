import { marked } from 'marked';
import { getMediaSize } from '@/lib/media/dimensions';
import { getVideoPoster } from '@/lib/media/poster';

export type ProcessedSection = {
  title: string | undefined;
  htmlContent: string | Promise<string>;
  media:
    | {
        type: 'image' | 'video';
        alt: string;
        src: string;
        poster?: string;
        width?: number;
        height?: number;
      }[]
    | undefined;
};

export async function processDiario(content: string | undefined): Promise<ProcessedSection[]> {
  if (!content) return [];

  const sections = content
    .split(/(?=^###\s)/gm)
    .map((s) => s.trim())
    .filter(Boolean);

  const processedSections = await Promise.all(
    sections.map(async (section) => {
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
            const response = await getMediaSize(url);

            if (response) {
              dimensions = response;
            }
          }

          const mediaType: 'image' | 'video' = isVideo ? 'video' : 'image';

          return {
            type: mediaType,
            alt: altOrName,
            src: url,

            poster: isVideo ? getVideoPoster(url) : undefined,

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
