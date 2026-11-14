export interface Location {
  name: string;
  metadata: {
    emoji: string;
    description: string;
    /** Foto del lugar (R2). Opcional: la carga el formulario de ubicación del backend. */
    image?: string;
    /** Zona IANA del lugar, p. ej. "Europe/Berlin": decide la luz de la página. */
    timeZone?: string;
  };
}
