import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function About() {
  const aboutSectionRef = useRef(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) return;

      const aboutRevealTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: aboutSectionRef.current,
          start: "top 78%",
          once: true,
        },
      });

      aboutRevealTimeline
        .from(".about-heading", {
          y: 24,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        })
        .from(
          ".about-intro",
          {
            y: 20,
            opacity: 0,
            duration: 0.65,
            ease: "power2.out",
          },
          "-=0.25"
        )
        .from(
          ".about-description, .about-focus-item",
          {
            y: 14,
            opacity: 0,
            duration: 0.5,
            stagger: 0.12,
            ease: "power2.out",
          },
          "-=0.2"
        );
    },
    { scope: aboutSectionRef }
  );

  return (
    <section
      id="about"
      ref={aboutSectionRef}
      className="border-t border-white/10"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-24 md:grid-cols-[0.6fr_1.4fr] md:px-10">
        <div>
          <p className="font-mono text-xs tracking-[0.18em] text-sage">
            01 / ABOUT
          </p>

          <h2 className="about-heading mt-4 font-display text-4xl text-alabaster">
            A little about me.
          </h2>
        </div>

        <div className="max-w-3xl">
          <p className="about-intro font-display text-2xl leading-relaxed text-alabaster md:text-3xl">
            I’m a frontend developer who enjoys turning ideas into
            clear, engaging, and useful web experiences.
          </p>

          <p className="about-description mt-6 max-w-2xl leading-7 text-ash">
            I work with React, JavaScript, and modern frontend tools.
            I’m learning by building projects, exploring interface
            design, and improving how I write and structure code.
            My goal is to keep growing toward full-stack development.
          </p>

          <div className="mt-10 grid gap-6 border-t border-white/10 pt-6 sm:grid-cols-2">
            <div className="about-focus-item">
              <p className="font-mono text-xs text-sage">
                WHAT I CARE ABOUT
              </p>
              <p className="mt-2 text-sm text-alabaster">
                Usability · Visual detail · Responsive design
              </p>
            </div>

            <div className="about-focus-item">
              <p className="font-mono text-xs text-sage">
                CURRENT FOCUS
              </p>
              <p className="mt-2 text-sm text-alabaster">
                React · JavaScript · Growing my skills
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}