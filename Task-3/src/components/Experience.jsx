import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const internships = [
  {
    role: "Front-End Developer Intern",
    company: "DevelopersHub Corporation",
    period: "11 May 2026 – 22 June 2026",
    location: "Virtual",
    description:
      "Built e-commerce websites from Figma designs, implementing responsive layouts with HTML5, CSS3, JavaScript, and Bootstrap, and deploying via the Vercel CI/CD pipeline.",
  },
  {
    role: "Frontend Developer Intern",
    company: "AUSPIFY",
    period: "28 Sep 2026 – Present",
    location: "Virtual",
    description:
      "Working on frontend development tasks using React, Tailwind CSS, JS logic, and gaining practical experience through project-based website work.",
  },
];

export default function Experience() {
  const experienceSectionRef = useRef(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) return;

      const experienceHeading = experienceSectionRef.current.querySelector(
        ".experience-section-heading"
      );

      const internshipEntries = gsap.utils.toArray(
        ".experience-internship-entry",
        experienceSectionRef.current
      );

      const experienceRevealTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: experienceSectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      experienceRevealTimeline
        .from(experienceHeading, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        })
        .from(
          internshipEntries,
          {
            y: 18,
            opacity: 0,
            duration: 0.55,
            stagger: 0.16,
            ease: "power2.out",
          },
          "-=0.2"
        );
    },
    { scope: experienceSectionRef }
  );

  return (
    <section
      id="experience"
      ref={experienceSectionRef}
      className="border-t border-white/10"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10">
        <p className="font-mono text-xs tracking-[0.18em] text-sage">
          04 / EXPERIENCE
        </p>

        <h2 className="experience-section-heading mt-4 font-display text-4xl text-alabaster md:text-5xl">
          Learning through real work.
        </h2>

        <div className="mt-12">
          {internships.map((item) => (
            <article
              key={item.company}
              className="experience-internship-entry grid gap-5 border-t border-white/10 py-8 md:grid-cols-[0.8fr_1.2fr]"
            >
              <div>
                <p className="font-mono text-xs text-sage">
                  {item.period}
                </p>

                <h3 className="mt-3 font-display text-2xl text-alabaster">
                  {item.role}
                </h3>

                <p className="mt-2 text-sm text-ash">
                  {item.company}
                </p>

                <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-ash">
                  {item.location}
                </p>
              </div>

              <p className="max-w-2xl text-sm leading-7 text-ash">
                {item.description}
              </p>
            </article>
          ))}

          <div className="border-t border-white/10" />
        </div>
      </div>
    </section>
  );
}