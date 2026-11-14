// La luz de la página es la de la hora donde estoy. Corre antes de pintar para no parpadear.
(() => {
  const root = document.documentElement;
  const dark = matchMedia('(prefers-color-scheme: dark)');

  // El tamaño de letra que eligió el lector (src/lib/text-scale.ts)
  try {
    const scale = Number(localStorage.getItem('eddm_text_scale'));
    if (scale >= 0.9 && scale <= 1.4) root.style.setProperty('--text-scale', String(scale));
  } catch {}
  const phaseAt = (hour) =>
    hour < 6 ? 'night' : hour < 9 ? 'dawn' : hour < 18 ? 'day' : hour < 21 ? 'dusk' : 'night';

  function hourThere() {
    // El panel del cielo (sólo en desarrollo) puede fijar otra hora
    if (root.dataset.devHour) return Number(root.dataset.devHour);
    try {
      const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: root.dataset.tz || undefined,
        hour: 'numeric',
        minute: 'numeric',
        hourCycle: 'h23',
      }).formatToParts(new Date());
      const get = (type) => Number(parts.find((p) => p.type === type)?.value ?? 0);
      return get('hour') + get('minute') / 60;
    } catch {
      const now = new Date();
      return now.getHours() + now.getMinutes() / 60;
    }
  }

  function paint() {
    const hour = hourThere();
    let phase = phaseAt(hour);
    // La hora real de allá, aunque el modo oscuro cambie la luz
    root.dataset.hourPhase = phaseAt(hour);
    // Quien navega en modo oscuro nunca recibe la luz de día
    const isDark = root.dataset.devDark ? root.dataset.devDark === 'true' : dark.matches;
    if (isDark && (phase === 'day' || phase === 'dawn')) phase = 'night';
    root.dataset.phase = phase;
    const paper = getComputedStyle(root).getPropertyValue('--color-paper').trim();
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', paper);
  }

  paint();
  dark.addEventListener('change', paint);
  document.addEventListener('eddm:sky', paint);
  setInterval(paint, 5 * 60 * 1000);
})();
