/** Task weight replaces priority: how heavy a task feels, not how urgent it is. */
export const WEIGHTS = ["light", "medium", "heavy"];
export const WEIGHT_VALUE = { light: 1, medium: 2, heavy: 3 };
export const WEIGHT_LABEL = { light: "Light", medium: "Medium", heavy: "Heavy" };

/** Tasks saved before weights existed count as medium. */
export const weightOf = (task) => (WEIGHTS.includes(task.weight) ? task.weight : "medium");

export const nextWeight = (w) => WEIGHTS[(WEIGHTS.indexOf(w) + 1) % WEIGHTS.length];

/** Number of open heavy tasks planned for a given day. */
export const heavyOpenOn = (tasks, dateKey) =>
  tasks.filter((t) => !t.done && t.dueDate === dateKey && weightOf(t) === "heavy").length;

const WORDS = { 2: "two", 3: "three", 4: "four", 5: "five" };
export const countWord = (n) => WORDS[n] || String(n);
