import Lenis from "lenis";

/**
 * Shared smooth-wheel-scroll engine (Lenis). Animates the real window scrollTop
 * with a lerp, so every sticky/scroll-driven section keeps working unchanged.
 * Falls back to native smooth scrolling when Lenis isn't running (reduced motion).
 */
let lenis: Lenis | null = null;
let rafId = 0;

export function startSmoothScroll() {
  if (lenis || !matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, touchMultiplier: 1.5, autoRaf: false });
  if (import.meta.env.DEV) (window as any).__lenis = lenis;
  const raf = (t: number) => {
    lenis!.raf(t);
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame(raf);
}

export function stopSmoothScroll() {
  cancelAnimationFrame(rafId);
  lenis?.destroy();
  lenis = null;
}

export function smoothScrollTo(y: number) {
  if (lenis) lenis.scrollTo(y);
  else scrollTo({ top: y, behavior: "smooth" });
}
