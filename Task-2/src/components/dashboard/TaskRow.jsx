import { useState } from "react";
import { fmtDayMonth, fromKey } from "../../lib/dates";
import { WEIGHT_LABEL, WEIGHT_VALUE, nextWeight, weightOf } from "../../lib/weights";
import { FOCUS, SAGE, SANS } from "../../lib/theme";
import Checkbox from "./Checkbox";
import RowMenu from "./RowMenu";

//  * Three hairlines; the heavier the task, the more of them are lit. //
function WeightMark({ weight }) {
  const lit = WEIGHT_VALUE[weight];
  return (
    <svg viewBox="0 0 16 12" className="h-3 w-4 shrink-0" fill="none" strokeLinecap="round" aria-hidden="true">
      {[2, 6, 10].map((y, i) => (
        <line key={y} x1="1" x2="15" y1={y} y2={y} stroke={SAGE} strokeWidth="1.2" opacity={i >= 3 - lit ? 1 : 0.2} />
      ))}
    </svg>
  );
}

export default function TaskRow({ task, assignKey, assignLabel, onToggle, onEdit, onDelete, onAssign, onWeight }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.text);
  const weight = weightOf(task);
  const dateText = task.dueDate ? fmtDayMonth(fromKey(task.dueDate)) : "No date";
  const canMove = Boolean(assignKey) && !task.done && task.dueDate !== assignKey;

  const commit = () => {
    const next = draft.trim();
    if (next && next !== task.text) onEdit(task.id, next);
    else setDraft(task.text);
    setEditing(false);
  };

  const menuItems = [
    { label: "Edit", onSelect: () => setEditing(true) },
    ...(canMove ? [{ label: assignLabel, onSelect: () => onAssign(task.id, assignKey) }] : []),
    { label: "Delete", danger: true, onSelect: () => onDelete(task.id) },
  ];

  return (
    <li className="grid grid-cols-[1.25rem_minmax(0,1fr)_2.75rem_2.75rem] items-center gap-x-3 border-b border-[#9EAF97]/15 sm:grid-cols-[1.25rem_minmax(0,1fr)_5.25rem_3.75rem_2.75rem] sm:gap-x-4">
      <Checkbox
        checked={task.done}
        onChange={() => onToggle(task.id)}
        label={`Mark "${task.text}" as ${task.done ? "open" : "done"}`}
      />

      <div className="min-w-0 py-3.5">
        {editing ? (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") {
                setDraft(task.text);
                setEditing(false);
              }
            }}
            aria-label="Edit task"
            className={`${SANS} w-full bg-transparent text-base text-[#FAF9F6] outline-none`}
          />
        ) : (
          <span onDoubleClick={() => setEditing(true)} className="block">
            {/* The sage line draws through the text when the task is done. */}
            <span
              className={`${SANS} break-words text-base font-light [background-image:linear-gradient(rgba(158,175,151,0.75),rgba(158,175,151,0.75))] [background-position:0_58%] [background-repeat:no-repeat] [box-decoration-break:clone] [transition-duration:500ms] [transition-property:background-size,color] ${
                task.done ? "text-[#FAF9F6]/55 [background-size:100%_1px]" : "text-[#FAF9F6] [background-size:0%_1px]"
              }`}
            >
              {task.text}
            </span>
          </span>
        )}
        {/* Phones have no date column, so the date sits under the title. */}
        <span className={`${SANS} mt-1 block text-[13px] text-[#FAF9F6]/70 sm:hidden`}>{dateText}</span>
      </div>

      <button
        type="button"
        onClick={() => onWeight(task.id, nextWeight(weight))}
        title="Change weight"
        aria-label={`Weight: ${WEIGHT_LABEL[weight]}. Activate to change.`}
        className={`${SANS} flex h-11 w-full items-center justify-center gap-2 text-[13px] text-[#FAF9F6]/70 transition-colors hover:text-[#FAF9F6] sm:justify-start ${FOCUS}`}
      >
        <WeightMark weight={weight} />
        <span className="hidden sm:inline">{WEIGHT_LABEL[weight]}</span>
      </button>

      <span className={`${SANS} hidden text-right text-[13px] text-[#FAF9F6]/70 sm:block`}>{dateText}</span>

      <RowMenu label={`Actions for ${task.text}`} items={menuItems} className="justify-self-end" />
    </li>
  );
}
