import { useState } from "react";
import {
  addDays,
  fmtDayMonth,
  fmtLongDay,
  fmtMonthYear,
  fromKey,
  monthMatrix,
  toKey,
  todayKey,
  weekOf,
} from "../../lib/dates";
import { FOCUS, SANS, SERIF } from "../../lib/theme";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];


//  * Custom calendar with month and week views.
//  * `marks` maps "YYYY-MM-DD" to { open, done } so days with tasks get a small
//  * underline: solid for open work, faint for finished days.

export default function MiniCalendar({ selected, onSelect, marks }) {
  const [mode, setMode] = useState("month"); // month | week
  const [cursor, setCursor] = useState(() => fromKey(selected));
  const today = todayKey();

  const weeks =
    mode === "month" ? monthMatrix(cursor.getFullYear(), cursor.getMonth()) : [weekOf(cursor)];

  const shift = (dir) =>
    setCursor((c) =>
      mode === "month" ? new Date(c.getFullYear(), c.getMonth() + dir, 1) : addDays(c, 7 * dir)
    );

  const label =
    mode === "month"
      ? fmtMonthYear(cursor)
      : `${fmtDayMonth(weeks[0][0])} to ${fmtDayMonth(weeks[0][6])}`;

  const goToday = () => {
    setCursor(new Date());
    onSelect(today);
  };

  const ctl = `${SANS} text-xs text-[#9EAF97] transition-colors hover:text-[#FAF9F6] ${FOCUS}`;

  return (
    <section aria-label="Calendar" className="border border-[#9EAF97]/25 p-6">
      <div className="flex items-baseline justify-between">
        <h2 className={`${SERIF} text-xl tracking-tight`}>{label}</h2>
        <div className="flex gap-4">
          <button type="button" onClick={() => shift(-1)} className={ctl} aria-label="Previous">
            Prev
          </button>
          <button type="button" onClick={() => shift(1)} className={ctl} aria-label="Next">
            Next
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-7 text-center">
        {WEEKDAYS.map((d, i) => (
          <span key={i} className={`${SANS} pb-3 text-xs text-[#FAF9F6]/35`}>
            {d}
          </span>
        ))}

        {weeks.flat().map((day) => {
          const key = toKey(day);
          const info = marks.get(key);
          const outside = mode === "month" && day.getMonth() !== cursor.getMonth();
          const isSelected = key === selected;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              aria-pressed={isSelected}
              aria-label={fmtLongDay(day)}
              className={`${SANS} relative flex h-10 flex-col items-center justify-center text-sm transition-colors ${FOCUS} ${
                isSelected
                  ? "bg-[#9EAF97] text-[#11141A]"
                  : outside
                  ? "text-[#FAF9F6]/25 hover:text-[#FAF9F6]"
                  : "text-[#FAF9F6]/80 hover:text-[#FAF9F6]"
              }`}
            >
              {day.getDate()}
              {info && (
                <span
                  aria-hidden="true"
                  className={`absolute bottom-1.5 h-px w-3 ${
                    isSelected ? "bg-[#11141A]" : info.open ? "bg-[#9EAF97]" : "bg-[#9EAF97]/35"
                  }`}
                />
              )}
              {key === today && !isSelected && (
                <span aria-hidden="true" className="absolute right-1 top-1 h-1 w-1 rounded-full bg-[#FAF9F6]" />
              )}
            </button>
          );
        })}
      </div>

      <div className={`${SANS} mt-5 flex justify-between`}>
        <button type="button" onClick={goToday} className={ctl}>
          Today
        </button>
        <button
          type="button"
          onClick={() => setMode((m) => (m === "month" ? "week" : "month"))}
          className={ctl}
        >
          {mode === "month" ? "Week view" : "Month view"}
        </button>
      </div>
    </section>
  );
}
