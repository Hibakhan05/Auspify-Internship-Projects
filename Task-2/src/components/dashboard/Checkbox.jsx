import { CANVAS, FOCUS } from "../../lib/theme";

/** Thin custom checkbox: sage fill and a self drawing tick when checked. */
export default function Checkbox({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative flex h-5 w-5 shrink-0 items-center justify-center border transition-all duration-300 after:absolute after:-inset-3 ${FOCUS} ${
        checked ? "border-[#9EAF97] bg-[#9EAF97]" : "border-[#9EAF97]/50 hover:border-[#9EAF97]"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-3 w-3"
        fill="none"
        stroke={CANVAS}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M4 12.5 L10 18 L20 6"
          style={{
            strokeDasharray: 24,
            strokeDashoffset: checked ? 0 : 24,
            transition: "stroke-dashoffset 350ms ease",
          }}
        />
      </svg>
    </button>
  );
}
