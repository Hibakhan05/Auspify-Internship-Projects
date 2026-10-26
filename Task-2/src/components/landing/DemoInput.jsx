import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "../../lib/gsap";
import { prefersReducedMotion, primeStrokes } from "../../lib/animation";
import { FOCUS, IVORY, SANS, SERIF } from "../../lib/theme";
import StackIllustration from "./StackIllustration";


export default function DemoInput({ onSubmit }) {
  const root = useRef(null);
  const inputRef = useRef(null);
  const ghost = useRef(null);
  const anchor = useRef(null);
  const flight = useRef(null);
  const timer = useRef(null);

  const [value, setValue] = useState("");
  const [injected, setInjected] = useState("");
  const [busy, setBusy] = useState(false);

  // Scroll reveal: framing lines, then the stack draws itself.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const strokes = primeStrokes(q(".st-draw"));

      gsap.set(".demo-line-top", { scaleX: 0, transformOrigin: "0% 50%" });
      gsap.set(".demo-line-left", { scaleY: 0, transformOrigin: "50% 0%" });
      gsap.set(".demo-underline", { scaleX: 0, transformOrigin: "0% 50%" });
      gsap.set(".demo-in", { opacity: 0, y: 20 });
      gsap.set(q(".st-label"), { opacity: 0 });

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top 80%", end: "top 15%", scrub: 1 },
        })
        .to(".demo-line-top", { scaleX: 1, duration: 1 }, 0)
        .to(".demo-line-left", { scaleY: 1, duration: 1 }, 0)
        .to(".demo-in", { opacity: 1, y: 0, stagger: 0.15, duration: 0.6 }, 0.4)
        .to(strokes, { strokeDashoffset: 0, stagger: 0.1, duration: 0.8 }, 0.5)
        .to(q(".st-label"), { opacity: 1, stagger: 0.1, duration: 0.4 }, 1.4)
        .to(".demo-underline", { scaleX: 1, duration: 0.8 }, 1);
    }, root);

    return () => ctx.revert();
  }, []);

  // The injected text eases into the plate.
  useLayoutEffect(() => {
    if (!injected || prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from(".st-injected", { opacity: 0, y: 6, duration: 0.6, ease: "power2.out" });
    }, root);
    return () => ctx.revert();
  }, [injected]);

  // Stop any flight or pending modal if the section unmounts.
  useEffect(
    () => () => {
      flight.current?.kill();
      window.clearTimeout(timer.current);
    },
    []
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = value.trim();
    if (!text || busy) return;
    setValue(""); // never stored

    const g = ghost.current;
    const input = inputRef.current;
    const target = anchor.current;
    if (prefersReducedMotion() || !g || !input || !target) {
      setInjected(text);
      onSubmit();
      return;
    }

    setBusy(true);
    const from = input.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    const scale = 0.5;

    g.textContent = text;
    gsap.set(g, { x: from.left, y: from.top, scale: 1, opacity: 1, transformOrigin: "0% 0%" });
    const w = g.offsetWidth;
    const h = g.offsetHeight;
    const plate = root.current.querySelector(".st-top-plate");

    flight.current?.kill();
    flight.current = gsap
      .timeline({
        onComplete: () => {
          setInjected(text);
          timer.current = window.setTimeout(() => {
            setBusy(false);
            onSubmit();
          }, 900);
        },
      })
      .to(g, {
        x: to.left + to.width / 2 - (w * scale) / 2,
        y: to.top + to.height / 2 - (h * scale) / 2,
        scale,
        duration: 0.95,
        ease: "power3.inOut",
      })
      .to(g, { opacity: 0, duration: 0.25 }, "-=0.2")
      .to(plate, { stroke: IVORY, duration: 0.3, yoyo: true, repeat: 1 }, "-=0.5");
  };

  return (
    <section ref={root} className="relative px-6 pb-40 pt-8 md:px-16 md:pt-24">
      <span
        ref={ghost}
        aria-hidden="true"
        className={`${SANS} pointer-events-none fixed left-0 top-0 z-[60] whitespace-nowrap text-xl font-light text-[#FAF9F6] opacity-0 md:text-3xl`}
      />

      <div className="grid gap-12 md:grid-cols-12 md:gap-0">
        <div className="relative pl-6 pt-10 md:col-span-6 md:col-start-2 md:pl-14 md:pt-16">
          <span aria-hidden="true" className="demo-line-top absolute left-0 top-0 h-px w-full bg-[#9EAF97]/40" />
          <span aria-hidden="true" className="demo-line-left absolute left-0 top-0 h-full w-px bg-[#9EAF97]/40" />

          <h2
            className={`${SERIF} demo-in max-w-xl text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] tracking-tight text-[#FAF9F6]`}
          >
            Start with one thing.
          </h2>
          <p className={`${SANS} demo-in mt-5 max-w-sm text-base font-light leading-relaxed text-[#FAF9F6]/60`}>
            Name the objective that would make today a good one.
          </p>

          <form onSubmit={handleSubmit} className="demo-in group mt-16">
            <label htmlFor="demo-priority" className="sr-only">
              Your main objective today
            </label>
            <div className="relative">
              <input
                id="demo-priority"
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                readOnly={busy}
                placeholder="Type your main objective today..."
                autoComplete="off"
                className={`${SANS} w-full bg-transparent pb-5 text-xl font-light text-[#FAF9F6] outline-none placeholder:text-[#FAF9F6]/30 md:text-3xl ${FOCUS}`}
              />
              <span
                aria-hidden="true"
                className="demo-underline absolute bottom-0 left-0 h-px w-full bg-[#9EAF97]/50 transition-colors group-focus-within:bg-[#FAF9F6]"
              />
            </div>
            <p className={`${SANS} mt-4 text-xs text-[#9EAF97]/70`}>Press enter to place it</p>
          </form>
        </div>

        <div className="order-first md:order-none md:col-span-4 md:col-start-9 md:mt-24">
          <StackIllustration
            className="mx-auto max-h-[34vh] w-full md:max-h-[70vh]"
            injected={injected}
            anchorRef={anchor}
          />
        </div>
      </div>
    </section>
  );
}
