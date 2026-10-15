export type GalleryPhoto = {
  id: string;
  url: string;
  alt: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
};

/** GET /api/gallery */
export type GalleryPlaceSummary = {
  slug: string;
  name: string;
  count: number;
  cover: Omit<GalleryPhoto, 'id' | 'caption'>;
};

/** GET /api/gallery/[slug] */
export type GalleryPlaceDetail = {
  slug: string;
  name: string;
  photos: GalleryPhoto[];
};
