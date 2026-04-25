export function fadein(node: HTMLElement, { delay = 0 }: { delay?: number } = {}) {
  node.classList.add('opacity-0', 'translate-y-7', 'transition-all', 'duration-700', 'ease-out');
  node.style.transitionDelay = `${delay}s`;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        node.classList.remove('opacity-0', 'translate-y-7');
        node.classList.add('opacity-100', 'translate-y-0');
        observer.disconnect();
      }
    },
    { threshold: 0.1 }
  );

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    },
  };
}
