import { IVORY, SAGE } from "../../lib/theme";

export const STACK_LAYERS = ["today", "this week", "someday", "waiting"];
export const STACK_CENTER_Y = 300;
export const stackY = (i) => STACK_CENTER_Y + (i - 1.5) * 104;

const truncate = (s) => (s.length > 22 ? `${s.slice(0, 21).trimEnd()}...` : s);


export default function StackIllustration({ className = "", injected = "", anchorRef = null }) {
  return (
    <svg
      viewBox="0 0 640 600"
      className={className}
      fill="none"
      stroke={SAGE}
      strokeWidth="1"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {STACK_LAYERS.map((label, i) => (
        <g key={label} className="st-layer" transform={`translate(0 ${stackY(i)})`}>
          <path className={`st-draw${i === 0 ? " st-top-plate" : ""}`} d="M130 0 L260 -66 L390 0 L260 66 Z" />
          {!(i === 0 && injected) && (
            <path className="st-draw" d="M196 0 L260 -33 L324 0 L260 33 Z" opacity="0.55" />
          )}
          {i === 0 && <rect ref={anchorRef} x="258" y="-2" width="4" height="4" fill="none" stroke="none" />}
          {i === 0 && injected && (
            <text
              className="st-injected"
              x="260"
              y="5"
              textAnchor="middle"
              fill={IVORY}
              stroke="none"
              fontSize="15"
              fontFamily="Inter, system-ui, sans-serif"
            >
              {truncate(injected)}
            </text>
          )}
          <g className="st-label">
            <path d="M390 0 H452" strokeDasharray="2 4" />
            <text x="462" y="4" fill={SAGE} stroke="none" fontSize="14" fontFamily="Inter, system-ui, sans-serif">
              {label}
            </text>
          </g>
        </g>
      ))}
    </svg>
  );
}
