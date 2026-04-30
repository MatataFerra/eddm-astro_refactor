<script lang="ts">
  import { readWeeks } from '@/lib/store/viaje-store';
  import { fadein } from '@/lib/actions/fade';

  let { totalWeeks } = $props();
  let readCount = $derived($readWeeks.length);
  let pct = $derived(totalWeeks > 0 ? Math.round((readCount / totalWeeks) * 100) : 0);
</script>

<div use:fadein={{ delay: 0.24 }} class="mt-9 inline-flex flex-col items-center gap-2.5">
  <div class="h-0.75 w-70 overflow-hidden rounded-sm bg-white/5">
    <div
      class="h-full rounded-sm bg-linear-to-r from-[#5d9e6b] to-[#8ac49a] transition-all duration-800"
      style="width: {pct}%"
    ></div>
  </div>
  <span class="font-dm text-[11px] text-[#555]">
    {readCount} de {totalWeeks} semanas leídas · {pct}%
  </span>
</div>
