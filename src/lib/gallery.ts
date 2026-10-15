export const pad = (n: number) => String(n).padStart(2, '0');

export const formatCount = (n: number) => `${n} ${n === 1 ? 'foto' : 'fotos'}`;
