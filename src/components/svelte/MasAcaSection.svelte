<script lang="ts">
  import { fadein } from '@/lib/actions/fade';
  import MasAcaCard from '@/components/svelte/MasAcaCard.svelte';

  // Si MAACA viene de un archivo de datos global (lo ideal), lo importarías aquí:
  // import { MAACA } from '../data/content';
  // Por ahora lo defino localmente basado en tu código original.
  const MAACA = [
    {
      title: 'Mildura (o la vez que renuncié al restaurante indio)',
      date: '2 mar 2026',
      cover:
        'https://res.cloudinary.com/docq8rbdu/image/upload/v1772445729/el-diario-de-mati/mas-aca-en-el-tiempo/x29j2abbyvqzdhpzt0h7.jpg',
      href: 'Entrada — Mildura.html',
    },
    {
      title: 'Rutherglen (o el día de la degustación fallida)',
      date: '31 ene 2026',
      cover:
        'https://res.cloudinary.com/docq8rbdu/image/upload/v1769837152/el-diario-de-mati/mas-aca-en-el-tiempo/nv3glwgneu4pbruxlhlp.webp',
      href: '#',
    },
    {
      title: 'Noondoo (o la vez que discutí con un supervisor)',
      date: '26 ene 2026',
      cover:
        'https://res.cloudinary.com/docq8rbdu/image/upload/v1769409565/el-diario-de-mati/mas-aca-en-el-tiempo/ktexwpe5tw4pdvxpngza.jpg',
      href: '#',
    },
  ];
</script>

<section>
  <div use:fadein>
    <div class="mb-9 flex items-baseline gap-4">
      <div class="flex items-center gap-2.5">
        <div class="h-[7px] w-[7px] rounded-full bg-[#4ca8c8] shadow-[0_0_8px_#4ca8c8]"></div>
        <h2
          class="font-fraunces text-[30px] font-semibold tracking-[-0.02em] text-[#f0eeff] not-italic"
        >
          Más acá en el tiempo
        </h2>
      </div>
      <div class="h-px flex-1 bg-white/5"></div>
      <a
        href="Más acá en el tiempo — El diario de Mati.html"
        class="font-dm text-xs tracking-[0.06em] whitespace-nowrap text-[#7ecde0] no-underline"
      >
        Ver todas →
      </a>
    </div>
    <p class="font-dm mb-7 text-[14px] font-light tracking-[0.01em] text-[#555]">
      Historias que pasaron recientemente y que quizás no sean correlativas.
    </p>
  </div>

  <div class="grid grid-cols-3 gap-4">
    {#each MAACA as item, i}
      <MasAcaCard {item} delay={i * 0.1} />
    {/each}
  </div>
</section>
