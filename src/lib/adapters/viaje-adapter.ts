import type { ContentNavigate } from '@/lib/interfaces/share';
import type { Mes, Semana } from '@/lib/interfaces/viaje';

type MesDef = { mes: string; corto: string; year: string };

// Orden cronológico del viaje (feb 2024 → feb 2025). La categoría del artículo es la clave.
const MESES: Record<string, MesDef> = {
  context: { mes: 'Prólogo', corto: '', year: '' },
  febrero: { mes: 'Febrero', corto: 'feb', year: '2024' },
  marzo: { mes: 'Marzo', corto: 'mar', year: '2024' },
  abril: { mes: 'Abril', corto: 'abr', year: '2024' },
  mayo: { mes: 'Mayo', corto: 'may', year: '2024' },
  junio: { mes: 'Junio', corto: 'jun', year: '2024' },
  julio: { mes: 'Julio', corto: 'jul', year: '2024' },
  agosto: { mes: 'Agosto', corto: 'ago', year: '2024' },
  septiembre: { mes: 'Septiembre', corto: 'sep', year: '2024' },
  octubre: { mes: 'Octubre', corto: 'oct', year: '2024' },
  noviembre: { mes: 'Noviembre', corto: 'nov', year: '2024' },
  diciembre: { mes: 'Diciembre', corto: 'dic', year: '2024' },
  enero: { mes: 'Enero', corto: 'ene', year: '2025' },
  'enero-25': { mes: 'Enero', corto: 'ene', year: '2025' },
  'febrero-25': { mes: 'Febrero', corto: 'feb', year: '2025' },
};

const ORDEN = Object.keys(MESES);
const MESES_CORTOS = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

/**
 * Los resúmenes llegan en varios formatos ("Desde el 1/04/2024 al 7/04/2024",
 * "Del 1/05/24 al 7/05/24", "Desde el 2/02/2024 - 8/02/2024"). Sólo se usan día y mes:
 * el año sale del mes del viaje.
 */
export function formatRango(summary: string | null | undefined): string {
  const texto = summary?.trim() ?? '';
  const fechas = [...texto.matchAll(/(\d{1,2})\/(\d{1,2})(?:\/\d{2,4})?/g)].map(([, d, m]) => ({
    dia: Number(d),
    mes: MESES_CORTOS[Number(m) - 1],
  }));

  if (fechas.length < 2 || !fechas[0].mes || !fechas[1].mes) return texto;

  const [desde, hasta] = fechas;
  return desde.mes === hasta.mes
    ? `${desde.dia}–${hasta.dia} ${hasta.mes}`
    : `${desde.dia} ${desde.mes} – ${hasta.dia} ${hasta.mes}`;
}

export function adaptArticlesToMeses(articles: ContentNavigate[]): Mes[] {
  const porMes = new Map<string, (Semana & { order: number })[]>();

  for (const article of articles) {
    const key = article.category?.name.toLowerCase() ?? '';
    if (!MESES[key]) continue;

    const semanas = porMes.get(key) ?? [];
    semanas.push({
      slug: article.slug,
      titulo: article.title,
      cover: article.header?.url ?? '',
      detalle: formatRango(article.summary),
      order: article.order ?? 0,
    });
    porMes.set(key, semanas);
  }

  return [...porMes.entries()]
    .sort(([a], [b]) => ORDEN.indexOf(a) - ORDEN.indexOf(b))
    .map(([key, semanas]) => ({
      key,
      ...MESES[key],
      semanas: semanas
        .sort((a, b) => a.order - b.order)
        .map(({ order: _order, ...semana }) => semana),
    }));
}
