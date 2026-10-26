import { useEffect, useRef, useState } from "react";
import { FOCUS, SANS } from "../../lib/theme";


//  * Compact "..." menu used for row actions on small screens.
//  * The trigger and every item are at least 44px tall, so they are easy to tap.
//  * Keyboard: Enter or Space opens it, arrows move, Escape closes and returns
//  * focus to the trigger. Tapping outside closes it.

export default function RowMenu({ label, items, className = "" }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef(null);
  const trigger = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (e) => {
      if (!wrap.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
        return;
      }
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      e.preventDefault();
      const els = [...wrap.current.querySelectorAll('[role="menuitem"]')];
      const i = els.indexOf(document.activeElement);
      const next = e.key === "ArrowDown" ? (i + 1) % els.length : (i - 1 + els.length) % els.length;
      els[next]?.focus();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    wrap.current?.querySelector('[role="menuitem"]')?.focus();
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (item) => {
    setOpen(false);
    trigger.current?.focus();
    item.onSelect();
  };

  return (
    <div ref={wrap} className={`relative ${className}`}>
      <button
        ref={trigger}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
        title="More actions"
        className={`flex h-11 w-11 items-center justify-center text-[#9EAF97] transition-colors hover:bg-[#9EAF97]/10 hover:text-[#FAF9F6] ${FOCUS}`}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
          <circle cx="5" cy="12" r="1.8" />
          <circle cx="12" cy="12" r="1.8" />
          <circle cx="19" cy="12" r="1.8" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          aria-label={label}
          className="absolute right-0 top-full z-30 mt-1 min-w-44 border border-[#9EAF97]/30 bg-[#11141A] py-1"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              onClick={() => choose(item)}
              className={`${SANS} flex h-11 w-full items-center px-4 text-left text-sm transition-colors hover:bg-[#9EAF97]/10 hover:text-[#FAF9F6] focus-visible:bg-[#9EAF97]/10 focus-visible:outline-none ${
                item.danger ? "text-[#FAF9F6]/75" : "text-[#9EAF97]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
