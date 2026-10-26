import { useRef } from "react";
import { primeStrokes } from "../../../lib/animation";
import { useChapterScrub } from "../../../hooks/useChapterScrub";
import { SANS, SERIF } from "../../../lib/theme";
import StackIllustration, { STACK_CENTER_Y, stackY } from "../StackIllustration";

/** Task stacks: four plates are drawn stacked, then lifted apart. */
export default function StackChapter() {
  const ref = useRef(null);

  useChapterScrub(ref, (tl, q) => {
    const strokes = primeStrokes(q(".st-draw"));
    const layers = q(".st-layer");

    tl.set(q(".st-label"), { opacity: 0 }, 0)
      .fromTo(layers, { y: STACK_CENTER_Y }, { y: STACK_CENTER_Y, duration: 0.01 }, 0)
      .to(strokes, { strokeDashoffset: 0, stagger: 0.15, duration: 1.2 })
      .to(layers, { y: (i) => stackY(i), duration: 2, ease: "power3.out" })
      .to(q(".st-label"), { opacity: 1, stagger: 0.12, duration: 0.6 }, "-=0.6");
  });

  return (
    <section ref={ref} className="relative h-[220vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center gap-6 overflow-hidden px-6 pt-20 md:grid md:grid-cols-12 md:items-end md:gap-0 md:px-16 md:pb-24">
        <div className="md:col-span-4 md:col-start-1">
          <h2
            data-reveal
            className={`${SERIF} text-[clamp(2.25rem,4.6vw,4.25rem)] leading-[1.02] tracking-tight text-[#FAF9F6]`}
          >
            Stack what matters. Lift away the rest.
          </h2>
          <p data-reveal className={`${SANS} mt-8 max-w-sm text-base font-light leading-relaxed text-[#FAF9F6]/70`}>
            Tasks sit in layers: today, this week, someday. Clareo keeps each
            one apart, so a long list never feels like a single heavy thing.
          </p>
        </div>

        <StackIllustration className="max-h-[52vh] w-full md:col-span-7 md:col-start-6 md:max-h-[86vh]" />
      </div>
    </section>
  );
}
