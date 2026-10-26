import { useRef } from "react";
import { primeStrokes } from "../../../lib/animation";
import { useChapterScrub } from "../../../hooks/useChapterScrub";
import { SAGE, SANS, SERIF } from "../../../lib/theme";

const ENTRIES = [
  { y: 110, a: 180, b: 120 },
  { y: 210, a: 220, b: 150 },
  { y: 310, a: 160, b: 100 },
  { y: 410, a: 240, b: 170 },
  { y: 510, a: 190, b: 130 },
];

/** The record: a timeline draws downward and each finished entry is marked. */
export default function RecordChapter() {
  const ref = useRef(null);

  useChapterScrub(ref, (tl, q) => {
    const spine = primeStrokes(q(".rc-spine"));
    const nodes = primeStrokes(q(".rc-node"));
    const lines = primeStrokes(q(".rc-line"));

    tl.to(spine, { strokeDashoffset: 0, duration: 4 })
      .to(nodes, { strokeDashoffset: 0, stagger: 0.7, duration: 0.5 }, 0.4)
      .to(lines, { strokeDashoffset: 0, stagger: 0.35, duration: 0.5 }, 0.6);
  });

  return (
    <section ref={ref} className="relative h-[220vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center gap-6 overflow-hidden px-6 pt-20 md:grid md:grid-cols-12 md:items-end md:gap-0 md:px-16 md:pb-20">
        <svg
          viewBox="0 0 400 600"
          className="max-h-[48vh] w-full md:col-span-5 md:col-start-2 md:max-h-[88vh]"
          fill="none"
          stroke={SAGE}
          strokeWidth="1"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path className="rc-spine" d="M80 40 V570" opacity="0.7" />
          {ENTRIES.map((e) => (
            <g key={e.y}>
              <circle className="rc-node" cx="80" cy={e.y} r="7" />
              <path className="rc-line" d={`M104 ${e.y - 6} H${104 + e.a}`} />
              <path className="rc-line" d={`M104 ${e.y + 10} H${104 + e.b}`} opacity="0.5" />
            </g>
          ))}
        </svg>

        <div className="md:col-span-4 md:col-start-8">
          <h2
            data-reveal
            className={`${SERIF} text-[clamp(2.25rem,4.6vw,4.25rem)] leading-[1.02] tracking-tight text-[#FAF9F6]`}
          >
            A record you can trust.
          </h2>
          <p data-reveal className={`${SANS} mt-8 max-w-sm text-base font-light leading-relaxed text-[#FAF9F6]/70`}>
            Everything you finish is kept in a quiet log. Watch consistency
            build into a streak, one honest day at a time.
          </p>
        </div>
      </div>
    </section>
  );
}
