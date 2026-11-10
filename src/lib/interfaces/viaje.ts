export type Mes = {
  key: string;
  mes: string;
  /** Abreviatura para la tira del año: "feb", "mar"… (vacía en el prólogo) */
  corto: string;
  year: string;
  semanas: Semana[];
};

export type Semana = {
  slug: string;
  titulo: string;
  cover: string;
  /** "1–7 abr", "29 feb – 6 mar"; si el resumen no es un rango, el resumen tal cual */
  detalle: string;
};
