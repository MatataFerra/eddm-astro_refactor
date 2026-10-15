<script lang="ts">
  import { fade } from 'svelte/transition';
  import { closeLightbox, lightbox, stepLightbox } from '@/lib/store/galeria-store';
  import { pad } from '@/lib/gallery';

  const isOpen = $derived($lightbox.photos.length > 0);
  const multi = $derived($lightbox.photos.length > 1);
  const current = $derived($lightbox.photos[$lightbox.index]);

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

  const btn =
    'absolute grid place-items-center rounded-full border border-white/7 bg-white/[.03] text-ash-text hover:border-coral transition-colors cursor-pointer';
</script>

<svelte:window onkeydown={onKey} />

{#if isOpen && current}
  <div
    class="fixed inset-0 z-200 flex flex-col items-center justify-center bg-[rgba(6,6,9,.96)]"
    role="dialog"
    aria-modal="true"
    aria-label="Visor de fotos"
    tabindex="-1"
    transition:fade={{ duration: 200 }}
    onclick={(e) => e.target === e.currentTarget && closeLightbox()}
    onkeydown={() => {}}
  >
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

    {#key current.id}
      <figure class="flex flex-col items-center" in:fade={{ duration: 180 }}>
        <img
          src={current.url}
          alt={current.alt ?? ''}
          width={current.width ?? undefined}
          height={current.height ?? undefined}
          class="max-h-[80vh] max-w-[min(92vw,1100px)] rounded object-contain shadow-[0_30px_100px_rgba(0,0,0,.6)]"
        />
        {#if current.caption}
          <figcaption
            class="font-fraunces text-ash-verse mt-4 max-w-xl px-6 text-center text-base italic"
          >
            {current.caption}
          </figcaption>
        {/if}
      </figure>
    {/key}

    {#if multi}
      <div
        class="text-ash-muted absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[11px] tracking-widest"
      >
        {pad($lightbox.index + 1)} / {pad($lightbox.photos.length)}
      </div>
    {/if}
  </div>
{/if}
