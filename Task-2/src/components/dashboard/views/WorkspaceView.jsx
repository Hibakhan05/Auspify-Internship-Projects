import { useMemo } from "react";
import { fmtLongDay, toKey, todayKey } from "../../../lib/dates";
import { friendlyName } from "../../../lib/names";
import { sortTasks } from "../../../lib/priority";
import { FOCUS, SANS, SERIF } from "../../../lib/theme";
import TaskManager from "../TaskManager";
import YearLine from "../YearLine";
import ClarityIndex from "../ClarityIndex";
import RecentDays from "../RecentDays";

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};


export default function WorkspaceView({ user, tasks, stats, api, closedToday, onCloseDay }) {
  const today = todayKey();
  const evening = new Date().getHours() >= 18;

  // Open work from any day, plus whatever was finished today.
  const visible = useMemo(
    () =>
      sortTasks(
        tasks.filter((t) => !t.done || (t.completedAt && toKey(new Date(t.completedAt)) === today))
      ),
    [tasks, today]
  );

  return (
    <>
      {/* 1. Header */}
      <header className="view-in flex flex-wrap items-end justify-between gap-x-8 gap-y-2 pt-8 md:pt-10">
        <div className="min-w-0">
          <p className={`${SANS} text-sm text-[#9EAF97]`}>{fmtLongDay(new Date())}</p>
          <p className={`${SERIF} mt-1 text-[1.375rem] italic leading-tight tracking-tight text-[#FAF9F6]/90`}>
            {greeting()}, {friendlyName(user.email)}.
          </p>
        </div>

        {/* A quiet text action. The hint is a readable 14px. */}
        <div className="flex flex-wrap items-center gap-x-5">
          {evening && !closedToday && (
            <p className={`${SANS} hidden text-sm font-light text-[#FAF9F6]/70 md:block`}>
              It is evening. Close the day when you are ready.
            </p>
          )}
          <button
            type="button"
            onClick={onCloseDay}
            className={`${SANS} inline-flex h-11 items-center text-sm underline decoration-[#9EAF97]/60 underline-offset-[6px] transition-colors hover:text-[#FAF9F6] hover:decoration-[#9EAF97] ${FOCUS} ${
              closedToday ? "text-[#FAF9F6]/70" : "text-[#FAF9F6]/90"
            }`}
          >
            {closedToday ? "Day closed. Review" : "Close the day"}
          </button>
        </div>
      </header>

      {/* 2. Action engine */}
      <div className="mt-8 grid grid-cols-1 gap-14 md:mt-10 xl:grid-cols-[minmax(0,1fr)_18rem] xl:gap-x-16 xl:gap-y-0">
        <div className="min-w-0">
          <div className="view-in">
            <TaskManager
              heading="Today"
              headingAs="h1"
              tasks={visible}
              allTasks={tasks}
              dateForNew={today}
              assignKey={today}
              emptyText="All clear. Add the one thing that matters."
              onAdd={api.add}
              onToggle={api.toggle}
              onEdit={api.edit}
              onDelete={api.remove}
              onAssign={api.setDate}
              onWeight={api.setWeight}
            />
          </div>
        </div>

        {/* Sticky on wide screens, so the rail stays beside the list as it scrolls. */}
        <aside className="min-w-0 xl:sticky xl:top-8 xl:mt-[3.25rem] xl:self-start">
          <div className="view-in grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-1">
            <ClarityIndex stats={stats} />
            <RecentDays stats={stats} />
          </div>
        </aside>
      </div>

      {/* 3. Reflection */}
      <section aria-label="Reflection" className="view-in mt-28 border-t border-[#9EAF97]/25 pt-14 md:mt-36">
        <YearLine tasks={tasks} />
      </section>
    </>
  );
}
