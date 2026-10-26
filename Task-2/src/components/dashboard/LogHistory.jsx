import { useMemo, useState } from "react";
import { fmtLongDay, fmtTime, toKey } from "../../lib/dates";
import { FOCUS, SANS } from "../../lib/theme";

const PAGE = 5;

/** Archive of finished work, grouped by the day it was completed. */
export default function LogHistory({ completed, onReopen }) {
  const [limit, setLimit] = useState(PAGE);

  const groups = useMemo(() => {
    const map = new Map();
    [...completed]
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .forEach((t) => {
        const when = new Date(t.completedAt);
        const key = toKey(when);
        if (!map.has(key)) map.set(key, { key, date: when, items: [] });
        map.get(key).items.push(t);
      });
    return [...map.values()];
  }, [completed]);

  if (groups.length === 0) {
    return (
      <p className={`${SANS} text-base font-light text-[#FAF9F6]/45`}>
        Nothing logged yet. Finish a task and it will be kept here.
      </p>
    );
  }

  return (
    <div>
      <ol className="relative border-l border-[#9EAF97]/30 pl-8">
        {groups.slice(0, limit).map((group) => (
          <li key={group.key} className="relative pb-12 last:pb-0">
            <span
              aria-hidden="true"
              className="absolute -left-[37px] top-1.5 h-2 w-2 rounded-full border border-[#9EAF97] bg-[#11141A]"
            />
            <p className={`${SANS} text-sm text-[#9EAF97]`}>
              {fmtLongDay(group.date)}
              <span className="ml-3 text-[#FAF9F6]/40">{group.items.length} done</span>
            </p>
            <ul className="mt-4">
              {group.items.map((t) => (
                <li key={t.id} className="group flex items-center justify-between gap-4 border-b border-[#9EAF97]/10 py-1">
                  <span className={`${SANS} min-w-0 flex-1 break-words py-3 text-base font-light text-[#FAF9F6]/75`}>{t.text}</span>
                  <span className={`${SANS} flex shrink-0 items-center gap-2 text-xs text-[#FAF9F6]/55`}>
                    {fmtTime(new Date(t.completedAt))}
                    {/* Always visible. Only a mouse-driven desktop tucks it away until hover or focus. */}
                    <button
                      type="button"
                      onClick={() => onReopen(t.id)}
                      className={`flex h-11 min-w-11 items-center justify-center px-2 text-[#9EAF97] transition-colors hover:text-[#FAF9F6] md:pointer-fine:opacity-0 md:pointer-fine:group-hover:opacity-100 md:pointer-fine:group-focus-within:opacity-100 ${FOCUS}`}
                    >
                      Reopen
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      {groups.length > limit && (
        <button
          type="button"
          onClick={() => setLimit((l) => l + PAGE)}
          className={`${SANS} mt-10 text-sm text-[#9EAF97] transition-colors hover:text-[#FAF9F6] ${FOCUS}`}
        >
          Show earlier days
        </button>
      )}
    </div>
  );
}
