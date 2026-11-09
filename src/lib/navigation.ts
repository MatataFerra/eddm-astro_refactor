import { APP_ROUTER } from '@/lib/constants';

type NavSection = {
  href: string;
  name: string;
  hover: string;
  active: string;
};

// Cada sección tiene su color: es el hilo que conecta nav, footer y páginas internas.
export const NAV_SECTIONS: NavSection[] = [
  {
    href: APP_ROUTER.JOURNEY,
    name: 'Un año viajando',
    hover: 'hover:text-green-main',
    active: 'text-green-main',
  },
  {
    href: APP_ROUTER.TALES,
    name: 'Relatos',
    hover: 'hover:text-accent-text',
    active: 'text-accent-text',
  },
  {
    href: APP_ROUTER.POEMS,
    name: 'Poemas',
    hover: 'hover:text-lilac-text',
    active: 'text-lilac-text',
  },
  {
    href: APP_ROUTER.FURTHER_TIME,
    name: 'Más acá en el tiempo',
    hover: 'hover:text-blue-soft',
    active: 'text-blue-soft',
  },
  {
    href: APP_ROUTER.TRIP,
    name: 'Recorrido',
    hover: 'hover:text-accent-text',
    active: 'text-accent-text',
  },
  {
    href: APP_ROUTER.GALLERY,
    name: 'Galería',
    hover: 'hover:text-coral-text',
    active: 'text-coral-text',
  },
];

export const isActivePath = (currentPath: string, href: string) =>
  currentPath === href || currentPath.startsWith(`${href}/`);
