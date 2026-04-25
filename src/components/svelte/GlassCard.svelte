<script lang="ts">
  import { fadein } from '@/lib/actions/fade';
  import { typeStyleStore } from '@/lib/store/store';

  let { title, tag, summary, imgSrc, href = '#', delay = 0 } = $props();

  const typeStyle = $typeStyleStore;
  let hov = $state(false);
</script>

<div use:fadein={{ delay }} class="h-full">
  <a
    {href}
    class="block h-full no-underline"
    onmouseenter={() => (hov = true)}
    onmouseleave={() => (hov = false)}
  >
    <div
      class="relative h-full min-h-80 overflow-hidden rounded-[20px] transition-all duration-300
      {hov
        ? 'border-accent-main/50 -translate-y-1 shadow-[0_24px_60px_rgba(0,0,0,0.5),0_0_0_1px_var(--color-accent-main)]'
        : 'translate-y-0 border-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'}"
    >
      <div class="absolute inset-0">
        <img
          src={imgSrc}
          alt={title}
          class="block h-full w-full object-cover transition-transform duration-500 ease-out {hov
            ? 'scale-105'
            : 'scale-100'}"
        />
        <div
          class="absolute inset-0 bg-linear-to-t from-[#0a0a0f] via-[#0a0a0f]/50 to-transparent"
        ></div>
      </div>

      <div
        class="absolute right-0 bottom-0 left-0 border-t border-white/5 bg-[#08080e]/60 p-6 backdrop-blur-md"
      >
        {#if tag}
          <div class="mb-2 flex items-center gap-2">
            <span
              class="text-accent-text font-dm bg-accent-soft border-accent-main/30 rounded-full border px-2 py-[3px] text-[9px] tracking-[0.14em] uppercase"
            >
              {tag}
            </span>
          </div>
        {/if}

        <div
          class="font-fraunces text-[21px] leading-tight font-semibold tracking-tight text-[#f0eeff]
          {typeStyle === 'italic' ? 'italic' : 'not-italic'}"
        >
          {title}
        </div>

        {#if summary}
          <p class="font-dm mt-2 line-clamp-2 text-xs leading-relaxed font-light text-[#666]">
            {summary}
          </p>
        {/if}

        <div class="text-accent-text font-dm mt-3 flex items-center gap-1.5 text-xs">
          <span>Leer</span>
          <span class="transition-transform duration-200 {hov ? 'translate-x-1' : 'translate-x-0'}"
            >→</span
          >
        </div>
      </div>
    </div>
  </a>
</div>
