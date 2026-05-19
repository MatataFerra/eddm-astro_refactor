import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ProcessedSection } from '@/lib/markdown/process';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(text: string) {
  const [first, ...rest] = text.split('');
  const capitalize = first.toUpperCase();

  return [capitalize, ...rest].join('');
}

export function htmlContent(content: Awaited<ProcessedSection[]>) {
  if (content && Array.isArray(content)) return content[0].htmlContent;

  return content;
}
