import { useMemo } from "react";
import { SANS, SERIF } from "../../../lib/theme";
import ClarityIndex from "../ClarityIndex";
import RecentDays from "../RecentDays";
import LogHistory from "../LogHistory";

// Everything finished, newest first, beside the clarity index. //
export default function LogsView({ tasks, stats, onReopen }) {
  const completed = useMemo(() => tasks.filter((t) => t.done && t.completedAt), [tasks]);

  return (
    <>
      <header className="view-in pb-4 pt-14 md:pt-20">
        <h1 className={`${SERIF} text-[clamp(2.25rem,5vw,4.5rem)] leading-[1] tracking-tight`}>Logs</h1>
        <p className={`${SANS} mt-4 text-base font-light text-[#FAF9F6]/55`}>
          Everything you have finished, newest first.
        </p>
      </header>

      <div className="mt-16 grid grid-cols-1 gap-16 xl:grid-cols-[18rem_minmax(0,1fr)] xl:gap-x-16 xl:gap-y-0">
        <aside className="view-in min-w-0 space-y-8">
          <ClarityIndex stats={stats} />
          <RecentDays stats={stats} />
        </aside>
        <div className="view-in min-w-0">
          <LogHistory completed={completed} onReopen={onReopen} />
        </div>
      </div>
    </>
  );
}
