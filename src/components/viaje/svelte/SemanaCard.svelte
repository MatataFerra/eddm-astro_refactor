<script lang="ts">
  import type { Semana } from '@/lib/interfaces/viaje';
  import { cn } from '@/lib/utils';

  interface Props {
    semana: Semana;
    isRead?: boolean;
    eager?: boolean;
  }

  let { semana, isRead = false, eager = false }: Props = $props();
</script>

<a href={`/viaje/${semana.slug}`} class="group block no-underline">
  <div
    class={cn(
      'group-hover:border-green-main/50 relative transform-gpu overflow-hidden rounded-2xl border transition-all duration-300 will-change-transform group-hover:-translate-y-1 group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.5)]',
      isRead
        ? 'border-green-main/30 opacity-75'
        : 'border-white/7 shadow-[0_4px_16px_rgba(0,0,0,0.3)]'
    )}
  >
    <div class="relative aspect-16/10 overflow-hidden">
      <img
        src={semana.cover}
        alt={semana.titulo}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        class={cn(
          'block h-full w-full transform-gpu object-cover transition-transform duration-500 backface-hidden group-hover:scale-105',
          isRead && 'grayscale-30'
        )}
      />

      {#if isRead}
        <div
          class="border-green-main/40 bg-green-main/12 absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 rounded-full border px-2.5 py-1 backdrop-blur-sm"
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6l3 3 5-5"
              stroke="#5d9e6b"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="font-dm text-green-soft text-[9px] tracking-widest uppercase">leído</span>
        </div>
      {/if}

      <div
        class="from-ash-main/90 absolute inset-x-0 bottom-0 h-[60%] bg-linear-to-t to-transparent"
      ></div>
    </div>

    <div class="border-t border-white/5 bg-[#0a0a10]/96 px-4 pt-3.5 pb-4.5">
      <div class="mb-2 flex items-center justify-between">
        <div class="flex gap-1">
          {#each semana.lugares as l}
            <span
              class="font-dm text-green-soft border-green-main/30 bg-green-main/12 rounded-lg border px-1.5 py-0.5 text-[9px]"
              >📍 {l}</span
            >
          {/each}
        </div>
      </div>
      <h3 class="font-fraunces text-ash-text text-[18px] leading-[1.2] font-semibold">
        {semana.titulo}
      </h3>
      <div class="font-dm text-green-soft mt-2.5 flex items-center gap-1 text-[11px]">
        Leer <span class="transition-transform duration-200 group-hover:translate-x-1">→</span>
      </div>
    </div>
  </div>
</a>
