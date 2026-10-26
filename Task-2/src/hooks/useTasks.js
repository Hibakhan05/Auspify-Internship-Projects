import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { makeId } from "../lib/id";

export function useTasks(userId) {
  const [tasks, setTasks] = useLocalStorage(`clareo.tasks.${userId}`, []);

  const add = useCallback(
    (text, dueDate = null, weight = "medium") =>
      setTasks((prev) => [
        {
          id: makeId(),
          text,
          done: false,
          weight,
          dueDate,
          createdAt: new Date().toISOString(),
          completedAt: null,
        },
        ...prev,
      ]),
    [setTasks]
  );

  const toggle = useCallback(
    (id) =>
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, done: !t.done, completedAt: t.done ? null : new Date().toISOString() }
            : t
        )
      ),
    [setTasks]
  );

  // Marks done only if still open (used when a focus session ends).
  const complete = useCallback(
    (id) =>
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id && !t.done ? { ...t, done: true, completedAt: new Date().toISOString() } : t
        )
      ),
    [setTasks]
  );

  const edit = useCallback(
    (id, text) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t))),
    [setTasks]
  );

  const setWeight = useCallback(
    (id, weight) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, weight } : t))),
    [setTasks]
  );

  const setDate = useCallback(
    (id, dueDate) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, dueDate } : t))),
    [setTasks]
  );

  const moveMany = useCallback(
    (ids, dueDate) =>
      setTasks((prev) => prev.map((t) => (ids.includes(t.id) ? { ...t, dueDate } : t))),
    [setTasks]
  );

  const remove = useCallback(
    (id) => setTasks((prev) => prev.filter((t) => t.id !== id)),
    [setTasks]
  );

  const removeMany = useCallback(
    (ids) => setTasks((prev) => prev.filter((t) => !ids.includes(t.id))),
    [setTasks]
  );

  return { tasks, add, toggle, complete, edit, setWeight, setDate, moveMany, remove, removeMany };
}
