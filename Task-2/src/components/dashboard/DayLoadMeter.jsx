import { SANS } from "../../lib/theme";


//  * Day capacity on a single line: a handful of hairline bars plus plain words.
//  *   sage      = planned
//  *   faint     = what the task being typed would add
//  *   ivory     = points beyond capacity
//  * Overdue points are named in the same sentence, so no second line is needed.

export default function DayLoadMeter({ load, adding = 0, className = "" }) {
  const total = Math.max(load.capacity, load.points + adding);
  const summary = `${load.points} of ${load.capacity} points`;

  return (
    <div className={`${SANS} flex items-center gap-3 text-[13px] ${className}`}>
      <span className="flex items-end gap-[3px]" role="img" aria-label={`${summary} planned`}>
        {Array.from({ length: total }, (_, i) => {
          const filled = i < load.points;
          const preview = !filled && i < load.points + adding;
          const beyond = i >= load.capacity;
          let tone = "bg-[#9EAF97]/25";
          if (filled) tone = beyond ? "bg-[#FAF9F6]" : "bg-[#9EAF97]";
          else if (preview) tone = beyond ? "bg-[#FAF9F6]/55" : "bg-[#9EAF97]/55";
          return <span key={i} className={`h-3.5 w-0.5 transition-colors duration-300 ${tone}`} />;
        })}
      </span>
      <span className={`tabular-nums ${load.isOver ? "font-medium text-[#FAF9F6]" : "text-[#FAF9F6]/75"}`}>
        {summary}
        {load.overduePoints > 0 && ` (${load.overduePoints} overdue)`}
      </span>
    </div>
  );
}
