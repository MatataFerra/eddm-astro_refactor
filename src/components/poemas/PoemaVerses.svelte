<script lang="ts">
  import { slide } from 'svelte/transition';
  import { splitStanzas } from '@/lib/poemas';

  interface Props {
    verses: string;
    id: string;
  }

  let { verses, id }: Props = $props();

  const stanzas = $derived(splitStanzas(verses));
  const hasMore = $derived(stanzas.length > 1);

  let open = $state(false);
</script>

<div {id}>
  <p class="verse text-ash-verse text-xl leading-[1.65]">{stanzas[0]}</p>

  {#if open}
    <div transition:slide={{ duration: 350 }}>
      {#each stanzas.slice(1) as stanza, i (i)}
        <p class="verse text-ash-verse mt-[1.65em] text-xl leading-[1.65]">{stanza}</p>
      {/each}
    </div>
  {/if}
</div>

{#if hasMore}
  <button
    type="button"
    aria-expanded={open}
    aria-controls={id}
    onclick={() => (open = !open)}
    class="font-dm text-lilac-text hover:text-ash-text mt-5 cursor-pointer text-[13px] tracking-[0.04em] transition-colors"
  >
    {open ? 'Cerrar ↑' : 'Seguir leyendo ↓'}
  </button>
{/if}
