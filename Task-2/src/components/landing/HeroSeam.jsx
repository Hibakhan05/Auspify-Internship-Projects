import { useLayoutEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { prefersReducedMotion } from "../../lib/animation";

const PILLARS = [
  { x: 80, len: 100 },
  { x: 240, len: 58 },
  { x: 320, len: 82 },
  { x: 560, len: 44 },
  { x: 720, len: 92 },
  { x: 880, len: 66 },
];

export default function HeroSeam() {
  const root = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      gsap.set(".seam-pillar", { scaleY: 0, transformOrigin: "50% 0%" });
      gsap.set(".seam-tick", { opacity: 0 });

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top 88%", end: "top 20%", scrub: 1 },
        })
        .to(".seam-pillar", { scaleY: 1, stagger: 0.12, duration: 1 })
        .to(".seam-tick", { opacity: 1, stagger: 0.08, duration: 0.3 }, ">-0.2");
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} aria-hidden="true" className="relative h-[34vh] md:h-[42vh]">
      {PILLARS.map((p) => (
        <span
          key={p.x}
          className="seam-pillar absolute top-0 w-px bg-[#9EAF97]/40"
          style={{ left: `${p.x / 10}%`, marginLeft: -0.5, height: `${p.len}%` }}
        />
      ))}
      {PILLARS.map((p) => (
        <span
          key={`t${p.x}`}
          className="seam-tick absolute h-px w-[9px] bg-[#9EAF97]"
          style={{ left: `${p.x / 10}%`, marginLeft: -4.5, top: `${p.len}%` }}
        />
      ))}
    </div>
  );
}