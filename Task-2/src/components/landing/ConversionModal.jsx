import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { prefersReducedMotion, primeStrokes } from "../../lib/animation";
import { FOCUS, SAGE, SANS, SERIF } from "../../lib/theme";

/** Full screen overlay shown when a visitor tries to save a task on the landing page. */
export default function ConversionModal({ onClose, onSignup }) {
  const root = useRef(null);
  const cta = useRef(null);
  const closing = useRef(null);

  // Entrance: veil fades, the panel rises, corner lines draw themselves.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      const corners = primeStrokes(gsap.utils.toArray(".mdl-corner"));
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".mdl-veil", { opacity: 0, duration: 0.4 })
        .from(".mdl-panel", { y: 48, opacity: 0, duration: 0.7 }, 0.1)
        .to(corners, { strokeDashoffset: 0, duration: 0.9, stagger: 0.1 }, 0.3)
        .from(".mdl-text", { y: 14, opacity: 0, stagger: 0.1, duration: 0.6 }, 0.5);
    }, root);

    return () => ctx.revert();
  }, []);

  // Fade out, then tell the parent to unmount.
  const close = () => {
    if (prefersReducedMotion()) {
      onClose();
      return;
    }
    closing.current = gsap.to(root.current, { opacity: 0, duration: 0.25, onComplete: onClose });
  };

  useEffect(() => {
    cta.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      closing.current?.kill();
    };
    // close only closes over refs and onClose
  }, []);

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex items-center justify-center px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mdl-title"
    >
      <div className="mdl-veil absolute inset-0 bg-[#11141A]/92 backdrop-blur-sm" onClick={close} />

      <div className="mdl-panel relative w-full max-w-2xl bg-[#11141A] px-8 py-14 md:px-16 md:py-20">
        {/* Raw corner marks instead of a full border */}
        <svg className="pointer-events-none absolute left-0 top-0 h-16 w-16 overflow-visible" fill="none" stroke={SAGE} strokeWidth="1" aria-hidden="true">
          <path className="mdl-corner" d="M0 56 V0 H56" />
        </svg>
        <span aria-hidden="true" className="absolute bottom-0 right-0 h-14 w-14 border-b border-r border-[#9EAF97]" />

        <h2
          id="mdl-title"
          className={`${SERIF} mdl-text text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.12] tracking-tight text-[#FAF9F6]`}
        >
          To sustain this clarity, establish your permanent workspace.
        </h2>
        <p className={`${SANS} mdl-text mt-6 max-w-sm text-sm font-light leading-relaxed text-[#FAF9F6]/60`}>
          Free, private, and saved on this device.
        </p>

        <div className={`${SANS} mdl-text mt-12 flex flex-wrap items-center gap-8`}>
          <button
            ref={cta}
            type="button"
            onClick={onSignup}
            className={`group relative overflow-hidden border border-[#9EAF97] px-8 py-3 text-sm text-[#FAF9F6] transition-colors duration-300 hover:text-[#11141A] ${FOCUS}`}
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 translate-y-full bg-[#9EAF97] transition-transform duration-300 ease-out group-hover:translate-y-0"
            />
            <span className="relative">Create your workspace</span>
          </button>
          <button
            type="button"
            onClick={close}
            className={`text-sm text-[#FAF9F6]/50 transition-colors hover:text-[#FAF9F6] ${FOCUS}`}
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
