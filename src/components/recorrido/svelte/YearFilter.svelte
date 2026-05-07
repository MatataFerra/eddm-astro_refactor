<script lang="ts">
  import type { ParadaUI } from '@/lib/interfaces/recorrido';

  interface Props {
    paradas: ParadaUI[];
    filterYear: string;
  }

  let { paradas, filterYear = $bindable() }: Props = $props();

  let years = $derived(
    ['Todos', ...new Set(paradas.map((p) => p.year.toString()))].toSorted((a, b) =>
      a === 'Todos' ? -1 : b === 'Todos' ? 1 : parseInt(b) - parseInt(a)
    )
  );
</script>

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
