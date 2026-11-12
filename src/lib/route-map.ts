import { geoEqualEarth, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import land110 from 'world-atlas/land-110m.json';

const WIDTH = 1000;
// El mapa se centra un poco al este de Greenwich para que el corte caiga en el Pacífico
const CENTER = 15;
// Del sur de Argentina al norte de Europa: el resto del mundo es mar o hielo
const NORTH = 66;
const SOUTH = -57;
// Cuánto se curva cada tramo, en proporción a su largo
const BEND = 0.18;

export type RouteMap = {
  viewBox: string;
  land: string;
  route: string;
  dots: string;
  /** Posición de cada parada en porcentaje del mapa, para poner etiquetas en HTML */
  points: { x: number; y: number }[];
};

const round = (n: number) => Math.round(n * 10) / 10;

/** El mundo y la ruta, en SVG, calculados en el build */
export function buildRouteMap(coordinates: [number, number][]): RouteMap {
  const projection = geoEqualEarth().rotate([-CENTER, 0]).fitWidth(WIDTH, { type: 'Sphere' });
  const top = projection([CENTER, NORTH])![1];
  const bottom = projection([CENTER, SOUTH])![1];
  const height = bottom - top;

  const topology = land110 as unknown as Topology<{ land: GeometryCollection }>;
  const land = geoPath(projection).digits(0)(feature(topology, topology.objects.land)) ?? '';

  const points = coordinates.map((c) => projection(c)!).map(([x, y]) => [round(x), round(y)]);

  // Cada tramo es una curva suave hacia su izquierda; los saltos de pocos km casi no se curvan
  const route = points
    .map(([x, y], i) => {
      if (i === 0) return `M${x} ${y}`;
      const [px, py] = points[i - 1];
      if (px === x && py === y) return '';
      const cx = round((px + x) / 2 - (y - py) * BEND);
      const cy = round((py + y) / 2 + (x - px) * BEND);
      return `Q${cx} ${cy} ${x} ${y}`;
    })
    .join('');

  // Un punto por parada: un trazo de largo cero con punta redonda
  const dots = points.map(([x, y]) => `M${x} ${y}h0`).join('');

  return {
    viewBox: `0 ${round(top)} ${WIDTH} ${round(height)}`,
    land,
    route,
    dots,
    points: points.map(([x, y]) => ({
      x: round((x / WIDTH) * 100),
      y: round(((y - top) / height) * 100),
    })),
  };
}
