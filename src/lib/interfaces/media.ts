export interface MediaItem {
  type: 'image' | 'video';
  src: string;
  alt?: string;
  poster?: string;

  width?: number;
  height?: number;
}
