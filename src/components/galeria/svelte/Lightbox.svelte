<script lang="ts">
  import { untrack } from 'svelte';
  import { fade } from 'svelte/transition';
  import {
    closeLightbox,
    lightbox,
    setLightboxIndex,
    stepLightbox,
  } from '@/lib/store/galeria-store';
  import { pad } from '@/lib/gallery';

  const photos = $derived($lightbox.photos);
  const index = $derived($lightbox.index);
  const isOpen = $derived(photos.length > 0);
  const multi = $derived(photos.length > 1);

  // ── Carrusel (scroll-snap nativo) ──────────────────────────────
  let track = $state<HTMLDivElement>();
  /** Slide hacia el que va un scroll programático; mientras no llega, el scroll no toca el store */
  let target: number | null = null;

  const slideAt = (el: HTMLElement) => Math.round(el.scrollLeft / el.clientWidth);

  // Store → scroll (apertura, flechas, teclado)
  $effect(() => {
    const el = track;
    const i = index;
    if (!el) return;
    const from = slideAt(el);
    if (from === i) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Saltos de más de un slide (apertura, vuelta del último al primero) sin animación
    const instant = reduce || Math.abs(from - i) > 1;
    target = i;
    el.scrollTo({ left: i * el.clientWidth, behavior: instant ? 'instant' : 'smooth' });
  });

  // Scroll → store (swipe)
  function onScroll() {
    if (!track) return;
    const i = slideAt(track);
    if (target !== null) {
      if (i === target && Math.abs(track.scrollLeft - target * track.clientWidth) < 2)
        target = null;
      return;
    }
    if (i !== index) setLightboxIndex(i);
  }

  // Si el usuario toca durante un scroll programático, manda él
  const release = () => (target = null);

  // ── Puntos estilo Instagram ────────────────────────────────────
  const MAX_DOTS = 5;
  const DOT = 12; // 6px de punto + 6px de hueco

  // Ventana de puntos visibles: solo se desplaza cuando el activo llega a un borde
  let start = $state(0);
  $effect(() => {
    const n = photos.length;
    const i = index;
    let s = untrack(() => start);
    if (i <= s) s = i - 1;
    else if (i >= s + MAX_DOTS - 1) s = i - MAX_DOTS + 2;
    start = Math.min(Math.max(s, 0), Math.max(n - MAX_DOTS, 0));
  });

  function dotScale(i: number) {
    if (i < start || i >= start + MAX_DOTS) return 0;
    if (i === index) return 1;
    const moreLeft = i === start && start > 0;
    const moreRight = i === start + MAX_DOTS - 1 && start + MAX_DOTS < photos.length;
    return moreLeft || moreRight ? 0.5 : 0.85;
  }

  // ── Teclado y scroll de la página ──────────────────────────────
  function onKey(e: KeyboardEvent) {
    if (!isOpen) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') stepLightbox(-1);
    if (e.key === 'ArrowRight') stepLightbox(1);
  }

  $effect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = prev;
    };
  });

  // Cierra al tocar el fondo (el slide), no la foto ni el pie
  function onBackdrop(e: MouseEvent) {
    if ((e.target as HTMLElement).dataset.backdrop !== undefined) closeLightbox();
  }

  const btn =
    'absolute z-10 grid place-items-center rounded-full border border-white/10 bg-black/30 text-ash-text hover:border-coral transition-colors cursor-pointer';
</script>

<svelte:window onkeydown={onKey} />

{#if isOpen}
  <div
    class="fixed inset-0 z-200 bg-[rgba(6,6,9,.6)] backdrop-blur-xl"
    role="dialog"
    aria-modal="true"
    aria-label="Visor de fotos"
    tabindex="-1"
    transition:fade={{ duration: 200 }}
    onclick={onBackdrop}
    onkeydown={() => {}}
    ontouchstart={release}
    onwheel={release}
  >
    {#if multi}
      <p
        class="text-ash-muted absolute top-9 left-6 z-10 font-mono text-[11px] tracking-widest"
        aria-live="polite"
      >
        {pad(index + 1)} / {pad(photos.length)}
      </p>
    {/if}

    <button
      type="button"
      class="{btn} top-5 right-6 size-12 text-lg"
      aria-label="Cerrar"
      onclick={closeLightbox}
    >
      ✕
    </button>

    {#if multi}
      <button
        type="button"
        class="{btn} top-1/2 left-6 hidden size-14 -translate-y-1/2 text-xl md:grid"
        aria-label="Anterior"
        onclick={() => stepLightbox(-1)}
      >
        ←
      </button>
      <button
        type="button"
        class="{btn} top-1/2 right-6 hidden size-14 -translate-y-1/2 text-xl md:grid"
        aria-label="Siguiente"
        onclick={() => stepLightbox(1)}
      >
        →
      </button>
    {/if}

    <div
      bind:this={track}
      class="flex size-full snap-x snap-mandatory scrollbar-none overflow-x-auto overscroll-x-contain [&::-webkit-scrollbar]:hidden"
      onscroll={onScroll}
    >
      {#each photos as photo, i (photo.id)}
        <div
          data-backdrop
          class="flex h-full w-full shrink-0 snap-center snap-always flex-col items-center justify-center px-4 pt-24 pb-20"
          aria-hidden={i !== index}
        >
          <img
            src={photo.url}
            alt={photo.alt ?? ''}
            width={photo.width ?? undefined}
            height={photo.height ?? undefined}
            loading={Math.abs(i - index) <= 1 ? 'eager' : 'lazy'}
            decoding="async"
            draggable="false"
            class="h-auto max-h-full min-h-0 w-auto max-w-[min(100%,1100px)] rounded object-contain shadow-[0_30px_100px_rgba(0,0,0,.6)] select-none"
          />
          {#if photo.caption}
            <p
              class="font-fraunces text-ash-verse mt-4 max-w-xl shrink-0 px-6 text-center text-base italic"
            >
              {photo.caption}
            </p>
          {/if}
        </div>
      {/each}
    </div>

    {#if multi}
      <div
        class="pointer-events-none absolute bottom-7 left-1/2 -translate-x-1/2 overflow-hidden"
        style="width: {Math.min(photos.length, MAX_DOTS) * DOT}px"
        aria-hidden="true"
      >
        <div
          class="flex transition-transform duration-300"
          style="transform: translateX({-start * DOT}px)"
        >
          {#each photos as photo, i (photo.id)}
            <span class="grid shrink-0 place-items-center" style="width: {DOT}px; height: {DOT}px">
              <i
                class={[
                  'block size-1.5 rounded-full transition-[transform,background-color] duration-300',
                  i === index ? 'bg-coral' : 'bg-white/40',
                ]}
                style="transform: scale({dotScale(i)})"
              ></i>
            </span>
          {/each}
        </div>
      </div>
    {/if}
  </div>
{/if}
