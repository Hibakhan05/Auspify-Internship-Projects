/** Thin line icons that match the drawn illustrations. */
const PATHS = {
  workspace: (
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h9" />
    </>
  ),
  focus: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="15" />
      <path d="M4 10h16" />
      <path d="M9 3v4M15 3v4" />
    </>
  ),
  logs: (
    <>
      <path d="M7 4v16" />
      <circle cx="7" cy="8" r="1.6" />
      <circle cx="7" cy="14" r="1.6" />
      <path d="M12 8h8M12 14h6" />
    </>
  ),
  logout: (
    <>
      <path d="M10 4H5v16h5" />
      <path d="M14 8l4 4-4 4" />
      <path d="M8 12h10" />
    </>
  ),
  chevron: <path d="M14 6l-6 6 6 6" />,
};

export default function Icon({ name, className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
