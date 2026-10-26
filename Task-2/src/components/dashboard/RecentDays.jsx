import { IVORY, SAGE, SANS } from "../../lib/theme";

/** The last 14 days as hairline ticks, labelled at both ends. A block of the rail. */
export default function RecentDays({ stats }) {
  const { activeDays, last14 } = stats;

  return (
    <section aria-label="Last 14 days" className="border-t border-[#9EAF97]/25 pt-6">
      <p className={`${SANS} text-sm text-[#9EAF97]`}>Last 14 days</p>

      {/* Height is capped so one busy day cannot stretch into a tall white bar. */}
      <svg
        viewBox="0 0 140 44"
        preserveAspectRatio="xMinYMax meet"
        className="mt-4 h-14 w-full"
        fill="none"
        strokeLinecap="round"
        aria-hidden="true"
      >
        {last14.map((day, i) => {
          const x = 5 + i * 10;
          const h = day.count === 0 ? 3 : Math.min(day.count, 4) * 8 + 4;
          const isToday = i === last14.length - 1;
          return (
            <line
              key={day.key}
              x1={x}
              x2={x}
              y1={40}
              y2={40 - h}
              stroke={isToday ? IVORY : SAGE}
              strokeWidth="1.5"
              opacity={day.count === 0 ? 0.35 : 1}
            />
          );
        })}
      </svg>

      <div className={`${SANS} mt-2 flex justify-between text-[13px] text-[#FAF9F6]/70`} aria-hidden="true">
        <span>14 days ago</span>
        <span>Now</span>
      </div>
      <p className={`${SANS} mt-3 text-[13px] text-[#FAF9F6]/70`}>Active on {activeDays} of the last 14 days.</p>
    </section>
  );
}
