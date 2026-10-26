import { useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const projects = [
  {
    number: "01",
    name: "CLAREO",
    type: "Web project",
    description:
      "A web experience focused on presenting a clear, polished interface.",
    stack: ["React", "JavaScript", "Tailwind CSS"],
    link: "https://clareo-tomakeclear.netlify.app/",
    linkLabel: "Visit live site",
    visualText: "To Make Clear.",
  },
  {
    number: "02",
    name: "HydroTrack",
    type: "React application",
    description:
      "A hydration tracker for logging water intake and keeping track of daily goals.",
    stack: ["React", "JavaScript", "Tailwind CSS"],
    link: "https://hydro-tracker-app.vercel.app/",
    linkLabel: "Visit live app",
    visualText: "Build better daily habits.",
  },
  {
    number: "03",
    name: "Previous Portfolio",
    type: "Personal website",
    description:
      "An earlier portfolio built during my JavaScript learning journey.",
    stack: ["HTML", "CSS", "JavaScript"],
    link: "https://hibakhan05.github.io/Portfolio-v1/",
    linkLabel: "View previous portfolio",
    visualText: "Where my journey began.",
  },
];

function TechStack({ items }) {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {items.map((tech) => (
        <span
          key={tech}
          className="border border-white/10 px-3 py-1 font-mono text-[10px] text-ash"
        >
          {tech}
        </span>
      ))}
    </div>
  );
}

export default function Projects() {
  const projectsSectionRef = useRef(null);

  useGSAP(
    () => {
      const section = projectsSectionRef.current;
      if (!section) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reducedMotion) return;

      const heading = section.querySelector(".projects-section-heading");
      const rows = section.querySelectorAll(".projects-project-row");

      gsap.from(heading, {
        autoAlpha: 0,
        y: 20,
        duration: 0.65,
        ease: "power2.out",
        scrollTrigger: {
          trigger: heading,
          start: "top 85%",
          once: true,
        },
      });

      rows.forEach((row, index) => {
        gsap.from(row, {
          autoAlpha: 0,
          y: 28,
          duration: 0.7,
          delay: index * 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: row,
            start: "top 85%",
            once: true,
          },
        });
      });
    },
    { scope: projectsSectionRef }
  );

  return (
    <section
      id="projects"
      ref={projectsSectionRef}
      className="border-t border-white/10"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10">
        <div className="projects-section-heading mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs tracking-[0.18em] text-sage">
              02 / SELECTED WORK
            </p>

            <h2 className="mt-4 font-display text-4xl text-alabaster md:text-5xl">
              Things I’ve built.
            </h2>
          </div>

          <p className="max-w-xs text-sm leading-6 text-ash">
            A selection of projects I’ve worked on while developing my
            frontend skills.
          </p>
        </div>

        <div>
          {projects.map((project) => (
            <article
              key={project.number}
              className="projects-project-row grid gap-8 border-t border-white/10 py-10 md:grid-cols-[0.8fr_1.2fr] md:items-center md:gap-14 md:py-14"
            >
              {/* Left visual panel */}
              <div className="relative flex min-h-64 flex-col justify-between overflow-hidden border border-white/10 bg-white/[0.03] p-6 md:min-h-80 md:p-8">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.18em] text-sage">
                    PROJECT {project.number}
                  </span>

                  <span className="font-mono text-[10px] text-ash">
                    {project.name}
                  </span>
                </div>

                <div className="py-8">
                  <p className="font-mono text-xs text-ash">
                    {project.type}
                  </p>

                  <h3 className="mt-3 max-w-xs font-display text-4xl leading-[0.98] text-alabaster md:text-5xl">
                    {project.visualText}
                  </h3>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="font-mono text-[10px] text-ash">
                    {project.type.toUpperCase()}
                  </span>

                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Visit ${project.name} live project`}
                    className="text-sage transition-colors hover:text-alabaster"
                  >
                    ↗
                  </a>
                </div>
              </div>

              {/* Right project details */}
              <div className="md:py-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ash">
                  {project.type}
                </p>

                <h3 className="mt-3 font-display text-4xl text-alabaster md:text-5xl">
                  {project.name}
                </h3>

                <p className="mt-5 max-w-xl text-sm leading-7 text-ash">
                  {project.description}
                </p>

                <TechStack items={project.stack} />

                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">           
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="w-fit text-sm text-ash underline underline-offset-4 transition-colors hover:text-alabaster"
                  >
                    {project.linkLabel} ↗
                  </a>
                </div>
              </div>
            </article>
          ))}

          <div className="border-t border-white/10" />
        </div>
      </div>
    </section>
  );
}