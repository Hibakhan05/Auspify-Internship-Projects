import { useLayoutEffect } from "react";
import { gsap } from "../lib/gsap";
import { prefersReducedMotion } from "../lib/animation";


export function useChapterScrub(ref, build) {
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });
      build(tl, gsap.utils.selector(ref));

      // Headings and paragraphs marked data-reveal play on a timer, not on
      // scroll. They start as soon as the chapter nears the top, so jumping
      // here from the Features link never lands on an empty screen.
      const reveal = gsap.utils.selector(ref)("[data-reveal]"); // scoped to this chapter
      if (reveal.length) {
        gsap.set(reveal, { opacity: 0, y: 28 });
        gsap.to(reveal, {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.18,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 45%",
            toggleActions: "play none none reverse",
          },
        });
      }
    }, ref);

    return () => ctx.revert();
    // The timeline is built once per mount.
  }, []);
}
