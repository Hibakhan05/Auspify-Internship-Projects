import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { prefersReducedMotion } from "../../lib/animation";
import { fmtRelativeDay } from "../../lib/dates";
import { FOCUS, SANS, SERIF } from "../../lib/theme";

const inline = (name) => (name === "Today" || name === "Tomorrow" ? name.toLowerCase() : name);
const clip = (s, n = 52) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}...` : s);


//  * A polite, in-flow notice shown when a placement would push a day past its
//  * capacity. It never blocks and never scolds: three clear choices, and the
//  * original text is kept so nothing the person typed is lost.
 
export default function LoadNotice({ pending, onSuggest, onAnyway, onCancel }) {
  const root = useRef(null);
  const first = useRef(null);
  const { kind, text, date, check, suggestion } = pending;
  const { before, after } = check;

  const dayName = fmtRelativeDay(date);
  const verb = kind === "move" ? "Moving" : "Adding";
  const state = before.points >= before.capacity ? "already full" : "getting heavy";

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from(root.current, { opacity: 0, y: 8, duration: 0.45, ease: "power3.out" });
    }, root);
    return () => ctx.revert();
  }, []);

  // Move focus into the notice so keyboard users land on a choice.
  useEffect(() => {
    first.current?.focus();
  }, []);

  const base = `${SANS} text-sm transition-colors ${FOCUS}`;

  return (
    <div
      ref={root}
      role="group"
      aria-label="Day capacity notice"
      aria-live="polite"
      onKeyDown={(e) => {
        if (e.key === "Escape") onCancel();
      }}
      className="mt-6 border-l border-[#9EAF97] pb-1 pl-5"
    >
      <p className={`${SERIF} text-xl leading-snug tracking-tight text-[#FAF9F6]`}>
        {dayName} is {state}.
      </p>

      <p className={`${SANS} mt-3 max-w-md text-sm font-light leading-relaxed text-[#FAF9F6]/70`}>
        {verb} this would bring {inline(dayName)} to {after} of {before.capacity} points. A focused day holds about{" "}
        {before.capacity}.
        {before.overduePoints > 0 &&
          ` ${before.overduePoints} ${before.overduePoints === 1 ? "point comes" : "points come"} from overdue tasks.`}
      </p>

      <p className={`${SANS} mt-2 text-[13px] text-[#FAF9F6]/70`}>For: {clip(text)}</p>

      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-1">
        {suggestion && (
          <button
            ref={first}
            type="button"
            onClick={onSuggest}
            className={`${base} flex h-11 items-center border border-[#9EAF97]/60 px-5 text-[#FAF9F6] hover:border-[#9EAF97] hover:bg-[#9EAF97] hover:text-[#11141A]`}
          >
            Plan for {inline(fmtRelativeDay(suggestion))}
          </button>
        )}
        <button
          ref={suggestion ? undefined : first}
          type="button"
          onClick={onAnyway}
          className={`${base} flex h-11 items-center text-[#9EAF97] hover:text-[#FAF9F6]`}
        >
          {kind === "move" ? "Move anyway" : "Add anyway"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={`${base} flex h-11 items-center text-[#FAF9F6]/55 hover:text-[#FAF9F6]`}
        >
          Not now
        </button>
      </div>
    </div>
  );
}
