<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  interface Location {
    url: string;
    city: string;
    id: string;
  }

  let { locations = [] }: { locations: Location[] } = $props();

  let shuffledLocations = $state<Location[]>([]);
  let currentIndex = $state(0);
  let displayText = $state('');
  let isScrambling = $state(false);

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@&?<>[]';

  function shuffleArray(array: Location[]): Location[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  async function scramble(target: string) {
    if (!target) return;
    isScrambling = true;
    let iteration = 0;
    const maxIterations = 15;

    const interval = setInterval(() => {
      displayText = target
        .split('')
        .map((char, index) => {
          if (index < iteration / (maxIterations / target.length)) {
            return target[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iteration >= maxIterations) {
        clearInterval(interval);
        displayText = target;
        isScrambling = false;
      }
      iteration += 1;
    }, 40);
  }

  onMount(() => {
    if (locations.length === 0) return;

    shuffledLocations = shuffleArray(locations);
    scramble(shuffledLocations[currentIndex].city);

    const timer = setInterval(() => {
      currentIndex = (currentIndex + 1) % shuffledLocations.length;
      scramble(shuffledLocations[currentIndex].city);
    }, 6000);

    return () => clearInterval(timer);
  });
</script>

<div class="relative size-full overflow-hidden">
  {#each shuffledLocations as loc, i (loc.id)}
    {#if currentIndex === i}
      <div
        class="absolute inset-0 overflow-hidden rounded-t-xl"
        in:fade={{ duration: 2000 }}
        out:fade={{ duration: 2000 }}
      >
        <img
          src={loc.url}
          alt={loc.city}
          class="animate-ken-burns size-full object-cover opacity-60"
        />
        <div class="bg-noise absolute inset-0 opacity-[0.03]"></div>
      </div>
    {/if}
  {/each}

  <div
    class="pointer-events-none absolute inset-0 flex -translate-y-1/8 items-center justify-center"
  >
    <div class="flex flex-col items-center gap-2">
      <div class="bg-ash-main/60 rounded-xs border border-white/10 px-6 py-3 backdrop-blur-md">
        <span class="text-ash-text font-mono text-[13px] leading-none tracking-[0.25em] uppercase">
          {displayText}
        </span>
      </div>

      <div class="flex items-center gap-4 opacity-40">
        <div class="h-px w-8 bg-white/30"></div>
        <span class="text-ash-softest font-mono text-[9px] tracking-widest uppercase">
          {isScrambling ? 'Searching...' : 'Locked'}
        </span>
        <div class="h-px w-8 bg-white/30"></div>
      </div>
    </div>
  </div>

  <div class="absolute top-4 left-4 size-3 border-t border-l border-white/20"></div>
  <div class="absolute right-4 bottom-4 size-3 border-r border-b border-white/20"></div>
</div>

<style>
  @keyframes ken-burns {
    from {
      transform: scale(1.05);
    }
    to {
      transform: scale(1.15);
    }
  }

  .animate-ken-burns {
    animation: ken-burns 8s ease-in-out infinite alternate;
  }

  .bg-noise {
    background-image: url('https://grainy-gradients.vercel.app/noise.svg');
  }
</style>
