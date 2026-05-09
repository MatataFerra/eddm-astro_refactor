<script lang="ts">
  import CountryFilter from '@/components/recorrido/svelte/CountryFilter.svelte';
  import YearFilter from '@/components/recorrido/svelte/YearFilter.svelte';
</script>

<div class="flex flex-wrap items-center gap-6 px-6 pb-12 md:px-20">
  <CountryFilter />
  <YearFilter />
</div>
