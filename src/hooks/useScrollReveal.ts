import { useEffect } from 'react';

/**
 * useScrollReveal:
 * Observes elements with `.reveal-text`, `.reveal-fade`, or `[data-reveal]`.
 * Triggers smooth, upward translations and optical blur focus as elements scroll into the viewport.
 */
export function useScrollReveal(dependency?: unknown): void {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Graceful fallback for older environments without IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      const targets = document.querySelectorAll('.reveal-text, .reveal-fade, [data-reveal]');
      targets.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    const observeElements = () => {
      const targets = document.querySelectorAll('.reveal-text, .reveal-fade, [data-reveal]');
      const vh = window.innerHeight;

      targets.forEach((el) => {
        if (el.classList.contains('is-revealed')) return;

        const rect = el.getBoundingClientRect();
        // If already within the viewport or above the fold on initial load, reveal immediately
        if (rect.top < vh && rect.bottom > 0) {
          el.classList.add('is-revealed');
        } else {
          observer.observe(el);
        }
      });
    };

    observeElements();

    // Re-check after layout stabilization
    const timer = setTimeout(observeElements, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [dependency]);
}
