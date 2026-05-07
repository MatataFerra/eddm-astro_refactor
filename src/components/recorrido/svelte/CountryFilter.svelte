<script lang="ts">
  import type { ParadaUI } from '@/lib/interfaces/recorrido';

  interface Props {
    paradas: ParadaUI[];
    filterPais: string;
  }

  let { paradas, filterPais = $bindable() }: Props = $props();

  let PAISES = $derived([
    'Todos',
    ...new Set(paradas.filter((p) => p.tipo !== 'origen').map((p) => p.pais)),
  ]);
</script>

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
