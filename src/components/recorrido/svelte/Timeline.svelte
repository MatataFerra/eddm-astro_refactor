<script lang="ts">
  import { filteredParadasStore } from '@/lib/store/recorrido-store';
  import TimelineCard from '@/components/recorrido/svelte/TimelineCard.svelte';
</script>

<div class="relative px-6 pb-20 md:px-20">
  <div
    class="pointer-events-none absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-[linear-gradient(to_bottom,transparent,rgba(232,146,74,0.3)_5%,rgba(232,146,74,0.3)_90%,transparent)]"
  ></div>

  <div class="flex flex-col gap-10">
    {#each $filteredParadasStore as p, i (p.id)}
      {@const side = i % 2 === 0 ? 'left' : 'right'}

      <TimelineCard {p} {side} />
    {/each}
  </div>
</div>
