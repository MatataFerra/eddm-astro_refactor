<script lang="ts">
  import type { ParadaUI } from '@/lib/interfaces/recorrido';
  import { fade } from 'svelte/transition';
  import TimelineCard from '@/components/recorrido/svelte/TimelineCard.svelte';

  interface Props {
    filtered: ParadaUI[];
  }

  let { filtered }: Props = $props();
</script>

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
        <TimelineCard {p} {isProximo} {isOrigen} />
      </div>
    {/each}
  </div>
</div>
