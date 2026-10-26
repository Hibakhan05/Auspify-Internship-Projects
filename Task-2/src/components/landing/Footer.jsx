import { useState } from "react";
import { FOCUS, SANS, SERIF } from "../../lib/theme";

const LEGAL = ["Privacy policy", "Terms", "Cookies"];
const SOCIAL = ["Instagram", "X", "LinkedIn", "GitHub"];

const linkClass = `text-[#FAF9F6]/60 transition-colors hover:text-[#FAF9F6] ${FOCUS}`;

/** Removes every key this app has written to localStorage. */
function eraseLocalData() {
  try {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith("clareo."))
      .forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* storage unavailable */
  }
}

/** Asymmetric footer: brand statement left, link columns pushed right. */
export default function Footer() {
  const [confirming, setConfirming] = useState(false);

  const erase = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    eraseLocalData();
    window.location.reload();
  };

  return (
    <footer className={`${SANS} border-t border-[#9EAF97]/25 px-6 pb-10 pt-20 md:px-16`}>
      <div className="grid gap-16 md:grid-cols-12 md:gap-0">
        <div className="md:col-span-5">
          <p className={`${SERIF} text-5xl tracking-tight text-[#FAF9F6] md:text-6xl`}>
            clareo<span className="text-[#9EAF97]">.</span>
          </p>
          <p className="mt-6 max-w-xs text-sm font-light leading-relaxed text-[#FAF9F6]/60">
            Built on one belief: a clear mind does better work.
          </p>
        </div>

        <div className="md:col-span-2 md:col-start-6">
          <p className="mb-5 text-xs text-[#9EAF97]">Legal</p>
          <ul className="space-y-3 text-sm">
            {LEGAL.map((item) => (
              <li key={item}>
                <a href="#top" className={linkClass}>{item}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2 md:col-start-8">
          <p className="mb-5 text-xs text-[#9EAF97]">Workspace privacy</p>
          <p className="max-w-[12rem] text-sm font-light leading-relaxed text-[#FAF9F6]/60">
            Your tasks stay on this device. Nothing is sent anywhere.
          </p>
          <button
            type="button"
            onClick={erase}
            onBlur={() => setConfirming(false)}
            className={`mt-4 text-sm text-[#FAF9F6]/60 underline decoration-[#9EAF97]/50 underline-offset-4 transition-colors hover:text-[#FAF9F6] ${FOCUS}`}
          >
            {confirming ? "Click again to erase" : "Erase local data"}
          </button>
        </div>

        <div className="md:col-span-2 md:col-start-10">
          <p className="mb-5 text-xs text-[#9EAF97]">Elsewhere</p>
          <ul className="space-y-3 text-sm">
            {SOCIAL.map((item) => (
              <li key={item}>
                <a href="#top" className={linkClass}>{item}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-24 flex flex-col gap-3 text-xs text-[#FAF9F6]/40 md:flex-row md:justify-between">
        <p>&copy; {new Date().getFullYear()} Clareo Studio. All rights reserved.</p>
        <p>Designed to remove, not to add.</p>
      </div>
    </footer>
  );
}
