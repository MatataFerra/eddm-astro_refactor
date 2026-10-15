<script lang="ts">
  import { openLightbox } from '@/lib/store/galeria-store';
  import type { GalleryPhoto } from '@/lib/interfaces/gallery';

  interface Props {
    photos: GalleryPhoto[];
    limit?: number;
  }

  let { photos, limit = 7 }: Props = $props();

  let expanded = $state(false);
  const visible = $derived(expanded ? photos : photos.slice(0, limit));

  // Patrón de 7: grande, vertical, 3 chicas, 2 medianas
  const PATTERN = [
    'col-span-4 row-span-4',
    'col-span-2 row-span-4',
    'col-span-2 row-span-3',
    'col-span-2 row-span-3',
    'col-span-2 row-span-3',
    'col-span-3 row-span-4',
    'col-span-3 row-span-4',
  ];

  const span = (i: number) => (photos.length === 1 ? 'col-span-6 row-span-5' : PATTERN[i % 7]);
</script>

<div class="grid grid-flow-dense auto-rows-20 grid-cols-6 gap-3 md:auto-rows-30">
  {#each visible as photo, i (photo.id)}
    <button
      type="button"
      class="{span(i)} group cursor-pointer overflow-hidden rounded-[14px] bg-[#111]"
      onclick={() => openLightbox(photos, i)}
      aria-label={photo.alt ? `Ver foto: ${photo.alt}` : `Ver foto ${i + 1}`}
    >
      <img
        src={photo.url}
        alt={photo.alt ?? ''}
        width={photo.width ?? undefined}
        height={photo.height ?? undefined}
        loading="lazy"
        decoding="async"
        class="size-full object-cover transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.03]"
      />
    </button>
  {/each}
</div>

{#if photos.length > limit && !expanded}
  <button
    type="button"
    class="text-coral-text hover:border-coral font-dm mt-5 cursor-pointer rounded-full border border-white/7 px-6 py-3.5 text-[13px] transition-colors"
    onclick={() => (expanded = true)}
  >
    Ver las {photos.length} fotos ↓
  </button>
{/if}
