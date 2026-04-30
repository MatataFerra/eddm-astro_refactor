<script lang="ts">
  import type { Semana } from '@/lib/interfaces/viaje';
  import { readWeeks } from '@/lib/store/viaje-store';

  interface Props {
    weekNums: number[];
    weeks: Semana['slug'][];
  }

  let { weekNums, weeks }: Props = $props();
  let leidas = $readWeeks.filter((w) => weeks.includes(w)).length;
</script>

<span class="font-dm text-ash-softest text-[10px]">
  {leidas}/{weekNums.length} leídas
</span>
