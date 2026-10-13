export const APP_ROUTES = {
  main: '/',
  journey: '/viaje',
  tales: '/relatos',
  trip: '/recorrido',
  furtherTime: '/mas-aca-en-el-tiempo',
  poems: '/poemas',
} as const;

export type RoutePaths = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];

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
} as const;

type NavigateSection = 'articles' | 'further' | 'tales' | 'poems';

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
  STATS: '/stats',
  TRIP: '/trip',
  LAST_ARTICLE: '/articles/last',
  LAST_ENTRY: '/entries/last',
  LOCATION: '/location',
} as const;

export const FALLBACK_SLUG = '__placeholder__' as const;
export const NOTION_PARAM_KEY = {
  'notion-id': 'notion-page-id',
  slug: 'slug',
};
export const LOCALSTORAGE_KEYS = {
  BOOKMARKED_ARTICLES: 'bookmarkedArticles',
  BOOKMARKED_TALES: 'bookmarkedTales',
  EDDM_CONFIG_OBJECT: 'eddm-config-object',
} as const;

export const TRANSLATE_ARTICLE_READ_STATUS = {
  es: {
    read: 'Leído',
    reading: 'Leyendo',
    unread: 'No leído',
  },
} as const;

export const VIDEO_SIZE = {
  small: {
    width: 320,
    height: 240,
  },
  medium: {
    width: 640,
    height: 360,
  },
  large: {
    width: 1280,
    height: 720,
  },
} as const;

export const CONTEXT_TITLE = {
  es: 'Prólogo',
};

export const TRANSLATIONS: Record<string, Record<string, string>> = {
  es: { notes: 'Notas', countries: 'Países', km: 'Km recorridos', days: 'Días de viaje' },
};
