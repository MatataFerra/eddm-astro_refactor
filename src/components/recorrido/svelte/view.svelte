<script lang="ts">
  import { fade } from 'svelte/transition';

  export type ParadaUI = {
    id: string | number;
    lugar: string;
    pais: string;
    flag: string;
    fecha: string;
    year: number;
    kmDesdeOrigen: number;
    kmEtapa: number;
    kmAcumulados: number;
    cover: string | null;
    descripcion: string;
    tipo: 'origen' | 'destino' | 'proximo';
    semanas: string[];
  };

  let { paradas }: { paradas: ParadaUI[] } = $props();

  let filterPais = $state('Todos');
  let filterYear = $state('Todos');

  let PAISES = $derived([
    'Todos',
    ...new Set(paradas.filter((p) => p.tipo !== 'origen').map((p) => p.pais)),
  ]);
  let years = $derived(
    ['Todos', ...new Set(paradas.map((p) => p.year.toString()))].toSorted((a, b) =>
      a === 'Todos' ? -1 : b === 'Todos' ? 1 : parseInt(b) - parseInt(a)
    )
  );

  let filtered = $derived(
    paradas.filter((p) => {
      const pasaPais = filterPais === 'Todos' || p.pais === filterPais || p.tipo === 'origen';
      const pasaAno = filterYear === 'Todos' || p.year.toString() === filterYear;
      return pasaPais && pasaAno;
    })
  );

  let totalKm = $derived(paradas[paradas.length - 2]?.kmAcumulados || 0);
  let totalPaises = $derived(
    new Set(paradas.filter((p) => p.tipo === 'destino').map((p) => p.pais)).size
  );
  let totalCiudades = $derived(paradas.filter((p) => p.tipo === 'destino').length);

  function animateCounter(
    node: HTMLElement,
    { target, duration = 1800 }: { target: number; duration?: number }
  ) {
    let started = false;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started) {
          started = true;
          const start = performance.now();
          const step = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3); // Cubic ease-out
            node.innerText = Math.round(ease * target).toLocaleString('es-AR');
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    obs.observe(node);
    return {
      destroy() {
        obs.disconnect();
      },
    };
  }
</script>

<div class="bg-ash-main relative w-full pb-20">
  <!-- 1. HERO STATS -->
  <section class="relative mb-8 pt-28 pb-16 text-center">
    <!-- Glow de fondo -->
    <div
      class="pointer-events-none absolute top-[30%] left-1/2 h-100 w-175 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse,var(--color-orange-glow)_0%,transparent_65%)] opacity-90"
    ></div>

    <div
      class="reveal border-orange-main/25 bg-orange-soft mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
    >
      <div class="bg-orange-main h-1.5 w-1.5 animate-[pulse-dot_2s_infinite] rounded-full"></div>
      <span class="font-dm text-orange-text text-[11px] tracking-[0.12em] uppercase"
        >Feb 2024 — hoy</span
      >
    </div>

    <h1 class="reveal heading-1" style="--delay: 0.1s">El recorrido</h1>
    <p
      class="reveal font-dm text-ash-hard mx-auto mt-4 max-w-110 leading-relaxed font-light"
      style="--delay: 0.15s"
    >
      Desde el punto cero en Buenos Aires hasta donde estamos hoy.
    </p>

    <div class="flex flex-col gap-2">
      <!-- Contador KM Principal -->
      <div class="reveal relative mt-14 inline-block" style="--delay: 0.2s">
        <div
          class="font-fraunces to-orange-text bg-linear-to-br from-white bg-clip-text text-[clamp(96px,12vw,180px)] leading-none font-extrabold tracking-tighter text-transparent italic"
        >
          <span use:animateCounter={{ target: totalKm, duration: 2000 }}>0</span>
        </div>
        <div class="font-dm text-ash-soft mt-2 text-[13px] tracking-[0.14em] uppercase">
          kilómetros recorridos
        </div>
      </div>

      <!-- Sub-stats Bento -->
      <div
        class="reveal mx-auto mt-8 inline-flex w-fit overflow-hidden rounded-2xl border border-white/8 bg-white/5 backdrop-blur-md"
        style="--delay: 0.3s"
      >
        {#each [{ label: 'países', val: totalPaises }, { label: 'ciudades', val: totalCiudades }, { label: 'meses', val: 14 }, { label: 'semanas', val: 52 }] as stat, i (stat.label)}
          <div class="px-8 py-5 text-center {i < 3 ? 'border-r border-white/7' : ''}">
            <div
              class="font-fraunces text-orange-text text-3xl leading-none font-light tracking-[-0.03em] italic"
            >
              <span use:animateCounter={{ target: stat.val, duration: 1400 }}>0</span>
            </div>
            <div class="font-dm text-ash-soft mt-1.5 text-[10px] tracking-widest uppercase">
              {stat.label}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- 2. FILTROS -->
  <div class="flex flex-wrap items-center gap-6 px-6 pb-12 md:px-20">
    <div class="flex items-center gap-1.5">
      <span class="font-dm text-ash-softest mr-2 text-[10px] tracking-widest uppercase">País</span>
      {#each PAISES as pais (pais)}
        <button
          class="font-dm rounded-full border px-4 py-1.5 text-[12px] tracking-widest transition-all duration-200 {filterPais ===
          pais
            ? 'border-orange-main bg-orange-soft text-orange-text'
            : 'text-ash-soft hover:border-orange-main/40 hover:text-ash-text border-white/10 bg-transparent'}"
          onclick={() => (filterPais = pais)}
        >
          {pais}
        </button>
      {/each}
    </div>
    <div class="h-5 w-px bg-white/10"></div>
    <div class="flex items-center gap-1.5">
      <span class="font-dm text-ash-softest mr-2 text-[10px] tracking-widest uppercase">Año</span>
      {#each years as year (year)}
        <button
          class="font-dm rounded-full border px-4 py-1.5 text-[12px] tracking-widest transition-all duration-200 {filterYear ===
          year
            ? 'border-orange-main bg-orange-soft text-orange-text'
            : 'text-ash-soft hover:border-orange-main/40 hover:text-ash-text border-white/10 bg-transparent'}"
          onclick={() => (filterYear = year)}
        >
          {year}
        </button>
      {/each}
    </div>
  </div>

  <!-- 3. TIMELINE -->
  <div class="relative px-6 pb-20 md:px-20">
    <!-- Línea central (Spine) -->
    <div
      class="pointer-events-none absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-[linear-gradient(to_bottom,transparent,rgba(232,146,74,0.3)_5%,rgba(232,146,74,0.3)_90%,transparent)]"
    ></div>

    <div class="flex flex-col gap-10">
      {#each filtered as p, i (p.id)}
        {@const side = i % 2 === 0 ? 'left' : 'right'}
        {@const isProximo = p.tipo === 'proximo'}
        {@const isOrigen = p.tipo === 'origen'}

        <div
          class="relative flex w-full items-center {side === 'left'
            ? 'justify-start'
            : 'justify-end'}"
          in:fade
        >
          <!-- Punto central -->
          <div
            class="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full {isOrigen
              ? 'border-orange-text bg-orange-main animate-pulse-dot h-4.5 w-4.5 border-3 shadow-[0_0_0_6px_var(--color-orange-soft),0_0_20px_var(--color-orange-glow)]'
              : isProximo
                ? 'border-orange-main/40 h-3 w-3 border-2 border-dashed bg-transparent'
                : 'border-orange-dim bg-orange-main h-3 w-3 border-2 shadow-[0_0_10px_var(--color-orange-glow)]'}"
          ></div>

          <!-- Línea conectora -->
          <div
            class="bg-orange-main/20 absolute top-1/2 h-px w-8.5 {side === 'left'
              ? 'right-[calc(50%+6px)]'
              : 'left-[calc(50%+6px)]'}"
          ></div>

          <!-- Etiqueta KM (Lado opuesto) -->
          {#if !isOrigen}
            <div
              class="pointer-events-none absolute top-1/2 -translate-y-1/2 {side === 'left'
                ? 'right-[calc(50%+24px)] text-right'
                : 'left-[calc(50%+24px)] text-left'}"
            ></div>
          {/if}

          <!-- CARD -->
          <div class="group w-[calc(50%-40px)]">
            <div
              class="overflow-hidden rounded-2xl border backdrop-blur-md transition-all duration-300 group-hover:-translate-y-1 {isProximo
                ? 'border-orange-main/10 bg-orange-main/5 opacity-70'
                : 'group-hover:border-orange-main/40 border-white/7 bg-[#0c0c12]/80 shadow-[0_4px_20px_rgba(0,0,0,0.3)] group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(232,146,74,0.15)]'}"
            >
              <!-- Imagen Cover -->
              {#if p.cover}
                <div class="relative h-45 overflow-hidden">
                  <img
                    src={p.cover}
                    alt={p.lugar}
                    class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 {isProximo
                      ? 'blur-[1px] grayscale-60'
                      : ''}"
                  />
                  <div
                    class="absolute inset-0 bg-linear-to-t from-[#0c0c12]/90 to-transparent/40"
                  ></div>
                  {#if isProximo}
                    <div class="absolute inset-0 flex items-center justify-center">
                      <span
                        class="border-orange-main/25 font-fraunces text-orange-text bg-ash-main/80 rounded-full border px-4 py-2 text-lg italic backdrop-blur-sm"
                        >Próximamente</span
                      >
                    </div>
                  {/if}
                </div>
              {:else}
                <div
                  class="border-orange-main/10 bg-orange-soft flex h-45 items-center justify-center border-b"
                >
                  <span class="text-6xl">🗾</span>
                </div>
              {/if}

              <!-- Info Card -->
              <div class="p-5 md:p-6">
                <div class="mb-3 flex items-start justify-between">
                  <div>
                    <div class="mb-1.5 flex items-center gap-2">
                      <span class="text-lg">{p.flag}</span>
                      <span class="font-dm text-ash-soft text-[10px] tracking-widest uppercase"
                        >{p.pais}</span
                      >
                    </div>
                    <h3
                      class="font-fraunces text-ash-text text-2xl leading-none font-bold tracking-[-0.02em]"
                    >
                      {p.lugar}
                    </h3>
                    <div class="font-dm text-ash-soft mt-1.5 text-[11px] tracking-[0.04em]">
                      {p.fecha}
                    </div>
                  </div>
                  {#if !isOrigen && p.kmEtapa > 0}
                    <div class="shrink-0 text-right">
                      <div
                        class="font-dm text-ash-softest mb-1 text-[9px] tracking-widest uppercase"
                      >
                        esta etapa
                      </div>
                      <div
                        class="font-fraunces text-orange-text text-2xl tracking-[-0.02em] italic"
                      >
                        +{p.kmEtapa.toLocaleString('es-AR')}
                      </div>
                      <div class="font-dm text-ash-softest text-[9px] tracking-[0.06em]">km</div>
                    </div>
                  {/if}
                </div>

                <p class="font-dm text-ash-hard mb-4 text-[13px] leading-relaxed font-light">
                  {p.descripcion}
                </p>

                <!-- Stats KM Internos -->
                {#if !isOrigen}
                  <div class="mb-4 grid grid-cols-2 gap-2">
                    <div
                      class="border-orange-main/10 bg-orange-main/5 rounded-xl border px-3.5 py-2.5"
                    >
                      <div class="font-dm text-ash-soft mb-1 text-[9px] tracking-widest uppercase">
                        Desde Bs. As.
                      </div>
                      <div class="font-fraunces text-orange-text text-xl tracking-[-0.02em] italic">
                        {p.kmDesdeOrigen.toLocaleString('es-AR')}
                      </div>
                    </div>
                    <div class="rounded-xl border border-white/7 bg-white/3 px-3.5 py-2.5">
                      <div class="font-dm text-ash-soft mb-1 text-[9px] tracking-widest uppercase">
                        Total acumulado
                      </div>
                      <div class="font-fraunces text-ash-text text-xl tracking-[-0.02em] italic">
                        {p.kmAcumulados.toLocaleString('es-AR')}
                      </div>
                    </div>
                  </div>
                {/if}

                <!-- Enlaces Semanas -->
                {#if p.semanas.length > 0}
                  <div class="flex flex-wrap gap-2">
                    {#each p.semanas as href (href)}
                      <a
                        {href}
                        class="border-orange-main/25 bg-orange-soft font-dm text-orange-text hover:bg-orange-main/20 rounded-xl border px-3.5 py-1.5 text-[11px] tracking-[0.04em] transition-colors"
                      >
                        Ver entradas →
                      </a>
                    {/each}
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
