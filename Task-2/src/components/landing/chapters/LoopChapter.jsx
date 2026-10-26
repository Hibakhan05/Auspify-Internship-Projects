import { useMemo, useRef } from "react";
import { primeStrokes } from "../../../lib/animation";
import { useChapterScrub } from "../../../hooks/useChapterScrub";
import { IVORY, SAGE, SANS, SERIF } from "../../../lib/theme";

/** One path holding 48 tick marks around the outer ring (every 4th is longer). */
function buildTicks(cx, cy, r) {
  let d = "";
  for (let i = 0; i < 48; i += 1) {
    const a = (i / 48) * Math.PI * 2 - Math.PI / 2;
    const len = i % 4 === 0 ? 20 : 10;
    const x1 = cx + Math.cos(a) * (r + 6);
    const y1 = cy + Math.sin(a) * (r + 6);
    const x2 = cx + Math.cos(a) * (r + 6 + len);
    const y2 = cy + Math.sin(a) * (r + 6 + len);
    d += `M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)} `;
  }
  return d.trim();
}

/** Time loops: concentric rings and a hand that sweeps around as you scroll. */
export default function LoopChapter() {
  const ref = useRef(null);
  const ticks = useMemo(() => buildTicks(300, 300, 236), []);

  useChapterScrub(ref, (tl, q) => {
    const rings = primeStrokes(q(".lp-ring"));
    const tickPath = primeStrokes(q(".lp-ticks"));

    tl.set(q(".lp-hand"), { opacity: 0, rotation: 0, svgOrigin: "300 300" }, 0)
      .set(q(".lp-label"), { opacity: 0 }, 0)
      .to(rings, { strokeDashoffset: 0, stagger: 0.3, duration: 1.4 })
      .to(tickPath, { strokeDashoffset: 0, duration: 1.4 }, "-=0.8")
      .to(q(".lp-hand"), { opacity: 1, duration: 0.4 })
      .to(q(".lp-hand"), { rotation: 300, svgOrigin: "300 300", duration: 3 })
      .to(q(".lp-label"), { opacity: 1, stagger: 0.25, duration: 0.6 }, "-=2.2");
  });

  return (
    <section ref={ref} className="relative h-[220vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center gap-6 overflow-hidden px-6 pt-20 md:grid md:grid-cols-12 md:items-start md:gap-0 md:px-16 md:pt-40">
        <svg
          viewBox="0 0 600 600"
          className="order-2 max-h-[50vh] w-full md:order-1 md:col-span-6 md:col-start-1 md:max-h-[80vh]"
          fill="none"
          stroke={SAGE}
          strokeWidth="1"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle className="lp-ring" cx="300" cy="300" r="236" />
          <circle className="lp-ring" cx="300" cy="300" r="176" opacity="0.7" />
          <circle className="lp-ring" cx="300" cy="300" r="112" opacity="0.5" />
          <path className="lp-ticks" d={ticks} opacity="0.8" />

          <g className="lp-hand">
            <path d="M300 300 L300 78" />
            <circle cx="300" cy="78" r="5" fill={IVORY} stroke="none" />
          </g>
          <circle cx="300" cy="300" r="3" fill={SAGE} stroke="none" />

          <g fill={SAGE} stroke="none" fontSize="13" fontFamily="Inter, system-ui, sans-serif">
            <text className="lp-label" x="318" y="226">morning</text>
            <text className="lp-label" x="318" y="400">midday</text>
            <text className="lp-label" x="212" y="376">evening</text>
          </g>
        </svg>

        <div className="order-1 md:order-2 md:col-span-4 md:col-start-9">
          <h2
            data-reveal
            className={`${SERIF} text-[clamp(2.25rem,4.6vw,4.25rem)] leading-[1.02] tracking-tight text-[#FAF9F6]`}
          >
            Time moves in loops. Your plan should too.
          </h2>
          <p data-reveal className={`${SANS} mt-8 max-w-sm text-base font-light leading-relaxed text-[#FAF9F6]/70`}>
            Plan against the shape of your day. Review each week. Let
            unfinished work roll forward without guilt.
          </p>
        </div>
      </div>
    </section>
  );
}
