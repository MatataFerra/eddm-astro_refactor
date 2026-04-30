<script lang="ts">
  import { readWeeks } from '@/lib/store/viaje-store';
  import SemanaCard from '@/components/viaje/svelte/SemanaCard.svelte';
  import type { Semana } from '@/lib/interfaces/viaje';

  interface Props {
    semanas: Semana[];
  }

  let { semanas }: Props = $props();
</script>

<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
  {#each semanas as s, index}
    <div class="reveal" style={`--delay: ${index * 0.08}s`}>
      <SemanaCard semana={s} isRead={$readWeeks.includes(s.slug)} eager={s.num <= 4} />
    </div>
  {/each}
</div>
