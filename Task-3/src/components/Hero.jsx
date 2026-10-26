import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function Hero() {
  const heroSectionRef = useRef(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const heroAnimatedElements = [
        ".hero-intro-label",
        ".hero-heading-line",
        ".hero-description",
        ".hero-buttons",
        ".hero-learning-panel",
      ];

      if (prefersReducedMotion) {
        gsap.set(heroAnimatedElements, {
          opacity: 1,
          y: 0,
          yPercent: 0,
        });

        gsap.set(".hero-intro-line path", {
          strokeDashoffset: 0,
        });

        return;
      }

      const heroEntranceTimeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      heroEntranceTimeline
        .fromTo(
          ".hero-intro-line path",
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 0.45,
            ease: "power2.inOut",
          }
        )
        .from(
          ".hero-intro-label",
          {
            opacity: 0,
            y: 12,
            duration: 0.45,
          },
          0.05
        )
        .from(
          ".hero-heading-line",
          {
            yPercent: 115,
            opacity: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: "expo.out",
          },
          0.08
        )
        .from(
          ".hero-description, .hero-buttons",
          {
            y: 12,
            opacity: 0,
            duration: 0.55,
            stagger: 0.06,
          },
          0.42
        )
        .from(
          ".hero-learning-panel",
          {
            opacity: 0,
            duration: 0.5,
          },
          0.64
        );
    },
    { scope: heroSectionRef }
  );

  return (
    <section
      ref={heroSectionRef}
      id="home"
      className="mx-auto grid min-h-[82vh] max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-[1.3fr_0.7fr] md:px-10"
    >
      <div>
        <svg
          className="hero-intro-line mb-4 h-3 w-16"
          viewBox="0 0 64 4"
          aria-hidden="true"
        >
          <path
            d="M1 2 H63"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            pathLength="1"
            className="text-sage"
            strokeDasharray="1"
            strokeDashoffset="1"
          />
        </svg>

        <p className="hero-intro-label mb-6 font-mono text-xs uppercase tracking-[0.2em] text-sage">
          Frontend Developer · Pakistan
        </p>

        <h1 className="max-w-3xl font-display text-5xl leading-[1.08] tracking-tight text-alabaster sm:text-6xl md:text-7xl">
          <span className="block overflow-hidden">
            <span className="hero-heading-line block">
              I build thoughtful
            </span>
          </span>

          <span className="block overflow-hidden">
            <span className="hero-heading-line block">
              digital <span className="italic text-sage">experiences.</span>
            </span>
          </span>
        </h1>

        <p className="hero-description mt-7 max-w-xl text-base leading-7 text-ash md:text-lg">
          I’m a frontend developer focused on React and JavaScript,
          creating responsive interfaces with care for detail,
          usability, and the little things that make a website feel right.
        </p>

        <div className="hero-buttons mt-9 flex flex-wrap gap-4">
          <a
            href="#projects"
            className="bg-sage px-5 py-3 text-sm font-medium text-obsidian transition-colors duration-200 hover:bg-alabaster"
          >
            Explore my work ↗
          </a>

          <a
            href="#contact"
            className="border border-white/20 px-5 py-3 text-sm text-alabaster transition-colors duration-200 hover:border-sage hover:text-sage"
          >
            Get in touch
          </a>
        </div>
      </div>

      <div className="hero-learning-panel relative hidden min-h-[350px] items-end border border-white/10 bg-graphite p-6 md:flex">
        <div className="absolute right-6 top-6 font-mono text-xs text-ash">
          PORTFOLIO / 2026
        </div>

        <div>
          <p className="font-mono text-xs text-sage">
            CURRENTLY LEARNING
          </p>

          <p className="mt-3 font-display text-3xl text-alabaster">
            React. UI. Better code.
          </p>

          <div className="mt-8 h-px w-full bg-white/10" />

          <p className="mt-4 text-sm leading-6 text-ash">
            Building projects, refining my frontend skills,
            and working toward full-stack development.
          </p>
        </div>
      </div>
    </section>
  );
}