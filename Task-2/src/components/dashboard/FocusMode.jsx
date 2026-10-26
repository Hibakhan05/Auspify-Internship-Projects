import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "../../lib/gsap";
import { prefersReducedMotion } from "../../lib/animation";
import { FOCUS, SANS, SERIF } from "../../lib/theme";

export const FOCUS_LENGTHS = [15, 25, 50];


//  * One Thing Mode. The whole workspace falls away; a single task is shown in
//  * large serif type. There are no numbers and no rings: a hairline draws along
//  * the base of the screen, and when it reaches the end the task completes.
//  * Timing uses wall clock time, so a hidden tab cannot slow the session down.
 
export default function FocusMode({ task, minutes, onMinutes, onComplete, onExit }) {
  const root = useRef(null);
  const line = useRef(null);
  const leaving = useRef(null);
  const hideTimer = useRef(null);
  const latest = useRef({ onComplete, onExit });
  latest.current = { onComplete, onExit };

  const [finished, setFinished] = useState(false);
  const [controls, setControls] = useState(false);

  // Entrance: the screen clears, then the task rises into place.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from(root.current, { opacity: 0, duration: 0.6 });
      gsap.from(".fm-title", { y: 30, opacity: 0, duration: 1.1, delay: 0.3, ease: "power3.out" });
    }, root);
    return () => ctx.revert();
  }, []);

  const leave = useCallback(() => {
    if (prefersReducedMotion()) {
      latest.current.onExit();
      return;
    }
    leaving.current?.kill();
    leaving.current = gsap.to(root.current, {
      opacity: 0,
      duration: 0.4,
      onComplete: () => latest.current.onExit(),
    });
  }, []);

  // Escape leaves. The page behind cannot scroll while this is open.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") leave();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      leaving.current?.kill();
      window.clearTimeout(hideTimer.current);
    };
  }, [leave]);

  // The timer line.
  useEffect(() => {
    if (!task) return undefined;
    setFinished(false);

    const total = minutes * 60 * 1000;
    const start = Date.now();
    let raf = 0;

    const paint = (p) => {
      if (line.current) line.current.style.transform = `scaleX(${p})`;
    };
    const tick = () => {
      const p = Math.min((Date.now() - start) / total, 1);
      paint(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    tick();

    const done = window.setTimeout(() => {
      cancelAnimationFrame(raf);
      paint(1);
      setFinished(true);
      latest.current.onComplete(task.id);
    }, total);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(done);
    };
  }, [task?.id, minutes]); 

  // After completing, hold for a moment, then return to the workspace.
  useEffect(() => {
    if (!finished) return undefined;
    const t = window.setTimeout(leave, 3400);
    return () => window.clearTimeout(t);
  }, [finished, leave]);

  // Controls stay hidden until the pointer moves.
  const reveal = () => {
    setControls(true);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setControls(false), 2500);
  };

  const cycle = () => {
    const i = FOCUS_LENGTHS.indexOf(minutes);
    onMinutes(FOCUS_LENGTHS[(i + 1) % FOCUS_LENGTHS.length]);
  };

  const ghost = `${SANS} text-xs text-[#FAF9F6]/45 transition-colors hover:text-[#FAF9F6] ${FOCUS}`;

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label="One Thing Mode"
      onMouseMove={reveal}
      onTouchStart={reveal}
      className="fixed inset-0 z-[90] flex items-center bg-[#11141A] px-8 md:px-24"
    >
      {task ? (
        <div className="fm-title max-w-5xl">
          <h1
            className={`${SERIF} text-[clamp(2.5rem,7vw,7rem)] font-normal leading-[1.04] tracking-tight text-[#FAF9F6]`}
          >
            <span
              style={{
                backgroundImage: "linear-gradient(#9EAF97,#9EAF97)",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "0 58%",
                backgroundSize: finished ? "100% 2px" : "0% 2px",
                transition: "background-size 1.4s ease",
                boxDecorationBreak: "clone",
                WebkitBoxDecorationBreak: "clone",
              }}
            >
              {task.text}
            </span>
          </h1>
          {finished && (
            <p className={`${SANS} mt-8 text-sm font-light text-[#9EAF97]`} role="status">
              Done.
            </p>
          )}
        </div>
      ) : (
        <div className="fm-title">
          <h1 className={`${SERIF} text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.04] tracking-tight`}>Nothing open.</h1>
          <p className={`${SANS} mt-6 text-base font-light text-[#FAF9F6]/55`}>Enjoy the quiet.</p>
        </div>
      )}

      {/* Timer: a hairline along the very bottom edge */}
      {task && (
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-[#9EAF97]/15">
          <div ref={line} className="h-px w-full origin-left bg-[#9EAF97]" style={{ transform: "scaleX(0)" }} />
        </div>
      )}

      <div
        className={`absolute bottom-8 left-8 right-8 flex justify-between transition-opacity duration-500 focus-within:opacity-100 md:left-24 md:right-24 ${
          controls && !finished ? "opacity-100" : "opacity-0"
        }`}
      >
        <button type="button" onClick={leave} className={ghost}>
          Leave (Esc)
        </button>
        {task && (
          <button type="button" onClick={cycle} className={ghost}>
            {minutes} minutes. Change
          </button>
        )}
      </div>
    </div>
  );
}
