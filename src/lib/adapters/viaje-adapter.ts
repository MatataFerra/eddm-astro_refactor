import type { ContentNavigate } from '@/lib/interfaces/share';
import type { Mes, Semana } from '@/lib/interfaces/viaje';

const CATEGORY_PRIORITY: Record<string, number> = {
  context: 0,
  febrero: 1,
  marzo: 2,
  abril: 3,
  mayo: 4,
  junio: 5,
  julio: 6,
  agosto: 7,
  septiembre: 8,
  octubre: 9,
  noviembre: 10,
  diciembre: 11,
  'enero-25': 12,
  'febrero-25': 13,
};

export function adaptArticlesToMeses(articles: ContentNavigate[]): Mes[] {
  const mesesMap: Record<string, Mes> = {};

  articles.forEach((article) => {
    const categoryName = article.category?.name.toLowerCase() || 'otros';

    const key = categoryName;

    if (!mesesMap[key]) {
      mesesMap[key] = {
        mes:
          categoryName === 'context'
            ? 'Prólogo'
            : categoryName.charAt(0).toUpperCase() + categoryName.slice(1).replace('-25', ' 2025'),
        year: categoryName.includes('-25') ? '2025' : categoryName === 'context' ? '' : '2024',
        semanas: [],
      };
    }

    const semana: Semana = {
      num: article.id || 0,
      titulo: article.title,
      dates: article.description || '',
      cover: article.header?.url || '',
      lugares: article.summary ? article.summary.split(',').map((l) => l.trim()) : [],
      slug: article.slug,
    };

    mesesMap[key].semanas.push(semana);
  });

  const resultado = Object.values(mesesMap);

  resultado.forEach((mes) => {
    mes.semanas.sort((a, b) => {
      const artA = articles.find((art) => art.id === a.num);
      const artB = articles.find((art) => art.id === b.num);
      return (artA?.order || 0) - (artB?.order || 0);
    });
  });

  return resultado.sort((a, b) => {
    const priorityA =
      CATEGORY_PRIORITY[
        a.mes.toLowerCase().replace('prólogo', 'context').replace(' 2025', '-25')
      ] ?? 99;
    const priorityB =
      CATEGORY_PRIORITY[
        b.mes.toLowerCase().replace('prólogo', 'context').replace(' 2025', '-25')
      ] ?? 99;
    return priorityA - priorityB;
  });
}
