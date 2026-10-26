import { gsap } from "./gsap";

/** True when the visitor asked the OS to reduce motion. */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
  Prepare SVG strokes for self drawing: each element gets a dash as long as
  its own path and is offset so it starts invisible. Animating
  `strokeDashoffset` to 0 then draws it (same effect as GSAP's DrawSVG).
*/
export function primeStrokes(elements) {
  elements.forEach((el) => {
    const length = el.getTotalLength();
    gsap.set(el, { strokeDasharray: length, strokeDashoffset: length });
  });
  return elements;
}
