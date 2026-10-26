import { useMemo, useState } from "react";
import { fmtLongDay, fromKey, todayKey } from "../../../lib/dates";
import { sortTasks } from "../../../lib/priority";
import { SANS, SERIF } from "../../../lib/theme";
import MiniCalendar from "../MiniCalendar";
import TaskManager from "../TaskManager";

// Pick a day, see what it holds, plan more into it. //
export default function CalendarView({ tasks, api }) {
  const [selected, setSelected] = useState(todayKey());

  // Per day markers: solid underline for open work, faint for finished days.
  const marks = useMemo(() => {
    const map = new Map();
    tasks.forEach((t) => {
      if (!t.dueDate) return;
      const cur = map.get(t.dueDate) || { open: 0, done: 0 };
      if (t.done) cur.done += 1;
      else cur.open += 1;
      map.set(t.dueDate, cur);
    });
    return map;
  }, [tasks]);

  const dayTasks = useMemo(() => sortTasks(tasks.filter((t) => t.dueDate === selected)), [tasks, selected]);

  return (
    <>
      <header className="view-in pb-4 pt-14 md:pt-20">
        <h1 className={`${SERIF} text-[clamp(2.25rem,5vw,4.5rem)] leading-[1] tracking-tight`}>Calendar</h1>
        <p className={`${SANS} mt-4 text-base font-light text-[#FAF9F6]/55`}>
          Choose a day to see what it holds.
        </p>
      </header>

      <div className="mt-16 grid grid-cols-1 gap-16 xl:grid-cols-[22rem_minmax(0,1fr)] xl:gap-x-16 xl:gap-y-0">
        <div className="view-in min-w-0">
          <MiniCalendar selected={selected} onSelect={setSelected} marks={marks} />
        </div>

        <div className="view-in min-w-0">
          <TaskManager
            heading={fmtLongDay(fromKey(selected))}
            tasks={dayTasks}
            allTasks={tasks}
            dateForNew={selected}
            assignKey={null}
            emptyText="Nothing planned for this day. Add the one thing that matters."
            onAdd={api.add}
            onToggle={api.toggle}
            onEdit={api.edit}
            onDelete={api.remove}
            onAssign={api.setDate}
            onWeight={api.setWeight}
          />
        </div>
      </div>
    </>
  );
}
