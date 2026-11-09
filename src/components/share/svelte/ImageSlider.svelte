<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { resizeImage, resizeSrcset } from '@/lib/media/resize';

  interface Slide {
    id: string;
    url: string;
    city: string;
    country?: string;
  }

  interface Props {
    slides: Slide[];
    interval?: number;
  }

  let { slides, interval = 7000 }: Props = $props();

  const WIDTHS = [828, 1280, 1920, 2560];

  let currentIndex = $state(0);
  let paused = $state(false);
  let reducedMotion = $state(false);

  let current = $derived(slides[currentIndex]);
  let canPlay = $derived(slides.length > 1 && !reducedMotion);

  onMount(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion = media.matches;
    const onChange = (e: MediaQueryListEvent) => (reducedMotion = e.matches);
    media.addEventListener('change', onChange);

    const timer = setInterval(() => {
      if (!canPlay || paused || document.hidden) return;
      currentIndex = (currentIndex + 1) % slides.length;
    }, interval);

    return () => {
      clearInterval(timer);
      media.removeEventListener('change', onChange);
    };
  });
</script>

<div class="absolute inset-0 overflow-hidden">
  {#each slides as slide, i (slide.id)}
    {#if currentIndex === i}
      <img
        src={resizeImage(slide.url, 1920)}
        srcset={resizeSrcset(slide.url, WIDTHS)}
        sizes="100vw"
        alt={`${slide.city}${slide.country ? `, ${slide.country}` : ''}`}
        fetchpriority={i === 0 ? 'high' : 'auto'}
        decoding="async"
        class="slide absolute inset-0 size-full object-cover"
        transition:fade={{ duration: 1400 }}
      />
    {/if}
  {/each}
</div>

{#if current}
  <div
    class="absolute top-20 right-6 z-10 flex items-center gap-3 md:top-auto md:right-20 md:bottom-8"
  >
    <p class="font-fraunces text-ash-text/80 text-sm italic" aria-live="polite">
      {current.city}{current.country ? `, ${current.country}` : ''}
    </p>

    {#if canPlay}
      <button
        type="button"
        onclick={() => (paused = !paused)}
        aria-label={paused ? 'Reanudar fotos' : 'Pausar fotos'}
        class="text-ash-text/70 hover:text-ash-text flex size-8 cursor-pointer items-center justify-center rounded-full border border-white/15 transition-colors hover:border-white/40"
      >
        {#if paused}
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
            <path d="M2 1l7 4-7 4z" fill="currentColor" />
          </svg>
        {:else}
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
            <path d="M2 1h2v8H2zM6 1h2v8H6z" fill="currentColor" />
          </svg>
        {/if}
      </button>
    {/if}
  </div>
{/if}

<style>
  @keyframes drift {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(1.06);
    }
  }

  .slide {
    animation: drift 14s ease-out both;
  }

  @media (prefers-reduced-motion: reduce) {
    .slide {
      animation: none;
    }
  }
</style>
