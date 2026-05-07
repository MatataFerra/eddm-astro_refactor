export function animateCounter(
  node: HTMLElement,
  { target, duration = 1800 }: { target: number; duration?: number }
) {
  let started = false;
  const obs = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting && !started) {
        started = true;
        const start = performance.now();
        const step = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3); // Cubic ease-out
          node.innerText = Math.round(ease * target).toLocaleString('es-AR');
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        obs.disconnect();
      }
    },
    { threshold: 0.3 }
  );

  obs.observe(node);
  return {
    destroy() {
      obs.disconnect();
    },
  };
}
