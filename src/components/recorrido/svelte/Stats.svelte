<script lang="ts">
  import { animateCounter } from '@/lib/counter-animation';

  interface Props {
    totalPaises: number;
    totalCiudades: number;
  }

  let { totalPaises, totalCiudades }: Props = $props();
</script>

<div
  class="reveal mx-auto mt-8 inline-flex w-fit overflow-hidden rounded-2xl border border-white/8 bg-white/5 backdrop-blur-md"
  style="--delay: 0.3s"
>
  {#each [{ label: 'países', val: totalPaises }, { label: 'ciudades', val: totalCiudades }, { label: 'meses', val: 14 }, { label: 'semanas', val: 52 }] as stat, i (stat.label)}
    <div class="px-4 py-2 text-center md:px-8 md:py-5 {i < 3 ? 'border-r border-white/7' : ''}">
      <div
        class="font-fraunces text-orange-text text-3xl leading-none font-light tracking-[-0.03em] italic"
      >
        <span use:animateCounter={{ target: stat.val, duration: 1400 }}>0</span>
      </div>
      <div class="font-dm text-ash-soft mt-1.5 text-[10px] tracking-widest uppercase">
        {stat.label}
      </div>
    </div>
  {/each}
</div>
