import { addDays, toKey } from "./dates";

const WINDOW = 14;

export function computeClarity(tasks, now = new Date()) {
  const counts = new Map();
  tasks.forEach((t) => {
    if (!t.done || !t.completedAt) return;
    const key = toKey(new Date(t.completedAt));
    counts.set(key, (counts.get(key) || 0) + 1);
  });

  // Current streak
  let cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (!counts.has(toKey(cursor))) cursor = addDays(cursor, -1);
  let streak = 0;
  while (counts.has(toKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  // Best streak
  const sorted = [...counts.keys()].sort();
  let best = 0;
  let run = 0;
  let prev = null;
  sorted.forEach((key) => {
    if (prev && toKey(addDays(prev, 1)) === key) run += 1;
    else run = 1;
    best = Math.max(best, run);
    const [y, m, d] = key.split("-").map(Number);
    prev = new Date(y, m - 1, d);
  });

  // Last 14 days
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const last14 = Array.from({ length: WINDOW }, (_, i) => {
    const key = toKey(addDays(today, i - (WINDOW - 1)));
    return { key, count: counts.get(key) || 0 };
  });
  const activeDays = last14.filter((d) => d.count > 0).length;

  // Completion rate of recent tasks
  const windowStart = addDays(today, -(WINDOW - 1)).getTime();
  const recent = tasks.filter((t) => new Date(t.createdAt).getTime() >= windowStart);
  const rate = recent.length ? recent.filter((t) => t.done).length / recent.length : 0;

  const index = Math.round(100 * (0.6 * (activeDays / WINDOW) + 0.4 * rate));
  return { streak, best, activeDays, rate, index, last14 };
}
