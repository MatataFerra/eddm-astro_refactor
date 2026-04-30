export type Mes = {
  mes: string;
  year: string;
  semanas: Semana[];
};

export type Semana = {
  num: number;
  titulo: string;
  dates: string;
  cover: string;
  lugares: string[];
  slug: string;
};
