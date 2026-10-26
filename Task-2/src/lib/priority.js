import { WEIGHT_VALUE, weightOf } from "./weights";

/** Open tasks first, then by due date (undated last). */
export function sortTasks(list) {
  const byDate = (a, b) => (a.dueDate || "9999-99-99").localeCompare(b.dueDate || "9999-99-99");
  return [...list].sort((a, b) => Number(a.done) - Number(b.done) || byDate(a, b));
}

/**
  The single task One Thing Mode shows.
  Order: due today or overdue first, then heavier, then earlier due date,
  then the oldest. Returns null when nothing is open.
 */
export function pickFocusTask(tasks, today) {
  const open = tasks.filter((t) => !t.done);
  if (open.length === 0) return null;

  const rank = (t) => [
    t.dueDate && t.dueDate <= today ? 0 : 1,
    -WEIGHT_VALUE[weightOf(t)],
    t.dueDate || "9999-99-99",
    t.createdAt || "",
  ];

  return [...open].sort((a, b) => {
    const ra = rank(a);
    const rb = rank(b);
    for (let i = 0; i < ra.length; i += 1) {
      if (ra[i] < rb[i]) return -1;
      if (ra[i] > rb[i]) return 1;
    }
    return 0;
  })[0];
}
