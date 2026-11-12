# Reglas y Guía de Desarrollo del Proyecto

El diario de Mati: relatos, poemas y un año de viaje escrito semana a semana. Este repo es el
frontend; el contenido viene del backend `eddm-back-nextjs`.

## 1. Stack Tecnológico

- **Framework:** Astro v7 con `output: 'server'` y adapter de Vercel. Cada página decide si se
  prerenderiza (`export const prerender = true`); las entradas de `/viaje/[slug]` se renderizan
  bajo demanda.
- **UI interactiva:** HTML + CSS y un `<script>` chico dentro del `.astro`. No hay framework de
  islas; si alguna vez hace falta uno, se suma para esa pieza y no antes.
- **Estado global:** nanostores con `@nanostores/persistent` para lo que vive en `localStorage`
  (p. ej. semanas leídas en `src/lib/store/viaje-store.ts`); los `<script>` se suscriben con
  `.subscribe()`.
- **Lenguaje:** TypeScript estricto (`astro/tsconfigs/strict`), prohibido `any`.
- **Estilos:** Tailwind CSS v4. Los tokens viven en `@theme` dentro de `src/styles/global.css`.
  Diseño "Carta": los colores son los tokens `paper`, `ink`, `muted`, `rule` y `lamp` (cambian con
  la luz), más `sky-*` y `sun*`, que sólo decoran el horizonte de la home.
- **Contenido:** Markdown procesado con `marked` (`src/lib/markdown/process.ts`); galería con
  PhotoSwipe.
- **Imágenes:** Cloudinary, ImageKit y R2. Para pedir un ancho concreto usar
  `src/lib/media/resize.ts`, nunca el original a pantalla completa.
- **Entorno:** Node.js 24, pnpm.

## 2. Estructura

```text
src/
├── pages/          # rutas; una carpeta por sección (viaje, relatos, poemas, mas-aca-en-el-tiempo, …)
├── layouts/        # Layout.astro: head, meta, Nav, Footer
├── components/
│   ├── <sección>/  # componentes propios de cada sección
│   ├── home/       # piezas de la home
│   └── share/      # Nav, Footer, Article y lo compartido
├── lib/
│   ├── api/        # una función por endpoint; devuelven `ApiResponse<T> | null` y nunca lanzan
│   ├── adapters/   # transforman la respuesta de la API al modelo que usa la UI
│   ├── store/      # nanostores
│   ├── interfaces/ # tipos
│   └── constants.ts, navigation.ts, fetch.ts, logger.ts
└── styles/global.css
```

- **Datos:** toda llamada pasa por `fetchData` (`src/lib/fetch.ts`). Los errores se registran con
  `logError` y la función devuelve `null`; los componentes manejan siempre el caso vacío.
- **Lógica fuera de la vista:** agrupar, ordenar y calcular se hace en `lib/adapters` o en el
  frontmatter, no dentro del markup.
- **Rutas:** usar `APP_ROUTER` de `src/lib/constants.ts`, nunca strings sueltos.

## 3. Metodología y Flujo de Trabajo

- **Planificación previa (Spec-Driven):** Antes de modificar la arquitectura o tocar múltiples
  archivos, presenta una breve especificación del plan de cambios.
- **Estrategia de Ramas y PRs:** Nunca apliques cambios directamente sobre la rama principal. Crea
  siempre una rama de trabajo con prefijo `feat/`, `fix/`, `refactor/`, `style/` o `docs/` y abrí
  la Pull Request correspondiente. PRs chicos o medianos; si dependen de otro, se apilan sobre su
  rama.
- **Convención de Commits:** `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`.
- **Desarrollo local:** `pnpm dev`. El sitio necesita el backend `eddm-back-nextjs` corriendo en
  la URL de `API_URL` (por defecto `http://localhost:5500`); sin él, las páginas salen vacías.
- **Validación antes de cerrar una tarea:**
  - `pnpm exec tsc --noEmit`: sólo revisa archivos `.ts`.
  - `pnpm exec eslint src`.
  - `pnpm build`: es lo que realmente compila los `.astro`; tiene que pasar.
  - Prettier sobre los archivos tocados (`pnpm exec prettier --write <archivos>`).
  - Cambios visuales: revisar en 390, 768, 1024 y 1440 px de ancho.
  - Hoy no hay tests automatizados; si se agregan, también tienen que pasar.

## 4. Seguridad y Privacidad (Estricto)

- **Protección de Datos:** Bajo ningún concepto incluyas, transmitas o expongas el correo
  electrónico del usuario, tokens o datos sensibles en cabeceras HTTP (incluida `User-Agent`),
  logs, código fuente o archivos de configuración.
- **Manejo de Credenciales:** Toda clave o secreto (`API_URL`, `FRONTEND_API_KEY`, `LOG_TOKEN`) se
  maneja sólo con variables de entorno en `.env` / `.env.local`, que nunca se versionan. Se leen con
  `import.meta.env` y sólo del lado del servidor.

## 5. Patrones de Código

- Componentes modulares, legibles y fuertemente tipados: cada `.astro` declara `interface Props`.
- Separar datos de presentación: las páginas y adapters obtienen y transforman; los componentes
  reciben props ya listas.
- Pedir datos en paralelo con `Promise.all` cuando una página necesita varios endpoints.
- Prerenderizar todo lo que no cambie por request.
- Imágenes: `loading="lazy"` por defecto; la imagen principal de cada página va `eager` con
  `fetchpriority="high"` y siempre con dimensiones o `aspect-ratio` para evitar saltos de layout.

## 6. Estándares de Diseño UX/UI

- **Identidad (Carta):** el sitio se lee como cartas fechadas: lugar y fecha arriba a la derecha
  (`Dateline`), el texto (`Prose`) y la firma (`Signature`), en `src/components/share/carta/`.
  Bodoni Moda (`font-bodoni`) para encabezados, Newsreader (`font-newsreader`) para texto e
  interfaz; no hay sans, textura de papel ni letra manuscrita.
- **Luz:** la página toma la luz de la hora del lugar desde donde escribo (`data-phase`: `dawn`,
  `day`, `dusk`, `night`), que el script del `<head>` de `Layout.astro` elige con la zona horaria
  de `timeZone`. Los colores salen siempre de los tokens, nunca de hex sueltos; `lamp` es el único
  acento. Quien navega en modo oscuro nunca recibe la luz de día.
- **No es un blog genérico:** evitar grillas de cards idénticas, etiquetas en mayúsculas encima de
  cada título, flechas `→` pegadas a cada link y fade-in card por card al hacer scroll. Preferir
  índices tipográficos, fotos grandes y un solo momento animado por página.
- **Mobile-First:** diseñar desde mobile y escalar con los breakpoints nativos de Tailwind v4.
- **Jerarquía Visual y Espaciado:** escalas en múltiplos de 4 (`gap-2`, `p-4`, `space-y-6`) y
  jerarquías claras entre títulos y textos secundarios.
- **Accesibilidad (A11y):** estados `:focus-visible` claros (hay un anillo global), `aria-label` en
  botones con íconos, contraste AA en las cuatro luces (`muted` sobre `paper` ya lo cumple), respetar
  `prefers-reduced-motion` y botón de pausa en todo lo que se mueva solo más de 5 s.
- **Componentes Atómicos:** componentes pequeños, reutilizables y limpios.
- **Micro-interacciones:** transiciones suaves (`transition-colors duration-200`,
  `active:scale-95`) para dar feedback inmediato.
