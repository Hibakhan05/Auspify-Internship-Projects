import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "../../lib/gsap";
import { prefersReducedMotion, primeStrokes } from "../../lib/animation";
import { buildGridWave } from "../../lib/gridWave";
import { useAuth } from "../../hooks/useAuth";
import { FOCUS, SAGE, SANS, SERIF } from "../../lib/theme";

const COPY = {
  login: {
    title: "Welcome back.",
    sub: "Pick up where you left off.",
    submit: "Log in",
    switchText: "New here?",
    switchAction: "Create a workspace",
    switchTo: "signup",
  },
  signup: {
    title: "Create your workspace.",
    sub: "Free, private, and saved on this device.",
    submit: "Create account",
    switchText: "Already have a workspace?",
    switchAction: "Log in",
    switchTo: "login",
  },
};

/** Login and Sign Up share one layout: a quiet drawing left, the form right. */
export default function AuthView({ mode, onSwitch, onBack }) {
  const { signUp, logIn } = useAuth();
  const copy = COPY[mode];
  const root = useRef(null);
  const grid = useMemo(() => buildGridWave({ width: 600, height: 420, rows: 9, colEvery: 75 }), []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      const strokes = primeStrokes(gsap.utils.toArray(".auth-draw"));
      gsap
        .timeline({ defaults: { ease: "power2.out" } })
        .to(strokes, { strokeDashoffset: 0, duration: 2.2, stagger: 0.08 })
        .from(".auth-in", { y: 18, opacity: 0, duration: 0.7, stagger: 0.08 }, 0.1);
    }, root);
    return () => ctx.revert();
  }, [mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const action = mode === "signup" ? signUp : logIn;
    const result = await action({ email, password });
    // On success the provider swaps the whole app to the dashboard.
    if (!result.ok) {
      setError(result);
      setBusy(false);
    }
  };

  const fieldError = (field) => (error && error.field === field ? error.message : null);
  const inputClass = `${SANS} w-full border-b bg-transparent pb-3 pt-2 text-lg font-light text-[#FAF9F6] outline-none transition-colors placeholder:text-[#FAF9F6]/25 focus:border-[#FAF9F6]`;

  return (
    <div
      ref={root}
      className="min-h-screen bg-[#11141A] text-[#FAF9F6] antialiased selection:bg-[#9EAF97] selection:text-[#11141A] md:grid md:grid-cols-12"
    >
      {/* Left: brand and drawing */}
      <aside className="flex flex-col justify-between border-b border-[#9EAF97]/25 px-6 py-8 md:col-span-5 md:min-h-screen md:border-b-0 md:border-r md:px-12 md:py-10">
        <button
          type="button"
          onClick={onBack}
          className={`${SANS} absolute top-6 right-6 z-50 flex items-center gap-2 text-xs uppercase tracking-widest text-[#FAF9F6]/40 hover:text-[#9EAF97] transition-colors duration-300 group ${FOCUS} md:top-10 md:right-12`}
          aria-label="Return to landing page"
        >
          <span className="inline-block transform transition-transform duration-300 ease-out group-hover:-translate-x-1">
            ←
          </span>
          <span>Back</span>
        </button>

        {/* Secondary logo indicator (Sirf desktop par dikhega) */}
        <div className={`${SERIF} w-fit text-xl tracking-tight hidden md:block opacity-60`}>
          clareo<span className="text-[#9EAF97]">.</span>
        </div>

        <svg
          viewBox="0 0 600 420"
          className="my-10 hidden w-full md:block"
          fill="none"
          stroke={SAGE}
          strokeWidth="1"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {grid.cols.map((d, i) => (
            <path key={`c${i}`} className="auth-draw" d={d} opacity="0.35" />
          ))}
          {grid.rows.map((d, i) => (
            <path key={`r${i}`} className="auth-draw" d={d} />
          ))}
        </svg>

        <p className={`${SERIF} auth-in max-w-xs text-2xl leading-snug text-[#FAF9F6]/80 md:text-3xl`}>
          Less noise. One clear next step.
        </p>
      </aside>

      {/* Right: form, deliberately offset from the centre */}
      <main className="flex px-6 py-16 md:col-span-7 md:items-center md:px-0 md:py-0">
        <div className="w-full max-w-md md:ml-[12%]">
          <h1 className={`${SERIF} auth-in text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[1.02] tracking-tight`}>
            {copy.title}
          </h1>
          <p className={`${SANS} auth-in mt-4 text-base font-light text-[#FAF9F6]/60`}>{copy.sub}</p>

          <form onSubmit={handleSubmit} noValidate className="mt-14 space-y-10">
            <div className="auth-in">
              <label htmlFor="auth-email" className={`${SANS} text-sm text-[#9EAF97]`}>
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(fieldError("email"))}
                aria-describedby={fieldError("email") ? "auth-email-error" : undefined}
                className={`${inputClass} ${fieldError("email") ? "border-[#FAF9F6]" : "border-[#9EAF97]/50"}`}
              />
              {fieldError("email") && (
                <p id="auth-email-error" role="alert" className={`${SANS} mt-2 text-sm text-[#FAF9F6]/80`}>
                  {fieldError("email")}
                </p>
              )}
            </div>

            <div className="auth-in">
              <label htmlFor="auth-password" className={`${SANS} text-sm text-[#9EAF97]`}>
                Password
              </label>
              <div className="relative">
                <input
                  id="auth-password"
                  type={show ? "text" : "password"}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={Boolean(fieldError("password"))}
                  aria-describedby={fieldError("password") ? "auth-password-error" : undefined}
                  className={`${inputClass} pr-14 ${fieldError("password") ? "border-[#FAF9F6]" : "border-[#9EAF97]/50"}`}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className={`${SANS} absolute bottom-3 right-0 text-xs text-[#9EAF97] transition-colors hover:text-[#FAF9F6] ${FOCUS}`}
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>
              {fieldError("password") && (
                <p id="auth-password-error" role="alert" className={`${SANS} mt-2 text-sm text-[#FAF9F6]/80`}>
                  {fieldError("password")}
                </p>
              )}
              {mode === "signup" && !fieldError("password") && (
                <p className={`${SANS} mt-2 text-xs text-[#FAF9F6]/40`}>At least 8 characters.</p>
              )}
            </div>

            {fieldError("form") && (
              <p role="alert" className={`${SANS} text-sm text-[#FAF9F6]/80`}>
                {fieldError("form")}
              </p>
            )}

            <div className="auth-in">
              <button
                type="submit"
                disabled={busy}
                className={`${SANS} group relative w-full overflow-hidden border border-[#9EAF97] py-4 text-sm text-[#FAF9F6] transition-colors duration-300 hover:text-[#11141A] disabled:opacity-50 ${FOCUS}`}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 translate-y-full bg-[#9EAF97] transition-transform duration-300 ease-out group-hover:translate-y-0"
                />
                <span className="relative">{busy ? "One moment" : copy.submit}</span>
              </button>
            </div>
          </form>

          <p className={`${SANS} auth-in mt-10 text-sm text-[#FAF9F6]/50`}>
            {copy.switchText}{" "}
            <button
              type="button"
              onClick={() => onSwitch(copy.switchTo)}
              className={`text-[#FAF9F6] underline decoration-[#9EAF97] underline-offset-4 ${FOCUS}`}
            >
              {copy.switchAction}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
