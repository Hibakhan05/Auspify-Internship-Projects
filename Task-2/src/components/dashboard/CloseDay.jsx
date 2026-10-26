import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { prefersReducedMotion } from "../../lib/animation";
import { addDays, toKey, todayKey } from "../../lib/dates";
import { sortTasks } from "../../lib/priority";
import { dayLoad } from "../../lib/dayLoad";
import { WEIGHT_LABEL, weightOf } from "../../lib/weights";
import { FOCUS, SANS, SERIF } from "../../lib/theme";

 
//  * Close the day. A calm review: what you finished, and for everything still
//  * open, one decision. Carry Forward moves it to tomorrow. Release deletes it
//  * and keeps no record.
 
export default function CloseDay({ tasks, onCarry, onRelease, onClosed, onClose }) {
  const root = useRef(null);
  const first = useRef(null);
  const leaving = useRef(null);

  const today = todayKey();
  const tomorrow = toKey(addDays(new Date(), 1));

  const finished = tasks.filter((t) => t.done && t.completedAt && toKey(new Date(t.completedAt)) === today);
  const heavyDone = finished.filter((t) => weightOf(t) === "heavy").length;
  const pending = sortTasks(tasks.filter((t) => !t.done && t.dueDate && t.dueDate <= today));

  // What tomorrow would look like if everything still open were carried there.
  const pendingIds = new Set(pending.map((t) => t.id));
  const tomorrowLoad = dayLoad(
    tasks.map((t) => (pendingIds.has(t.id) ? { ...t, dueDate: tomorrow } : t)),
    tomorrow,
    { today }
  );

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".cd-veil", { opacity: 0, duration: 0.4 })
        .from(".cd-panel", { x: 64, opacity: 0, duration: 0.7 }, 0.05)
        .from(".cd-in", { y: 14, opacity: 0, stagger: 0.08, duration: 0.6 }, 0.35);
    }, root);
    return () => ctx.revert();
  }, []);

  const leave = () => {
    if (prefersReducedMotion()) {
      onClose();
      return;
    }
    leaving.current?.kill();
    leaving.current = gsap.to(root.current, { opacity: 0, duration: 0.25, onComplete: onClose });
  };

  useEffect(() => {
    first.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") leave();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      leaving.current?.kill();
    };
  }, []);

  const finish = () => {
    onClosed();
    leave();
  };

  const action = `${SANS} text-sm transition-colors ${FOCUS}`;

  return (
    <div ref={root} className="fixed inset-0 z-[80] flex" role="dialog" aria-modal="true" aria-labelledby="cd-title">
      <div className="cd-veil absolute inset-0 bg-[#11141A]/85 backdrop-blur-sm" onClick={leave} />

      <div className="cd-panel relative ml-auto h-full w-full overflow-y-auto border-l border-[#9EAF97]/25 bg-[#11141A] px-8 py-14 md:w-[min(44rem,70vw)] md:px-16 md:py-20">
        <button
          ref={first}
          type="button"
          onClick={leave}
          className={`${action} absolute right-8 top-8 text-[#FAF9F6]/50 hover:text-[#FAF9F6]`}
        >
          Close (Esc)
        </button>

        <h2 id="cd-title" className={`${SERIF} cd-in text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[1.02] tracking-tight`}>
          Close the day.
        </h2>
        <p className={`${SANS} cd-in mt-5 text-base font-light text-[#FAF9F6]/60`}>
          {finished.length === 0
            ? "Nothing finished today, and that is allowed."
            : `${finished.length} finished today${heavyDone ? `, ${heavyDone} of them heavy` : ""}.`}
        </p>

        {pending.length > 0 ? (
          <section className="cd-in mt-16" aria-label="Still open">
            <p className={`${SANS} text-sm text-[#9EAF97]`}>Still open</p>
            <ul className="mt-3">
              {pending.map((t) => (
                <li key={t.id} className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-[#9EAF97]/15 py-5">
                  <span className={`${SANS} min-w-0 flex-1 break-words text-base font-light`}>
                    {t.text}
                    <span className="ml-3 text-xs text-[#FAF9F6]/55">{WEIGHT_LABEL[weightOf(t)]}</span>
                  </span>
                  <span className="flex gap-6">
                    <button type="button" onClick={() => onCarry([t.id], tomorrow)} className={`${action} text-[#9EAF97] hover:text-[#FAF9F6]`}>
                      Carry Forward
                    </button>
                    <button type="button" onClick={() => onRelease([t.id])} className={`${action} text-[#FAF9F6]/50 hover:text-[#FAF9F6]`}>
                      Release
                    </button>
                  </span>
                </li>
              ))}
            </ul>
            <p className={`${SANS} mt-4 text-xs leading-relaxed text-[#FAF9F6]/40`}>
              Carry Forward moves a task to tomorrow. Release removes it, and no record is kept.
            </p>
            <p className={`${SANS} mt-6 text-sm font-light text-[#FAF9F6]/70`} role="status">
              Carrying all of this would bring tomorrow to {tomorrowLoad.points} of {tomorrowLoad.capacity} points.
              {tomorrowLoad.isOver && " That is heavier than a focused day. Release a few, or carry only what matters."}
            </p>
            <button
              type="button"
              onClick={() => onCarry(pending.map((t) => t.id), tomorrow)}
              className={`${action} mt-8 text-[#9EAF97] underline decoration-[#9EAF97]/40 underline-offset-4 hover:text-[#FAF9F6]`}
            >
              Carry everything forward
            </button>
          </section>
        ) : (
          <p className={`${SERIF} cd-in mt-16 text-2xl leading-snug text-[#FAF9F6]/85`}>
            Nothing is left open. The day is ready to close.
          </p>
        )}

        <div className="cd-in mt-16">
          <button
            type="button"
            onClick={finish}
            className={`${SANS} group relative overflow-hidden border border-[#9EAF97] px-8 py-3 text-sm text-[#FAF9F6] transition-colors duration-300 hover:text-[#11141A] ${FOCUS}`}
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 translate-y-full bg-[#9EAF97] transition-transform duration-300 ease-out group-hover:translate-y-0"
            />
            <span className="relative">Close the day</span>
          </button>
        </div>
      </div>
    </div>
  );
}
