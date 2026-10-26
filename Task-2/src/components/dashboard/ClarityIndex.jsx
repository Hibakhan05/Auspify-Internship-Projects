import { SANS, SERIF } from "../../lib/theme";

/** Clarity index with streak and best. One block of the right-hand rail. */
export default function ClarityIndex({ stats }) {
  const { index, streak, best } = stats;

  return (
    <section aria-label="Clarity index" className="border-t border-[#9EAF97]/25 pt-6">
      <p className={`${SANS} text-sm text-[#9EAF97]`}>Clarity index</p>
      <p className={`${SERIF} mt-2 text-6xl leading-none tracking-tight`}>{index}</p>
      <p className={`${SANS} mt-3 max-w-[16rem] text-[13px] leading-relaxed text-[#FAF9F6]/70`}>
        How steadily you show up, and how much of what you start you finish.
      </p>

      <dl className={`${SANS} mt-6 flex gap-10`}>
        <div>
          <dt className="text-[13px] text-[#FAF9F6]/70">Streak</dt>
          <dd className="mt-1 text-lg font-light">
            {streak} {streak === 1 ? "day" : "days"}
          </dd>
        </div>
        <div>
          <dt className="text-[13px] text-[#FAF9F6]/70">Best</dt>
          <dd className="mt-1 text-lg font-light">
            {best} {best === 1 ? "day" : "days"}
          </dd>
        </div>
      </dl>
    </section>
  );
}
