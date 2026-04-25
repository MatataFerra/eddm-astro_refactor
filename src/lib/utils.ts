import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(text: string) {
  const [first, ...rest] = text.split('');
  const capitalize = first.toUpperCase();

  return [capitalize, ...rest].join('');
}
