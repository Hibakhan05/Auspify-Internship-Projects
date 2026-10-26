import { useMemo, useRef, useState } from "react";
import { fmtLongDay, fmtRelativeDay, fmtShortDay, fromKey } from "../../lib/dates";
import { WEIGHTS, WEIGHT_LABEL, WEIGHT_VALUE, weightOf } from "../../lib/weights";
import { dayLoad, suggestDay, wouldExceed } from "../../lib/dayLoad";
import { FOCUS, SANS, SERIF } from "../../lib/theme";
import DayLoadMeter from "./DayLoadMeter";
import LoadNotice from "./LoadNotice";
import TaskRow from "./TaskRow";

function CalendarGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" />
      <path d="M4 10h16M9 3v4M15 3v4" />
    </svg>
  );
}

export default function TaskManager({
  heading,
  headingAs: Heading = "h2",
  tasks,
  allTasks,
  dateForNew,
  assignKey,
  emptyText,
  onAdd,
  onToggle,
  onEdit,
  onDelete,
  onAssign,
  onWeight,
}) {
  const inputRef = useRef(null);
  const [text, setText] = useState("");
  const [weight, setWeight] = useState("medium");
  const [dated, setDated] = useState(true); 
  const [pending, setPending] = useState(null); 

  const target = dated ? dateForNew : null;
  const open = tasks.filter((t) => !t.done).length;
  const done = tasks.length - open;

  const load = useMemo(() => (target ? dayLoad(allTasks, target) : null), [allTasks, target]);
  const typing = text.trim().length > 0;

  const commitAdd = (value, date, w) => {
    onAdd(value, date, w);
    setText("");
    setPending(null);
  };

  const submit = (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) {
      inputRef.current?.focus(); 
      return;
    }

    if (target) {
      const check = wouldExceed(allTasks, target, weight);
      if (check.exceeds) {
        setPending({
          kind: "add",
          text: value,
          weight,
          date: target,
          check,
          suggestion: suggestDay(allTasks, target, weight),
        });
        return;
      }
    }
    commitAdd(value, target, weight);
  };

  const requestMove = (id, date) => {
    const task = allTasks.find((t) => t.id === id);
    if (!task) return;
    const w = weightOf(task);
    const check = wouldExceed(allTasks, date, w, { ignoreId: id });
    if (check.exceeds) {
      setPending({
        kind: "move",
        id,
        text: task.text,
        weight: w,
        date,
        check,
        suggestion: suggestDay(allTasks, date, w, { ignoreId: id }),
      });
      return;
    }
    onAssign(id, date);
  };

  const resolve = (date) => {
    if (!pending) return;
    if (pending.kind === "add") {
      commitAdd(pending.text, date, pending.weight);
    } else {
      onAssign(pending.id, date);
      setPending(null);
    }
  };

  const pickWeight = (w) => {
    setWeight(w);
    setPending(null); 
  };

  const assignLabel = assignKey ? `Move to ${fmtRelativeDay(assignKey).toLowerCase()}` : "";
  const chip = `${SANS} inline-flex h-9 items-center text-[13px] transition-colors pointer-coarse:h-11 ${FOCUS}`;

  return (
    <section aria-labelledby="tasks-heading" className="min-w-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <Heading
          id="tasks-heading"
          className={`${SERIF} text-[clamp(2.25rem,3.8vw,3.25rem)] leading-[1.05] tracking-tight`}
        >
          {heading}
        </Heading>
        <p className={`${SANS} text-sm text-[#FAF9F6]/70`} aria-live="polite">
          {open} open, {done} done
        </p>
      </div>

      <form onSubmit={submit} className="mt-6">
        <div className="flex items-center gap-4 border-b border-[#9EAF97]/50 pb-3 transition-colors focus-within:border-[#FAF9F6]">
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (pending) setPending(null);
            }}
            placeholder="What needs doing?"
            aria-label="New task"
            className={`${SANS} min-w-0 flex-1 bg-transparent text-lg font-light text-[#FAF9F6] outline-none placeholder:text-[#FAF9F6]/55 sm:text-xl`}
          />
          <button
            type="submit"
            aria-label="Add task"
            className={`${SANS} flex h-11 shrink-0 items-center gap-2 bg-[#9EAF97] px-4 text-sm font-medium text-[#11141A] transition-colors hover:bg-[#FAF9F6] sm:px-5 ${FOCUS}`}
          >
            <span aria-hidden="true" className="text-lg leading-none">+</span>
            <span className="sm:hidden" aria-hidden="true">Add</span>
            <span className="hidden sm:inline" aria-hidden="true">Add task</span>
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <div
            role="radiogroup"
            aria-label="Task weight"
            className="inline-flex divide-x divide-[#9EAF97]/30 border border-[#9EAF97]/30"
          >
            {WEIGHTS.map((w) => (
              <button
                key={w}
                type="button"
                role="radio"
                aria-checked={weight === w}
                onClick={() => pickWeight(w)}
                className={`${chip} px-3 ${
                  weight === w
                    ? "bg-[#9EAF97]/20 text-[#FAF9F6]"
                    : "text-[#FAF9F6]/70 hover:bg-[#9EAF97]/10 hover:text-[#FAF9F6]"
                }`}
              >
                {WEIGHT_LABEL[w]}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setDated((d) => !d);
              setPending(null);
            }}
            aria-pressed={dated}
            aria-label={
              dated
                ? `Planned for ${fmtLongDay(fromKey(dateForNew))}. Activate to leave undated.`
                : "No date. Activate to plan for a day."
            }
            title={dated ? "Click to leave this task undated" : "Click to plan it for a day"}
            className={`${chip} gap-2 border border-[#9EAF97]/30 px-3 hover:bg-[#9EAF97]/10 hover:text-[#FAF9F6] ${
              dated ? "text-[#FAF9F6]" : "text-[#FAF9F6]/70"
            }`}
          >
            <CalendarGlyph />
            {dated ? fmtShortDay(fromKey(dateForNew)) : "No date"}
          </button>

          {load && (
            <DayLoadMeter
              load={load}
              adding={typing ? WEIGHT_VALUE[weight] : 0}
              className="w-full sm:ml-auto sm:w-auto"
            />
          )}
        </div>

        {pending && (
          <LoadNotice
            key={`${pending.kind}-${pending.id || pending.text}`}
            pending={pending}
            onSuggest={() => resolve(pending.suggestion)}
            onAnyway={() => resolve(pending.date)}
            onCancel={() => setPending(null)}
          />
        )}
      </form>

      <ul className="mt-5">
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            assignKey={assignKey}
            assignLabel={assignLabel}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            onAssign={requestMove}
            onWeight={onWeight}
          />
        ))}
      </ul>

      {tasks.length === 0 && (
        <p className={`${SANS} py-12 text-base font-light text-[#FAF9F6]/70`}>{emptyText}</p>
      )}
    </section>
  );
}
