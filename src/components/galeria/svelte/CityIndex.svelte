<script lang="ts">
  import { slide } from 'svelte/transition';
  import type { GalleryPlaceDetail } from '@/lib/interfaces/gallery';
  import { formatCount, pad } from '@/lib/gallery';
  import Mosaic from '@/components/galeria/svelte/Mosaic.svelte';

  interface Props {
    lugares: GalleryPlaceDetail[];
  }

  let { lugares }: Props = $props();

  let open = $state<string | null>(null);

  function toggle(slug: string) {
    open = open === slug ? null : slug;
  }
</script>

<div class="border-t border-white/7">
  {#each lugares as lugar, i (lugar.slug)}
    {@const isOpen = open === lugar.slug}
    {@const panelId = `galeria-${lugar.slug}`}

    <div class="border-b border-white/7">
      <button
        type="button"
        class="group grid w-full cursor-pointer grid-cols-[32px_minmax(0,1fr)] items-center gap-3 px-2 py-7 text-left md:grid-cols-[60px_minmax(0,1fr)_auto] md:gap-6"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onclick={() => toggle(lugar.slug)}
      >
        <span class="text-coral-text font-mono text-xs">{pad(i + 1)}</span>

        <h2
          class={[
            'font-fraunces text-[clamp(44px,8vw,112px)] leading-[.9] font-extrabold tracking-[-0.045em] transition-colors duration-300',
            isOpen ? 'text-ash-text' : 'group-hover:text-ash-text text-[#3a3a46]',
          ]}
        >
          {lugar.name}<span
            class={[
              'font-dm ml-3.5 inline-block align-middle text-lg transition-transform duration-300',
              isOpen ? 'text-coral-text rotate-45' : 'text-ash-muted',
            ]}>+</span
          >
        </h2>

        <span
          class="text-ash-muted hidden text-right font-mono text-[11px] leading-[1.8] tracking-[0.06em] md:block"
        >
          {formatCount(lugar.photos.length)}
        </span>
      </button>

      {#if isOpen}
        <div id={panelId} class="px-2 pt-1 pb-12" transition:slide={{ duration: 350 }}>
          <Mosaic photos={lugar.photos} />
        </div>
      {/if}
    </div>
  {/each}
</div>
