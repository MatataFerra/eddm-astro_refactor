<script lang="ts">
  import { fadein } from '@/lib/actions/fade';
  import StatsBar from '@/components/svelte/StatsBar.svelte';
  import GlassCard from '@/components/svelte/GlassCard.svelte';
  import MasAcaSection from '@/components/svelte/MasAcaSection.svelte';
  import JapanTeaser from '@/components/svelte/JapanTeaser.svelte';

  const RELATOS = [
    {
      title: 'El origen del miedo',
      tag: 'relato',
      cover:
        'https://res.cloudinary.com/docq8rbdu/image/upload/v1762130751/el-diario-de-mati/covers/egn7z7qepu6remuqdavu.webp',
      href: 'Relato — El origen del miedo.html',
      summary:
        'El origen del miedo a través de civilizaciones antiguas, manuscritos persas y una comunidad científica que no quiere escuchar.',
    },
    {
      title: 'Los ofendiditos',
      tag: 'relato',
      cover:
        'https://res.cloudinary.com/docq8rbdu/image/upload/v1762130806/el-diario-de-mati/covers/lczuhdci9ae4p3c5naaq.webp',
      href: '#',
      summary:
        'Una reflexión sobre la cultura de la ofensa y los límites de la tolerancia en el mundo moderno.',
    },
    {
      title: 'Nota de emergencia',
      tag: 'nota',
      cover:
        'https://res.cloudinary.com/docq8rbdu/image/upload/v1762131016/el-diario-de-mati/covers/rh7pkdduy9fvdbndm8ms.webp',
      href: '#',
      summary: 'Todo lo que hay que decir cuando el tiempo apremia y las palabras faltan.',
    },
    {
      title: 'El tiempo de los desesperados',
      tag: 'relato',
      cover:
        'https://res.cloudinary.com/docq8rbdu/image/upload/v1761801442/el-diario-de-mati/covers/zaxbcxlis18k27hvu57k.webp',
      href: '#',
      summary: 'Sobre la urgencia, la impaciencia y la ilusión de que siempre hay tiempo de sobra.',
    },
  ];
</script>

<div>
  <section class="relative flex min-h-screen items-center overflow-hidden">
    <div
      class="absolute inset-0 bg-[url('https://www.eldiariodemati.com/fondo-mini-dark.webp')] bg-cover bg-center opacity-20 saturate-50"
    ></div>

    <div
      class="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(212,168,67,0.12)_0%,transparent_60%)]"
    ></div>

    <div
      class="absolute right-0 bottom-0 left-0 h-75 bg-linear-to-t from-[#0a0a0f] to-transparent"
    ></div>

    <div
      class="relative z-10 mx-auto grid w-full max-w-350 grid-cols-2 items-center gap-20 px-20 pt-30 pb-20"
    >
      <div>
        <div
          use:fadein={{ delay: 0 }}
          class="text-accent-text font-dm mb-6 text-[11px] tracking-[0.18em] uppercase"
        >
          — bitácora personal de viajes y escritura
        </div>

        <h1
          use:fadein={{ delay: 0.1 }}
          class="font-fraunces text-[clamp(56px,6vw,96px)] leading-[0.95] font-extrabold tracking-[-0.04em] text-[#f0eeff]"
        >
          El diario<br />
          <span class="text-accent-text">de Mati</span>
        </h1>

        <p
          use:fadein={{ delay: 0.25 }}
          class="font-dm mt-8 text-[17px] leading-relaxed font-light text-[#888]"
        >
          Escribo desde que tengo memoria. La escritura no me ha abandonado — sea por desahogo o
          para ordenar pensamientos.
        </p>

        <div use:fadein={{ delay: 0.35 }} class="mt-12 flex items-center gap-4">
          <a
            href="Viaje - El diario de Mati.html"
            class="bg-accent-main font-dm inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[13px] font-medium tracking-[0.06em] text-[#0a0a0f] no-underline transition-opacity hover:opacity-85"
          >
            Leer el viaje →
          </a>
          <a
            href="Relatos - El diario de Mati.html"
            class="font-dm inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-[13px] text-[#aaa] no-underline transition-colors hover:border-white/40 hover:text-white"
          >
            Relatos
          </a>
        </div>
      </div>

      <div use:fadein={{ delay: 0.2 }} class="h-full">
        <div class="relative h-[480px]">
          <div
            class="absolute inset-0 overflow-hidden rounded-[24px] border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(212,168,67,0.15)]"
          >
            <img
              src={RELATOS[0].cover}
              alt="Un año viajando"
              class="block h-full w-full object-cover"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/90 via-[#0a0a0f]/20 to-transparent"
            ></div>

            <div
              class="absolute right-0 bottom-0 left-0 border-t border-white/10 bg-[#08080e]/55 p-7 backdrop-blur-md"
            >
              <div class="text-accent-text font-dm mb-1.5 text-[10px] tracking-[0.12em] uppercase">
                2024 — 2025
              </div>
              <div
                class="font-fraunces text-[22px] font-semibold tracking-[-0.01em] text-[#f0eeff]"
              >
                Un año viajando
              </div>
              <div class="font-dm mt-2 text-[13px] font-light text-[#666]">
                Nueva Zelanda · 12 meses · 8 países
              </div>
            </div>
          </div>

          <div
            class="border-accent-main/30 absolute -top-4 -right-4 flex items-center gap-5 rounded-2xl border bg-[#0a0a12]/85 px-5 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_var(--color-accent-glow)] backdrop-blur-md"
          >
            {#each [['8', 'países'], ['59k', 'km']] as [n, l], i}
              <div class="text-center {i === 0 ? 'border-r border-white/10 pr-5' : ''}">
                <div
                  class="font-fraunces text-accent-text text-[26px] leading-none font-light tracking-[-0.02em] italic"
                >
                  {n}
                </div>
                <div class="font-dm mt-1 text-[9px] tracking-[0.1em] text-[#555] uppercase">
                  {l}
                </div>
              </div>
            {/each}
          </div>

          <div
            class="border-accent-main/20 absolute bottom-[100px] -left-5 flex items-center gap-2.5 rounded-xl border bg-[#0a0a12]/90 px-4 py-2.5 shadow-xl backdrop-blur-md"
          >
            <span class="text-[22px]">🗾</span>
            <div>
              <div class="font-dm text-[9px] tracking-[0.1em] text-[#555] uppercase">Próximo</div>
              <div class="font-fraunces text-accent-text text-[15px] font-semibold">Japón</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="absolute bottom-9 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
      <div class="to-accent-main h-12 w-px bg-gradient-to-b from-transparent"></div>
      <div class="bg-accent-main h-1.5 w-1.5 animate-pulse rounded-full"></div>
    </div>
  </section>

  <section class="px-20 pb-20">
    <StatsBar />
  </section>

  <section class="px-20 py-10 pb-25">
    <div use:fadein class="mb-12 flex items-baseline gap-4">
      <h2 class="font-fraunces text-4xl font-semibold tracking-[-0.02em] text-[#f0eeff]">
        Relatos y escritos
      </h2>
      <div class="h-px flex-1 bg-white/10"></div>
      <a
        href="Relatos — El diario de Mati.html"
        class="font-dm text-accent-text text-xs tracking-[0.06em] whitespace-nowrap no-underline"
      >
        Ver todos →
      </a>
    </div>

    <div class="mb-4 grid grid-cols-[1.6fr_1fr_1fr] grid-rows-[420px] gap-4">
      <GlassCard
        delay={0}
        title={RELATOS[0].title}
        tag={RELATOS[0].tag}
        summary={RELATOS[0].summary}
        imgSrc={RELATOS[0].cover}
        href={RELATOS[0].href}
      />
      <GlassCard
        delay={0.1}
        title={RELATOS[1].title}
        tag={RELATOS[1].tag}
        summary={RELATOS[1].summary}
        imgSrc={RELATOS[1].cover}
        href={RELATOS[1].href}
      />
      <GlassCard
        delay={0.2}
        title={RELATOS[2].title}
        tag={RELATOS[2].tag}
        summary={RELATOS[2].summary}
        imgSrc={RELATOS[2].cover}
        href={RELATOS[2].href}
      />
    </div>

    <div use:fadein={{ delay: 0.25 }}>
      <a href={RELATOS[3].href} class="group block no-underline">
        <div
          class="group-hover:border-accent-main/30 relative h-[180px] overflow-hidden rounded-[20px] border border-white/10 transition-all duration-300 group-hover:-translate-y-0.5"
        >
          <img
            src={RELATOS[3].cover}
            alt={RELATOS[3].title}
            class="block h-full w-full object-cover"
          />
          <div
            class="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/95 via-[#0a0a0f]/40 to-transparent"
          ></div>

          <div class="absolute inset-0 flex items-center gap-6 px-10">
            <span
              class="text-accent-text font-dm bg-accent-soft border-accent-main/30 shrink-0 rounded-full border px-2 py-[3px] text-[9px] tracking-[0.14em] uppercase"
            >
              {RELATOS[3].tag}
            </span>
            <div class="flex-1">
              <div
                class="font-fraunces text-[28px] leading-[1.1] font-bold tracking-[-0.02em] text-[#f0eeff]"
              >
                {RELATOS[3].title}
              </div>
              <p class="font-dm mt-2 max-w-[500px] text-[13px] font-light text-[#666]">
                {RELATOS[3].summary}
              </p>
            </div>
            <span
              class="text-accent-text shrink-0 text-xl transition-transform duration-300 group-hover:translate-x-1.5"
              >→</span
            >
          </div>
        </div>
      </a>
    </div>
  </section>

  <section class="px-20 pb-20">
    <MasAcaSection />
  </section>

  <section class="px-20 pb-[120px]">
    <JapanTeaser />
  </section>
</div>
