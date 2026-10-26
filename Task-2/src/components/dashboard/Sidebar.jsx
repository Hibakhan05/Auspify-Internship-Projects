import { SANS, SERIF } from "../../lib/theme";
import Icon from "./Icons";

// Outlines sit inside the item because the sidebar clips its overflow.
const SIDE_FOCUS =
  "focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-4 focus-visible:outline-[#9EAF97]";


//  * Collapsible navigation. Expanded it shows labels; collapsed it becomes a
//  * narrow icon strip so the workspace gets the screen.

export default function Sidebar({ collapsed, onToggle, view, onView, onFocus, focusOpen, email, onLogout }) {
  const item = ({ id, label, icon, onClick, active, hint }) => (
    <button
      key={id}
      type="button"
      onClick={onClick}
      title={collapsed ? label : undefined}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={`${SANS} relative flex h-12 w-full items-center px-[22px] text-sm transition-colors ${SIDE_FOCUS} ${
        active ? "text-[#FAF9F6]" : "text-[#FAF9F6]/70 hover:text-[#FAF9F6]"
      }`}
    >
      {active && <span aria-hidden="true" className="absolute bottom-2 left-0 top-2 w-px bg-[#9EAF97]" />}

      {/* The icon never shrinks (see Icon), so the 64px strip always shows it. */}
      <Icon name={icon} />

      {/* Collapsed: zero width, clipped, no margin. Expanded: takes the rest of the row. */}
      <span
        className={`overflow-hidden whitespace-nowrap text-left transition-[opacity,margin] duration-200 ${
          collapsed ? "ml-0 w-0 opacity-0" : "ml-4 flex-1 opacity-100"
        }`}
      >
        {label}
      </span>

      {hint && (
        <span
          aria-hidden="true"
          className={`overflow-hidden text-xs text-[#FAF9F6]/70 transition-opacity duration-200 ${
            collapsed ? "w-0 opacity-0" : "opacity-100"
          }`}
        >
          {hint}
        </span>
      )}
    </button>
  );

  return (
    <aside
      className={`sticky top-0 flex h-screen shrink-0 flex-col justify-between overflow-hidden border-r border-[#9EAF97]/25 bg-[#11141A] transition-[width] duration-300 ease-out ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      <div>
        <div className="flex h-16 items-center justify-between px-[22px]">
          <span className={`${SERIF} whitespace-nowrap text-xl tracking-tight`}>
            {collapsed ? "c" : "clareo"}
            <span className="text-[#9EAF97]">.</span>
          </span>
        </div>

        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`flex h-12 w-full items-center px-[22px] text-[#9EAF97] transition-colors hover:text-[#FAF9F6] ${SIDE_FOCUS}`}
        >
          <Icon name="chevron" className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
        </button>

        <nav aria-label="Workspace" className="mt-6 border-t border-[#9EAF97]/15 pt-3">
          {item({ id: "workspace", label: "Workspace", icon: "workspace", onClick: () => onView("workspace"), active: view === "workspace" })}
          {item({ id: "focus", label: "One Thing Mode", icon: "focus", onClick: onFocus, active: focusOpen, hint: "F" })}
          {item({ id: "calendar", label: "Calendar", icon: "calendar", onClick: () => onView("calendar"), active: view === "calendar" })}
          {item({ id: "logs", label: "Logs", icon: "logs", onClick: () => onView("logs"), active: view === "logs" })}
        </nav>
      </div>

      <div className="border-t border-[#9EAF97]/15 pb-3 pt-3">
        <p
          className={`${SANS} truncate px-[22px] text-xs text-[#FAF9F6]/70 transition-opacity duration-200 ${
            collapsed ? "pointer-events-none h-0 overflow-hidden pb-0 opacity-0" : "pb-2 opacity-100"
          }`}
        >
          {email}
        </p>
        {item({ id: "logout", label: "Logout", icon: "logout", onClick: onLogout, active: false })}
      </div>
    </aside>
  );
}
