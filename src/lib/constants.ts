export const APP_ROUTES = {
  main: '/',
  journey: '/viaje',
  tales: '/relatos',
  trip: '/recorrido',
  furtherTime: '/mas-aca-en-el-tiempo',
  poems: '/poemas',
  gallery: '/galeria',
  letters: '/cartas',
} as const;

export const APP_ROUTER = {
  HOME: `${APP_ROUTES.main}`,
  JOURNEY: `${APP_ROUTES.journey}`,
  ARTICLES: `${APP_ROUTES.journey}/article`,
  ARTICLE: (slug: string) => `${APP_ROUTES.journey}/${slug}`,
  TALES: `${APP_ROUTES.tales}`,
  TALE: (slug: string) => `${APP_ROUTES.tales}/${slug}`,
  TRIP: `${APP_ROUTES.trip}`,
  FURTHER_TIME: `${APP_ROUTES.furtherTime}`,
  FURTHER_TIME_ARTICLE: (slug: string) => `${APP_ROUTES.furtherTime}/${slug}`,
  POEMS: `${APP_ROUTES.poems}`,
  POEM: (slug: string) => `${APP_ROUTES.poems}/${slug}`,
  GALLERY: `${APP_ROUTES.gallery}`,
  GALLERY_PLACE: (slug: string) => `${APP_ROUTES.gallery}/${slug}`,
  LETTERS: `${APP_ROUTES.letters}`,
  /** La concordancia: se descarga recién cuando alguien busca una palabra */
  LETTERS_WORDS: `${APP_ROUTES.letters}/palabras.json`,
} as const;

export type NavigateSection = 'articles' | 'further' | 'tales' | 'poems';

export const EXTERNAL_API_ENDPOINTS = {
  TALES: '/tales',
  ARTICLES: '/articles',
  POEMS: '/poems',
  FURTHER_TIME: '/further-time',
  //Entries by slug
  ARTICLE: (slug: string) => `/articles/${slug}`,
  TALE: (slug: string) => `/tales/${slug}`,
  FURTHER_TIME_ARTICLE: (slug: string) => `/further-time/${slug}`,
  POEM: (slug: string) => `/poems/${slug}`,
  // Content Navigates
  CONTENT_NAVIGATE: '/content-navigate',
  SECTION_CONTENT_NAVIGATE: (section: NavigateSection) => `/content-navigate/${section}`,

  // Notion
  NOTION_TALE: '/notion/tale',
  NOTION_ARTICLE: '/notion/article',
  NOTION_FURTHER_TIME_ARTICLE: '/notion/further-time',
  // Misc
  TRIP: '/trip',
  LOCATION: '/location',
  GALLERY: '/gallery',
  GALLERY_PLACE: (slug: string) => `/gallery/${slug}`,
} as const;
export const NOTION_PARAM_KEY = {
  'notion-id': 'notion-page-id',
  slug: 'slug',
};
