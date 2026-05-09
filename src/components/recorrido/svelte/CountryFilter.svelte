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

<div class="flex w-full items-center gap-4">
  <span class="font-dm text-ash-softest shrink-0 text-[10px] tracking-widest uppercase">País</span>

  <div
    class="relative flex-1 overflow-hidden mask-[linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
  >
    <div class="no-scrollbar flex items-center gap-2 overflow-x-auto px-4 py-2">
      {#each PAISES as pais (pais)}
        <button
          class="font-dm shrink-0 rounded-full border px-4 py-1.5 text-[12px] tracking-widest transition-all duration-200 {filterPais ===
          pais
            ? 'border-orange-main bg-orange-soft text-orange-text'
            : 'text-ash-soft border-white/10 bg-transparent'}"
          onclick={() => (filterPais = pais)}
        >
          {pais}
        </button>
      {/each}
    </div>
  </div>
</div>

<style>
  /* Ocultar scrollbar para Chrome, Safari y Opera */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  /* Ocultar para IE, Edge y Firefox */
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
