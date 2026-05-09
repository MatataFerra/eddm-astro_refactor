<script lang="ts">
  import type { ParadaUI } from '@/lib/interfaces/recorrido';
  import { cn } from '@/lib/utils';

  interface Props {
    p: ParadaUI;
    isProximo: boolean;
    isOrigen: boolean;
    loadMedia?: boolean;
  }

  let { p, isProximo, isOrigen, loadMedia = false }: Props = $props();
</script>

<a
  href={p.googleMapsUrl}
  target="_blank"
  rel="noopener noreferrer"
  class="group/timeline w-full md:w-[calc(50%-40px)]"
  data-slot="timeline-card"
>
  <div
    class={cn(
      'overflow-hidden rounded-2xl border backdrop-blur-md transition-all duration-300 group-hover/timeline:-translate-y-1',
      isProximo
        ? 'border-orange-main/10 bg-orange-main/5 opacity-70'
        : 'group-hover/timeline:border-orange-main/40 border-white/7 bg-[#0c0c12]/80 shadow-[0_4px_20px_rgba(0,0,0,0.3)] group-hover/timeline:shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(232,146,74,0.15)]'
    )}
  >
    <!-- Imagen Cover -->
    {#if p.cover}
      <div class="relative h-45 overflow-hidden">
        {#if loadMedia}
          <img
            src={p.cover}
            alt={p.lugar}
            loading="lazy"
            decoding="async"
            class={cn(
              'h-full w-full object-cover transition-transform duration-500 group-hover/timeline:scale-105',
              isProximo && 'blur-[1px] grayscale-60'
            )}
          />
        {:else}
          <!-- Placeholder -->
          <div class="h-full w-full animate-pulse bg-white/5"></div>
        {/if}
        <div class="absolute inset-0 bg-linear-to-t from-[#0c0c12]/90 to-transparent/40"></div>
        {#if isProximo}
          <div class="absolute inset-0 flex items-center justify-center">
            <span
              class="border-orange-main/25 font-fraunces text-orange-text bg-ash-main/80 rounded-full border px-4 py-2 text-lg italic backdrop-blur-sm"
              >Próximamente</span
            >
          </div>
        {/if}
      </div>
    {:else}
      <div
        class="border-orange-main/10 bg-orange-soft flex h-45 items-center justify-center border-b"
      >
        <span class="text-6xl">🗾</span>
      </div>
    {/if}

    <!-- Info Card -->
    <div class="p-5 md:p-6">
      <div class="mb-3 flex items-start justify-between">
        <div>
          <div class="mb-1.5 flex items-center gap-2">
            <span class="text-lg">{p.flag}</span>
            <span class="font-dm text-ash-soft text-[10px] tracking-widest uppercase">{p.pais}</span
            >
          </div>
          <h3
            class="font-fraunces text-ash-text text-2xl leading-none font-bold tracking-[-0.02em]"
          >
            {p.lugar}
          </h3>
          <div class="font-dm text-ash-soft mt-1.5 text-[11px] tracking-[0.04em]">
            {p.fecha}
          </div>
        </div>
        {#if !isOrigen && p.kmEtapa > 0}
          <div class="shrink-0 text-right">
            <div class="font-dm text-ash-softest mb-1 text-[9px] tracking-widest uppercase">
              esta etapa
            </div>
            <div class="font-fraunces text-orange-text text-2xl tracking-[-0.02em] italic">
              +{p.kmEtapa.toLocaleString('es-AR')}
            </div>
            <div class="font-dm text-ash-softest text-[9px] tracking-[0.06em]">km</div>
          </div>
        {/if}
      </div>

      <p class="font-dm text-ash-hard mb-4 text-[13px] leading-relaxed font-light">
        {p.descripcion}
      </p>

      <!-- Stats KM Internos -->
      {#if !isOrigen}
        <div class="mb-4 grid grid-cols-2 gap-2">
          <div class="border-orange-main/10 bg-orange-main/5 rounded-xl border px-3.5 py-2.5">
            <div class="font-dm text-ash-soft mb-1 text-[9px] tracking-widest uppercase">
              Desde Bs. As.
            </div>
            <div class="font-fraunces text-orange-text text-xl tracking-[-0.02em] italic">
              {p.kmDesdeOrigen.toLocaleString('es-AR')}
            </div>
          </div>
          <div class="rounded-xl border border-white/7 bg-white/3 px-3.5 py-2.5">
            <div class="font-dm text-ash-soft mb-1 text-[9px] tracking-widest uppercase">
              Total acumulado
            </div>
            <div class="font-fraunces text-ash-text text-xl tracking-[-0.02em] italic">
              {p.kmAcumulados.toLocaleString('es-AR')}
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</a>
