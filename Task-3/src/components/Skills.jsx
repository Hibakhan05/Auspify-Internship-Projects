import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const skillGroups = [
  {
    title: "Frontend",
    skills: [
      "HTML5",
      "CSS3",
      "JavaScript ES6+",
      "React",
      "Bootstrap",
      "Tailwind CSS",
    ],
  },
  {
    title: "Design & Interaction",
    skills: ["Figma", "GSAP", "Responsive UI"],
  },
  {
    title: "Tools & Deployment",
    skills: ["Git", "GitHub", "Vercel", "Netlify"],
  },
];

export default function Skills() {
  const skillsSectionRef = useRef(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) return;

      const skillsRevealTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: skillsSectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      skillsRevealTimeline.from(".skills-group", {
        y: 18,
        opacity: 0,
        duration: 0.55,
        stagger: 0.16,
        ease: "power2.out",
      });

      skillsRevealTimeline.from(
        ".skills-tag",
        {
          y: 10,
          opacity: 0,
          duration: 0.35,
          stagger: 0.045,
          ease: "power2.out",
        },
        "-=0.25"
      );
    },
    { scope: skillsSectionRef }
  );

  return (
    <section
      id="skills"
      ref={skillsSectionRef}
      className="border-t border-white/10"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10">
        <div className="mb-12">
          <p className="font-mono text-xs tracking-[0.18em] text-sage">
            02 / SKILLS
          </p>

          <h2 className="mt-4 font-display text-4xl text-alabaster">
            Tools I work with.
          </h2>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          {skillGroups.map((skillGroup) => (
            <div className="skills-group" key={skillGroup.title}>
              <h3 className="mb-4 font-mono text-xs tracking-[0.12em] text-sage">
                {skillGroup.title.toUpperCase()}
              </h3>

              <div className="flex flex-wrap gap-2">
                {skillGroup.skills.map((skill) => (
                  <span
                    className="skills-tag border border-white/10 px-3 py-2 text-sm text-alabaster transition-colors duration-200 hover:border-sage/60 hover:text-sage"
                    key={skill}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}