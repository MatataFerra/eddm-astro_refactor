<script lang="ts">
  import { cn } from '@/lib/utils';
  import { computePosition, autoUpdate, offset, flip, shift, size } from '@floating-ui/dom';

  let { geo } = $props();

  let open = $state(false);
  let isMobile = $state(false);
  let positioned = $state(false);

  const name = $derived(geo.geolocation.location);
  const country = $derived(geo.geolocation.metadata?.country || '');
  const description = $derived(geo.geolocation.metadata?.description || '');
  const mapsUrl = $derived(geo.geolocation.metadata?.url || '#');
  const thumb = $derived(geo.geolocation.metadata?.imgUrl);

  let triggerEl = $state<HTMLButtonElement | null>(null);
  let floatingEl = $state<HTMLElement | null>(null);

  $effect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 767px)');
    isMobile = mq.matches;
    const handler = (e: MediaQueryListEvent) => (isMobile = e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  });

  $effect(() => {
    if (!open || isMobile || !triggerEl || !floatingEl) {
      positioned = false;
      return;
    }

    const trigger = triggerEl;
    const floating = floatingEl;

    let frame: number;

    const update = () => {
      computePosition(trigger, floating, {
        placement: 'bottom-start',
        middleware: [
          offset(10),
          flip({ padding: 8 }),
          shift({ padding: 8 }),
          size({
            apply({ availableHeight, elements }) {
              elements.floating.style.maxHeight = `${Math.max(200, availableHeight - 16)}px`;
            },
            padding: 8,
          }),
        ],
      }).then(({ x, y }) => {
        Object.assign(floating.style, {
          left: `${x}px`,
          top: `${y}px`,
        });

        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          positioned = true;
        });
      });
    };

    const cleanup = autoUpdate(trigger, floating, update);
    return () => {
      cleanup();
      positioned = false;
    };
  });

  $effect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (triggerEl?.contains(target) || floatingEl?.contains(target)) return;
      open = false;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        open = false;
        triggerEl?.focus();
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  });

  $effect(() => {
    if (!open || !isMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  });

  function portal(node: HTMLElement) {
    if (typeof document === 'undefined') return;
    document.body.appendChild(node);
    return {
      destroy() {
        node.parentNode?.removeChild(node);
      },
    };
  }
</script>

<button
  bind:this={triggerEl}
  type="button"
  aria-haspopup="dialog"
  aria-expanded={open}
  onclick={() => (open = !open)}
  class={cn(
    'font-dm flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2 text-xs tracking-wider transition-all duration-200',
    open
      ? 'text-green-main border-green-tough/40 bg-green-tough/12'
      : 'border-white/12 bg-white/5 text-[#aaa] hover:border-white/20'
  )}
>
  <span class="text-sm">📍</span>
  {name}
  <span class="text-[10px] opacity-60 transition-transform duration-200 {open ? 'rotate-180' : ''}">
    ▼
  </span>
</button>

{#if open}
  {#if isMobile}
    <div
      use:portal
      class="animate-in fade-in fixed inset-0 z-90 bg-black/60 backdrop-blur-sm duration-200"
      aria-hidden="true"
    ></div>
  {/if}

  <div
    bind:this={floatingEl}
    use:portal
    role="dialog"
    aria-label={name}
    class={cn(
      'border-green-tough/30 z-100 overflow-hidden border bg-[#0a0a12]/95 shadow-[0_16px_48px_rgba(0,0,0,0.6),0_0_0_1px_rgba(93,158,107,0.1)] backdrop-blur-xl',
      isMobile
        ? 'animate-in slide-in-from-bottom fixed inset-x-3 bottom-3 max-h-[85vh] overflow-y-auto rounded-2xl duration-300'
        : cn(
            'absolute w-70 overflow-y-auto rounded-2xl',
            !positioned && 'pointer-events-none opacity-0',
            positioned && 'animate-in fade-in zoom-in-95 opacity-100 duration-200'
          )
    )}
  >
    {#if thumb}
      <div class="relative h-35 overflow-hidden">
        <img src={thumb} alt={name} class="h-full w-full object-cover" />
        <div class="absolute inset-0 bg-linear-to-t from-[#0a0a12]/80 to-transparent"></div>
      </div>
    {/if}

    <div class="p-4.5">
      <div class="font-fraunces text-ash-text text-xl leading-tight font-semibold italic">
        {name}
      </div>
      <div class="font-dm text-ash-soft mt-1 mb-2.5 text-[11px] tracking-widest uppercase">
        {country}
      </div>
      <p class="font-dm mb-3.5 text-[12px] leading-relaxed text-[#777]">
        {description}
      </p>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener"
        class="font-dm text-green-main border-green-tough/30 bg-green-tough/12 hover:bg-green-tough/20 inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-[12px] tracking-wider no-underline transition-colors"
      >
        <span>🗺️</span> Ver en Google Maps
      </a>
    </div>
  </div>
{/if}
