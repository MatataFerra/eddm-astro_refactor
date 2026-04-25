// src/store.ts
import { atom } from 'nanostores';

export const layoutStore = atom<'editorial' | 'cine' | 'narrativo'>('editorial');
export const accentStore = atom<'purple' | 'pink' | 'gold'>('gold');
export const typeStyleStore = atom<'italic' | 'upright'>('upright');
