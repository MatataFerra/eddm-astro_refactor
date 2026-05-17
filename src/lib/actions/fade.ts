export function fadein(node: HTMLElement, { delay = 0 } = {}) {
  node.classList.add(
    'opacity-0',
    'translate-y-1',
    'transition-opacity',
    'transition-transform',
    'duration-700',
    'ease-out'
  );

  node.style.transitionDelay = `${delay}s`;

  const reveal = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        node.classList.remove('opacity-0', 'translate-y-1');
        node.classList.add('opacity-100', 'translate-y-0');
      });
    });
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        reveal();
        observer.disconnect();
      }
    },
    {
      threshold: 0.05,
    }
  );

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    },
  };
}
