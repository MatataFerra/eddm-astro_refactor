<script lang="ts">
  import { fadein } from '@/lib/actions/fade';

  let { item, delay = 0 } = $props();
</script>

<div use:fadein={{ delay }}>
  <a href={item.href} class="group block no-underline">
    <div
      class="overflow-hidden rounded-2xl border border-white/[0.07] shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-all duration-300
                group-hover:-translate-y-1 group-hover:border-[#4ca8c8]/30 group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(76,168,200,0.11)]"
    >
      <div class="aspect-[3/2] overflow-hidden">
        <img
          src={item.cover}
          alt={item.title}
          class="block h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      <div class="border-t border-[#4ca8c8]/[0.14] bg-[#0a0a10]/95 p-4 px-[18px] pb-5">
        <div class="mb-2 flex items-center gap-1.5">
          <div class="h-1 w-1 rounded-full bg-[#4ca8c8]"></div>
          <span class="font-dm text-[9px] tracking-[0.1em] text-[#7ecde0] uppercase">
            más acá
          </span>
          <span class="font-dm ml-0.5 text-[9px] text-[#444]">
            · {item.date}
          </span>
        </div>

        <h3
          class="font-fraunces text-base leading-snug font-semibold tracking-[-0.01em] text-[#e0dcff] not-italic"
        >
          {item.title}
        </h3>

        <div class="font-dm mt-2.5 flex items-center gap-1 text-[11px] text-[#7ecde0]">
          Leer
          <span class="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </div>
      </div>
    </div>
  </a>
</div>
