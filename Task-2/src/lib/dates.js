const pad = (n) => String(n).padStart(2, "0");

export const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const fromKey = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const todayKey = () => toKey(new Date());

export const addDays = (date, n) => {
  const x = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  x.setDate(x.getDate() + n);
  return x;
};

/** Weeks start on Monday. */
export const startOfWeek = (date) => {
  const x = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
};

export const weekOf = (date) => {
  const start = startOfWeek(date);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

/** Array of weeks (each 7 Dates) covering the given month. */
export const monthMatrix = (year, month) => {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weekCount = Math.ceil((offset + daysInMonth) / 7);
  const start = addDays(first, -offset);
  return Array.from({ length: weekCount }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => addDays(start, w * 7 + d))
  );
};

const fmt = (opts) => new Intl.DateTimeFormat("en-GB", opts);
const monthYear = fmt({ month: "long", year: "numeric" });
const shortDay = fmt({ weekday: "short", day: "numeric", month: "short" });
const longDay = fmt({ weekday: "long", day: "numeric", month: "long" });
const dayMonth = fmt({ day: "numeric", month: "short" });
const clock = fmt({ hour: "2-digit", minute: "2-digit" });

export const fmtMonthYear = (d) => monthYear.format(d);
export const fmtShortDay = (d) => shortDay.format(d);
export const fmtLongDay = (d) => longDay.format(d);
export const fmtDayMonth = (d) => dayMonth.format(d);
export const fmtTime = (d) => clock.format(d);

/** "Today", "Tomorrow", otherwise "Tuesday 13 October". */
export const fmtRelativeDay = (key) => {
  const today = todayKey();
  if (key === today) return "Today";
  if (key === toKey(addDays(fromKey(today), 1))) return "Tomorrow";
  return fmtLongDay(fromKey(key));
};
