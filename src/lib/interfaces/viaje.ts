export type Mes = {
  mes: string;
  year: string;
  semanas: Semana[];
};

export type Semana = {
  num: number;
  titulo: string;
  cover: string;
  lugares: string[];
  slug: string;
};
