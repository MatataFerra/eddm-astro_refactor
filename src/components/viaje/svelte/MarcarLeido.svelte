<script lang="ts">
  import { readWeeks, toggleRead } from '@/lib/store/viaje-store';
  import { fadein } from '@/lib/actions/fade';

  interface Props {
    identifier: string;
  }

  let { identifier }: Props = $props();

  let isRead = $derived($readWeeks.includes(identifier));
</script>

<div use:fadein class="mt-20">
  <div
    class="mx-auto flex max-w-180 flex-col items-center gap-5 rounded-3xl p-12 backdrop-blur-md transition-all duration-500
    {isRead ? 'border-green-main/50 bg-green-main/12' : 'border-white/10 bg-white/5'}"
  >
    {#if isRead}
      <div
        class="border-green-main bg-green-main/12 flex h-14 w-14 items-center justify-center rounded-full border-2"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12l5 5L20 7"
            stroke="#5d9e6b"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div class="text-center">
        <div class="font-fraunces text-green-soft mb-1.5 text-xl font-semibold italic">
          Semana leída
        </div>
        <div class="font-dm text-ash-soft text-[13px]">Quedará marcada en el índice del viaje</div>
      </div>
    {:else}
      <div class="text-center">
        <div class="font-fraunces mb-1.5 text-xl font-semibold text-[#888] italic">
          ¿Terminaste la semana?
        </div>
        <div class="font-dm text-ash-soft text-[13px]">
          Marcala como leída para llevar el registro del viaje
        </div>
      </div>
      <button
        onclick={() => toggleRead(identifier)}
        class="font-dm bg-green-main text-ash-main cursor-pointer rounded-full px-8 py-3.5 text-[14px] font-medium tracking-[0.04em] transition-all hover:scale-105 hover:opacity-85"
      >
        Marcar como leído ✓
      </button>
    {/if}
  </div>
</div>
