<script lang="ts">
  import { paradasStore, filterPaisStore } from '@/lib/store/recorrido-store';

  const PAISES = $derived.by(() => {
    return [
      'Todos',
      ...new Set($paradasStore.filter((p) => p.tipo !== 'origen').map((p) => p.pais)),
    ];
  });

  const handleChange = (pais: string) => {
    filterPaisStore.set(pais);
  };
</script>

<div class="flex w-full items-center gap-4">
  <span class="font-dm text-ash-softest shrink-0 text-[10px] tracking-widest uppercase">País</span>

  <div
    class="relative flex-1 overflow-hidden mask-[linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
  >
    <div class="no-scrollbar flex items-center gap-2 overflow-x-auto px-4 py-2">
      {#each PAISES as pais (pais)}
        <button
          class={`font-dm shrink-0 rounded-full border px-4 py-1.5 text-[12px] tracking-widest transition-all duration-200 ${
            $filterPaisStore === pais
              ? 'border-orange-main bg-orange-soft text-orange-text'
              : 'text-ash-soft border-white/10 bg-transparent'
          }`}
          onclick={() => handleChange(pais)}
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
