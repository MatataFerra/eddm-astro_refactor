export function fadein(node: HTMLElement, { delay = 0 }: { delay?: number } = {}) {
  node.style.opacity = '0';
  node.style.transform = 'translateY(6px)';
  node.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  node.style.transitionDelay = `${delay}s`;

  const reveal = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        node.style.opacity = '1';
        node.style.transform = 'translateY(0)';
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
    { threshold: 0.05 }
  );

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    },
  };
}
