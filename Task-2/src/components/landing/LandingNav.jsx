import { FOCUS, SANS, SERIF } from "../../lib/theme";

/** Fixed top bar: wordmark, Features jump link, Login and Sign Up. */
export default function LandingNav({ onNavigate }) {
  return (
    <header
      className={`${SANS} fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-gradient-to-b from-[#11141A] via-[#11141A]/85 to-transparent px-6 py-5 md:px-16`}
    >
      <a href="#top" className={`${SERIF} text-xl tracking-tight text-[#FAF9F6] ${FOCUS}`}>
        clareo<span className="text-[#9EAF97]">.</span>
      </a>

      <nav className="flex items-center gap-6 text-sm md:gap-10" aria-label="Primary">
        <a
          href="#features"
          className={`relative text-[#FAF9F6]/70 transition-colors hover:text-[#FAF9F6] ${FOCUS} after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#9EAF97] after:transition-transform after:duration-300 hover:after:scale-x-100`}
        >
          Features
        </a>

        <button
          type="button"
          onClick={() => onNavigate("login")}
          className={`relative text-[#FAF9F6]/70 transition-colors hover:text-[#FAF9F6] ${FOCUS} after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#9EAF97] after:transition-transform after:duration-300 hover:after:scale-x-100`}
        >
          Login
        </button>

        {/* Sign Up: a sage fill rises from below on hover */}
        <button
          type="button"
          onClick={() => onNavigate("signup")}
          className={`group relative overflow-hidden border border-[#9EAF97]/60 px-5 py-2 text-[#FAF9F6] transition-colors duration-300 hover:text-[#11141A] ${FOCUS}`}
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 translate-y-full bg-[#9EAF97] transition-transform duration-300 ease-out group-hover:translate-y-0"
          />
          <span className="relative">Sign Up</span>
        </button>
      </nav>
    </header>
  );
}
