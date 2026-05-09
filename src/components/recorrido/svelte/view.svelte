<script lang="ts">
  import Counter from '@/components/recorrido/svelte/Counter.svelte';
  import Stats from '@/components/recorrido/svelte/Stats.svelte';
  import Filters from '@/components/recorrido/svelte/Filters.svelte';
  import type { ParadaUI } from '@/lib/interfaces/recorrido';
  import Timeline from '@/components/recorrido/svelte/Timeline.svelte';

  let { paradas }: { paradas: ParadaUI[] } = $props();

  let filterPais = $state('Todos');
  let filterYear = $state('Todos');

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

    <div class="mx-4 flex flex-col gap-2">
      <!-- Contador KM Principal -->
      <Counter {totalKm} />

      <!-- Sub-stats Bento -->
      <Stats {totalPaises} {totalCiudades} />
    </div>
  </section>

  <!-- 2. FILTROS -->
  <Filters {paradas} bind:filterPais bind:filterYear />

  <!-- 3. TIMELINE -->
  <Timeline {filtered} />
</div>
