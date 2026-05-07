<script lang="ts">
  import type { ParadaUI } from '@/lib/interfaces/recorrido';
  import CountryFilter from '@/components/recorrido/svelte/CountryFilter.svelte';
  import YearFilter from '@/components/recorrido/svelte/YearFilter.svelte';

  interface Props {
    paradas: ParadaUI[];
    filterPais: string;
    filterYear: string;
  }

  let { paradas, filterPais = $bindable(), filterYear = $bindable() }: Props = $props();
</script>

<div class="flex flex-wrap items-center gap-6 px-6 pb-12 md:px-20">
  <CountryFilter {paradas} bind:filterPais />
  <div class="h-5 w-px bg-white/10"></div>
  <YearFilter {paradas} bind:filterYear />
</div>
