<script lang="ts">
  import { readWeeks } from '@/lib/store/viaje-store';

  let { weekNums }: { weekNums: number[] } = $props();
  let leidas = $derived(weekNums.filter((n) => $readWeeks.includes(n)).length);
</script>

<span class="font-dm text-[10px] text-[#444]">
  {leidas}/{weekNums.length} leídas
</span>
