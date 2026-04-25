<script lang="ts">
  import { onMount } from 'svelte';

  let scrolled = $state(false);

  onMount(() => {
    const handleScroll = () => (scrolled = window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

<nav
  class="fixed top-0 right-0 left-0 z-50 flex h-15 items-center justify-between px-10 transition-all duration-400 ease-in-out
  {scrolled
    ? 'border-b border-white/5 bg-[#0a0a0f]/85 backdrop-blur-md'
    : 'border-transparent bg-transparent'}"
>
  <span class="font-fraunces text-lg font-semibold tracking-tight text-[#f0eeff] italic">
    el diario de mati
  </span>
  <div class="flex items-center gap-8">
    {#each ['viaje', 'relatos', 'notas'] as s}
      <a
        href="#"
        class="font-dm hover:text-accent-text text-xs tracking-widest text-[#888] uppercase no-underline transition-colors duration-200"
      >
        {s}
      </a>
    {/each}
    <span
      class="border-accent-main text-accent-text font-dm bg-accent-soft hover:bg-accent-glow cursor-pointer rounded-full border px-4 py-1.5 text-[11px] tracking-widest uppercase transition-colors"
    >
      Japón →
    </span>
  </div>
</nav>
