<script lang="ts">
  import { paradasStore } from '@/lib/store/recorrido-store';
  import type { ParadaUI } from '@/lib/interfaces/recorrido';

  export let stops: ParadaUI[];

  paradasStore.set(stops);
</script>
