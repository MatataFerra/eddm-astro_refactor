<script lang="ts">
  import { readWeeks } from '@/lib/store/viaje-store';
  import { fadein } from '@/lib/actions/fade';
  let { semanaNum } = $props();
  let isRead = $derived($readWeeks.includes(semanaNum));
</script>

{#if isRead}
  <div
    use:fadein={{ delay: 0.24 }}
    class="border-green-tough/55 bg-green-tough/12 mt-3.5 inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 backdrop-blur-sm"
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
    <span class="font-dm text-green-main text-[10px] tracking-widest uppercase">Leído</span>
  </div>
{/if}
