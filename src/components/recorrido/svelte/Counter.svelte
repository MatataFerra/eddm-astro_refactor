<script lang="ts">
  import { animateCounter } from '@/lib/counter-animation';

  interface Props {
    totalKm: number;
  }

  let { totalKm }: Props = $props();
</script>

<div class="reveal relative mt-14 inline-block" style="--delay: 0.2s">
  <div
    class="font-fraunces to-orange-text bg-linear-to-br from-white bg-clip-text text-[clamp(96px,12vw,180px)] leading-none font-extrabold tracking-tighter text-transparent italic"
  >
    <span use:animateCounter={{ target: totalKm, duration: 2000 }}>0</span>
  </div>
  <div class="font-dm text-ash-soft mt-2 text-[13px] tracking-[0.14em] uppercase">
    kilómetros recorridos
  </div>
</div>
