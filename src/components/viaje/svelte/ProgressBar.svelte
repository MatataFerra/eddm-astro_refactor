<script lang="ts">
  import { readWeeks } from '@/lib/store/viaje-store';

  let { totalWeeks } = $props();
  let readCount = $derived($readWeeks.length);
  let pct = $derived(totalWeeks > 0 ? Math.round((readCount / totalWeeks) * 100) : 0);
</script>

<div class="reveal mt-9 inline-flex flex-col items-center gap-2.5">
  <div class="h-0.75 w-70 overflow-hidden rounded-sm bg-white/5">
    <div
      class="to-green-soft from-green-main h-full rounded-sm bg-linear-to-r transition-all duration-800"
      style="width: {pct}%"
    ></div>
  </div>
  <span class="font-dm text-ash-soft text-[11px]">
    {readCount} de {totalWeeks} semanas leídas · {pct}%
  </span>
</div>
