import { useLayoutEffect, useMemo, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { prefersReducedMotion, primeStrokes } from "../../lib/animation";
import { createGridWave } from "../../lib/gridWave";
import { SAGE, SANS, SERIF } from "../../lib/theme";

const ROWS = 9;

export default function Hero() {
  const root = useRef(null);
  const grid = useMemo(() => createGridWave({ width: 1000, height: 260, rows: ROWS, colEvery: 80 }), []);
  const initial = useMemo(() => (prefersReducedMotion() ? 1 : 0), []);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const rowEls = primeStrokes(q(".grid-row"));
      const colEls = primeStrokes(q(".grid-col"));

      const rowLen = rowEls.map((el) => el.getTotalLength());
      const colLen = colEls.map((el) => el.getTotalLength());
      const paint = (s) => {
        rowEls.forEach((el, r) => {
          el.setAttribute("d", grid.rowPath(r, s));
          el.style.opacity = grid.rowOpacity(r, s);
          el.style.strokeDasharray = s > 0 ? "none" : String(rowLen[r]);
        });
        colEls.forEach((el, c) => {
          el.setAttribute("d", grid.colPath(grid.colXs[c], s));
          el.style.strokeDasharray = s > 0 ? "none" : String(colLen[c]);
        });
      };
      const state = { s: 0 };

      gsap.from(".hero-title", { y: 36, opacity: 0, duration: 1.4, ease: "power3.out" });
      gsap.from(".hero-sub", { opacity: 0, duration: 1.2, delay: 0.6 });

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=140%",
            scrub: 1,
            pin: true,
          },
        })
        .to(rowEls, { strokeDashoffset: 0, stagger: 0.25, duration: 2 })
        .to(colEls, { strokeDashoffset: 0, stagger: 0.1, duration: 1.5 }, 1.2)
        .to(".hero-copy", { y: -30, opacity: 0.6, duration: 4 }, 0)
        .to(".hero-hint", { opacity: 0, duration: 0.4 }, 0)
        .to(
          state,
          {
            s: 1,
            duration: 2.4,
            onUpdate: () => paint(state.s),
            onReverseComplete: () => paint(0),
          },
          4.6
        );
    }, root);

    return () => ctx.revert();
  }, [grid]);

  return (
    <section
      id="top"
      ref={root}
      className="relative flex h-screen flex-col justify-between overflow-hidden pt-32"
    >
      <div className="hero-copy shrink-0 px-6 md:ml-[6vw] md:px-0">
        <p className={`${SANS} hero-sub mb-8 max-w-xs text-sm font-light leading-relaxed text-[#9EAF97]`}>
          A private workspace for the things you mean to do.
        </p>
        <h1
          className={`${SERIF} hero-title max-w-5xl text-[clamp(3rem,9.5vw,9rem)] font-normal leading-[0.92] tracking-tight text-[#FAF9F6]`}
        >
          To
          <br />
          Make Clear.
        </h1>
      </div>

      <p className={`${SANS} hero-hint absolute right-6 top-32 text-xs text-[#9EAF97]/70 md:right-16`}>
        Scroll to build the grid
      </p>
      <div className="min-h-[110px] max-h-[44vh] flex-1">
        <svg
          viewBox="0 0 1000 260"
          preserveAspectRatio="none"
          className="block h-full w-full overflow-visible"
          fill="none"
          stroke={SAGE}
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {grid.colXs.map((x) => (
            <path key={`c${x}`} className="grid-col" d={grid.colPath(x, initial)} opacity="0.4" />
          ))}
          {Array.from({ length: ROWS }, (_, r) => (
            <path
              key={`r${r}`}
              className="grid-row"
              d={grid.rowPath(r, initial)}
              style={{ opacity: grid.rowOpacity(r, initial) }}
            />
          ))}
        </svg>
      </div>
    </section>
  );
}