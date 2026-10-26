import { addDays, toKey } from "./dates";
import { WEIGHT_VALUE, weightOf } from "./weights";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function smoothPath(pts) {
  if (pts.length < 2) return "";
  let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

/**
  "Your year as one line".
  Walks the last 365 days with a decaying momentum value: each completed task
  adds its weight, every quiet day lets it fall back by 10 percent. The line
  rises on consistent days and settles flat on the baseline when nothing is
  finished. The rise saturates softly so it never clips at the top.
 */
export function buildYearLine(tasks, { days = 365, width = 1200, height = 180, now = new Date() } = {}) {
  const counts = new Map();
  let completed = 0;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = addDays(today, -(days - 1));

  tasks.forEach((t) => {
    if (!t.done || !t.completedAt) return;
    const when = new Date(t.completedAt);
    if (when < start) return;
    const key = toKey(when);
    counts.set(key, (counts.get(key) || 0) + WEIGHT_VALUE[weightOf(t)]);
    completed += 1;
  });

  const base = height - 30;
  const maxRise = height - 64;
  const x = (i) => (i / (days - 1)) * width;
  const y = (m) => base - maxRise * (1 - Math.exp(-m / 4));

  let momentum = 0;
  const pts = [];
  const months = [];
  for (let i = 0; i < days; i += 1) {
    const date = addDays(start, i);
    momentum = momentum * 0.9 + (counts.get(toKey(date)) || 0);
    pts.push({ x: x(i), y: y(momentum) });
    if (date.getDate() === 1) months.push({ x: x(i), label: MONTHS[date.getMonth()] });
  }

  return { d: smoothPath(pts), dot: pts[pts.length - 1], months, completed, base, width, height };
}
