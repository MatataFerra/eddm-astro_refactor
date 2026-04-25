<script lang="ts">
  import { fadein } from '@/lib/actions/fade';
</script>

<div use:fadein>
  <div
    class="group border-accent-main/20 from-accent-main/10 flex items-center justify-between gap-10 overflow-hidden rounded-3xl border bg-linear-to-br via-transparent to-transparent px-[60px] py-[52px] shadow-[inset_0_0_80px_var(--color-accent-glow)] backdrop-blur-[8px]"
  >
    <div>
      <div class="font-dm text-accent-text mb-3 text-[10px] tracking-[0.15em] uppercase">
        Próximo destino
      </div>

      <div
        class="font-fraunces text-[72px] leading-none font-extrabold tracking-[-0.04em] text-[#f0eeff] italic"
      >
        Japón
      </div>

      <div class="font-dm mt-4 max-w-[420px] text-[15px] leading-[1.7] font-light text-[#888]">
        El siguiente capítulo se escribe desde el otro lado del mundo. Pronto.
      </div>
    </div>

    <div
      class="border-accent-main/25 bg-accent-soft flex h-[120px] w-[120px] shrink-0 items-center justify-center rounded-full border-2 text-[56px] transition-transform duration-300 group-hover:scale-[1.08] group-hover:rotate-[5deg]"
    >
      🗾
    </div>
  </div>
</div>
