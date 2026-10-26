import { useLayoutEffect, useMemo, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { prefersReducedMotion, primeStrokes } from "../../lib/animation";
import { buildYearLine } from "../../lib/yearLine";
import { IVORY, SAGE, SANS, SERIF } from "../../lib/theme";

//  * "Your year as one line". A thin wave built from completion timestamps:
//  * it rises on consistent days and flattens through quiet stretches.
//  * It draws itself each time the Workspace opens.
 
export default function YearLine({ tasks }) {
  const root = useRef(null);
  const line = useMemo(() => buildYearLine(tasks), [tasks]);

  // The line now lives at the bottom of the page, so it must not draw on
  // mount. It waits until it scrolls into view.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;

    let observer;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const path = primeStrokes(q(".yl-path"));
      gsap.set(q(".yl-dot"), { opacity: 0 });

      const draw = gsap
        .timeline({ paused: true })
        .to(path, {
          strokeDashoffset: 0,
          duration: 2.4,
          ease: "power2.inOut",
          // Later data changes must not be clipped by a stale dash length.
          onComplete: () => gsap.set(path, { clearProps: "strokeDasharray,strokeDashoffset" }),
        })
        .to(q(".yl-dot"), { opacity: 1, duration: 0.4 });

      if (typeof IntersectionObserver === "undefined") {
        draw.play();
      } else {
        observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            draw.play();
            observer.disconnect();
          },
          { threshold: 0.35 }
        );
        observer.observe(root.current);
      }
    }, root);

    return () => {
      observer?.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} aria-label="Your year as one line">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className={`${SERIF} text-2xl tracking-tight`}>Your year as one line</h2>
        <p className={`${SANS} text-sm text-[#FAF9F6]/70`}>
          {line.completed === 1 ? "1 task finished" : `${line.completed} tasks finished`} in the last year
        </p>
      </div>

      <svg
        viewBox={`0 0 ${line.width} ${line.height}`}
        className="mt-4 w-full"
        fill="none"
        role="img"
        aria-label="A line that rises with consistent task completion over the past year"
      >
        <path d={`M0 ${line.base} H${line.width}`} stroke={SAGE} strokeOpacity="0.25" strokeDasharray="2 6" />
        <path className="yl-path" d={line.d} stroke={SAGE} strokeWidth="1.25" strokeLinecap="round" />
        <circle className="yl-dot" cx={line.dot.x - 3} cy={line.dot.y} r="3.5" fill={IVORY} />
        {line.months.map((m) => (
          <text
            key={`${m.label}${m.x}`}
            x={m.x}
            y={line.height - 6}
            fill={SAGE}
            fillOpacity="0.85"
            fontSize="13"
            fontFamily="Inter, system-ui, sans-serif"
          >
            {m.label}
          </text>
        ))}
      </svg>

      {line.completed === 0 && (
        <p className={`${SANS} mt-2 text-sm font-light text-[#FAF9F6]/70`}>
          Finish a task and the line begins to rise.
        </p>
      )}
    </section>
  );
}
