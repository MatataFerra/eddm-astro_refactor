<script lang="ts">
  import { paradasStore, filterYearStore } from '@/lib/store/recorrido-store';

  let years = $derived.by(() => {
    return ['Todos', ...new Set($paradasStore.map((p) => p.year.toString()))].toSorted((a, b) =>
      a === 'Todos' ? -1 : b === 'Todos' ? 1 : parseInt(b) - parseInt(a)
    );
  });

  const handleChange = (pais: string) => {
    filterYearStore.set(pais);
  };
</script>

<div class="flex w-full items-center gap-4">
  <span class="font-dm text-ash-softest shrink-0 text-[10px] tracking-widest uppercase">Año</span>

  <!-- Contenedor con máscara de degradado -->
  <div
    class="relative flex-1 overflow-hidden mask-[linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
  >
    <div class="no-scrollbar flex items-center gap-2 overflow-x-auto px-4 py-2">
      {#each years as year (year)}
        <button
          class={`font-dm shrink-0 rounded-full border px-4 py-1.5 text-[12px] tracking-widest transition-all duration-200 ${
            $filterYearStore === year
              ? 'border-orange-main bg-orange-soft text-orange-text shadow-[0_0_10px_var(--color-orange-glow)]'
              : 'text-ash-soft hover:border-orange-main/40 hover:text-ash-text border-white/10 bg-transparent'
          }`}
          onclick={() => handleChange(year)}
        >
          {year}
        </button>
      {/each}
    </div>
  </div>
</div>

<style>
  /* Ocultar scrollbar manteniendo la funcionalidad de scroll */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none; /* IE y Edge */
    scrollbar-width: none; /* Firefox */
  }
</style>
