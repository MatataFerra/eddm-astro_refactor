<script lang="ts">
  import { tick } from 'svelte';
  import { animateCounter } from '@/lib/counter-animation';
  import { totalKmStore } from '@/lib/store/recorrido-store';

  let counterEl: HTMLSpanElement;
  let animated = false;

  $effect(() => {
    const total = $totalKmStore;

    if (!counterEl || total <= 0 || animated) return;

    const run = async () => {
      await tick();

      animated = true;

      animateCounter(counterEl, {
        target: total,
        duration: 2000,
      });
    };

    run();
  });
</script>

<div class="reveal relative mt-14 inline-block" style="--delay: 0.2s">
  <div
    class="font-fraunces to-orange-text bg-linear-to-br from-white bg-clip-text text-[clamp(96px,12vw,180px)] leading-none font-extrabold tracking-tighter text-transparent italic"
  >
    <span bind:this={counterEl}>0</span>
  </div>

  <div class="font-dm text-ash-soft mt-2 text-[13px] tracking-[0.14em] uppercase">
    kilómetros recorridos
  </div>
</div>
