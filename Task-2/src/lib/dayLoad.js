import { addDays, fromKey, toKey, todayKey } from "./dates";
import { WEIGHT_VALUE, weightOf } from "./weights";

export const DAY_CAPACITY = 8;
export const WEIGHT_POINTS = WEIGHT_VALUE;
export function countsToward(task, date, today = todayKey()) {
  if (task.done || !task.dueDate) return false;
  return date === today ? task.dueDate <= today : task.dueDate === date;
}

export function dayLoad(tasks, date, { today = todayKey(), capacity = DAY_CAPACITY } = {}) {
  const counts = { light: 0, medium: 0, heavy: 0 };
  let points = 0;
  let count = 0;
  let overduePoints = 0;
  let overdueHeavy = 0;

  tasks.forEach((t) => {
    if (!countsToward(t, date, today)) return;
    const w = weightOf(t);
    const p = WEIGHT_POINTS[w];
    points += p;
    count += 1;
    counts[w] += 1;
    if (t.dueDate < date) {
      overduePoints += p;
      if (w === "heavy") overdueHeavy += 1;
    }
  });

  return {
    date,
    capacity,
    points,
    count,
    counts,
    overduePoints,
    overdueHeavy,
    remaining: Math.max(capacity - points, 0),
    over: Math.max(points - capacity, 0),
    isFull: points >= capacity,
    isOver: points > capacity,
  };
}

export function wouldExceed(tasks, date, weight, { ignoreId = null, today, capacity } = {}) {
  const opts = { today, capacity };
  const moving = ignoreId ? tasks.find((t) => t.id === ignoreId) : null;

  if (moving && countsToward(moving, date, today)) {
    const same = dayLoad(tasks, date, opts);
    return { before: same, added: 0, after: same.points, exceeds: false };
  }

  const rest = ignoreId ? tasks.filter((t) => t.id !== ignoreId) : tasks;
  const before = dayLoad(rest, date, opts);
  const added = WEIGHT_POINTS[weight];
  const after = before.points + added;
  return { before, added, after, exceeds: after > before.capacity };
}

export function suggestDay(tasks, fromDate, weight, { ignoreId = null, today, capacity, horizon = 7 } = {}) {
  for (let i = 1; i <= horizon; i += 1) {
    const key = toKey(addDays(fromKey(fromDate), i));
    if (!wouldExceed(tasks, key, weight, { ignoreId, today, capacity }).exceeds) return key;
  }
  return null;
}