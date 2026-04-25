<script lang="ts">
  import { fadein } from '@/lib/actions/fade';

  const stats = [
    { num: '8', label: 'países' },
    { num: '59.439', label: 'km recorridos' },
    { num: '34', label: 'notas escritas' },
  ];
</script>

<div use:fadein>
  <div
    class="mx-auto flex max-w-170 overflow-hidden rounded-2xl border border-white/8 bg-white/2.5 backdrop-blur-md"
  >
    {#each stats as s}
      <div class="flex-1 border-r border-white/[0.07] px-6 py-7 text-center last:border-r-0">
        <div
          class="font-fraunces text-accent-text text-[44px] leading-none font-light tracking-[-0.03em] italic"
        >
          {s.num}
        </div>
        <div class="font-dm mt-1.5 text-[11px] tracking-widest text-[#555] uppercase">
          {s.label}
        </div>
      </div>
    {/each}
  </div>
</div>
