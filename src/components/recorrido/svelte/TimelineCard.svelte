<script lang="ts">
  import type { ParadaUI } from '@/lib/interfaces/recorrido';
  import Card from '@/components/recorrido/svelte/Card.svelte';
  import { cn } from '@/lib/utils';

  interface Props {
    p: ParadaUI;
    side: 'left' | 'right';
  }

  let { p, side }: Props = $props();

  const isProximo = $derived.by(() => p.tipo === 'proximo');
  const isOrigen = $derived.by(() => p.tipo === 'origen');

  let visible = $state(false);
  let element: HTMLDivElement;

  $effect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible = true;
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  });
</script>

<div
  bind:this={element}
  class={cn('relative flex w-full items-center', side === 'left' ? 'justify-start' : 'justify-end')}
>
  <!-- Punto -->
  <div
    class={cn(
      'absolute top-1/2 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 rounded-full md:block',
      isOrigen
        ? 'border-orange-text bg-orange-main animate-pulse-dot h-4.5 w-4.5 border-3 shadow-[0_0_0_6px_var(--color-orange-soft),0_0_20px_var(--color-orange-glow)]'
        : isProximo
          ? 'border-orange-main/40 h-3 w-3 border-2 border-dashed bg-transparent'
          : 'border-orange-dim bg-orange-main h-3 w-3 border-2 shadow-[0_0_10px_var(--color-orange-glow)]'
    )}
  ></div>

  <!-- Connector -->
  <div
    data-slot="conector"
    class={cn(
      'bg-orange-main/70 absolute top-1/2 z-50 h-px w-8.5',
      side === 'left' ? 'right-[calc(50%+6px)]' : 'left-[calc(50%+6px)]'
    )}
  ></div>

  {#if visible}
    <Card {p} {isProximo} {isOrigen} loadMedia={true} />
  {:else}
    <div
      class="h-112.5 w-full animate-pulse rounded-2xl border border-white/5 bg-[#0c0c12]/50 md:w-[calc(50%-40px)]"
    ></div>
  {/if}
</div>
