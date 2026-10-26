import { useState } from "react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Certificates", href: "#certifications" },
  { label: "Contact", href: "#contact" },
];

const linkedin = "https://www.linkedin.com/in/hibamateen05/";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-obsidian">
      <nav className="mx-auto max-w-7xl px-6 py-4 md:px-10">
        {/* Mobile navbar */}
        <div className="relative flex items-center justify-between lg:hidden">
          <a
            href="#home"
            onClick={closeMenu}
            className="font-display text-xl tracking-tight text-alabaster"
            aria-label="Back to home"
          >
            H<span className="text-sage">.</span>
          </a>

          <a
            href="#home"
            onClick={closeMenu}
            className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-lg text-alabaster"
          >
            Hiba Mateen
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((previousMenuState) => !previousMenuState)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 border border-white/15 transition-colors duration-200 hover:border-sage/60"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            <span
              className={`h-px w-5 bg-alabaster transition-transform duration-200 ${
                menuOpen ? "translate-y-[4px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-5 bg-alabaster transition-opacity duration-200 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-px w-5 bg-alabaster transition-transform duration-200 ${
                menuOpen ? "-translate-y-[4px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>

        {/* Desktop navbar */}
        <div className="hidden items-center justify-between lg:flex">
          <a
            href="#home"
            className="font-display text-xl tracking-tight text-alabaster"
            aria-label="Back to home"
          >
            H<span className="text-sage">.</span>
          </a>

          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="navbar-desktop-link relative py-1 text-xs text-ash transition-colors duration-200 hover:text-alabaster"
              >
                {link.label}
              </a>
            ))}
          </div>

          <a
            href={linkedin}
            target="_blank"
            rel="noreferrer"
            className="border border-sage/50 px-4 py-2 font-mono text-xs text-sage transition-colors duration-200 hover:bg-sage hover:text-obsidian"
          >
            LET’S TALK ↗
          </a>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          id="mobile-navigation"
          className="absolute left-0 top-full w-full border-b border-white/10 bg-obsidian px-6 py-4 shadow-xl lg:hidden"
        >
          <div className="flex flex-col">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                className="border-b border-white/10 py-4 text-sm text-ash transition-colors duration-200 hover:pl-2 hover:text-sage"
              >
                {link.label}
              </a>
            ))}

            <a
              href={linkedin}
              target="_blank"
              rel="noreferrer"
              className="mt-5 w-fit border border-sage/50 px-4 py-3 font-mono text-xs text-sage transition-colors duration-200 hover:bg-sage hover:text-obsidian"
            >
              LET’S TALK ↗
            </a>
          </div>
        </div>
      )}
    </header>
  );
}