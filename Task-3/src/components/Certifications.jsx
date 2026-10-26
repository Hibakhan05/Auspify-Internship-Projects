import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const certificates = [
  {
    name: "HTML Essentials",
    issuer: "Cisco Networking Academy",
    link: "https://drive.google.com/file/d/1kcKALBQYEqQxqIY940rkv70xsUY23-O7/view?usp=sharing",
  },
  {
    name: "CSS Essentials",
    issuer: "Cisco Networking Academy",
    link: "https://drive.google.com/file/d/1Kt3VEv_OAikzl79Gmecp7H4JupfgWXvZ/view?usp=sharing",
  },
  {
    name: "Google Ads Certificate · Beginner Level",
    issuer: "Coursera",
    link: "https://drive.google.com/file/d/1jIM6IX1quRwn2qmTC2a_58-mO0gmUuHs/view?usp=sharing",
  },
  {
    name: "Internship 01 Completion Certificate",
    issuer: "DevelopersHub Corporation",
    link: "https://drive.google.com/file/d/1Akf4_YmySPHX0KiruO8AYdjmGbedn3d4/view?usp=sharing",
  },
  {
    name: "Canva Certificate",
    issuer: "Growbiz Network",
    link: "https://drive.google.com/file/d/11cqfCyi58NDzLYyZabzrbaId9baV5lnu/view?usp=sharing",
  },
];

export default function Certifications() {
  const certificationsSectionRef = useRef(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) return;

      const certificationsHeading =
        certificationsSectionRef.current.querySelector(
          ".certifications-heading"
        );

      const certificateRows = gsap.utils.toArray(
        ".certifications-certificate-row",
        certificationsSectionRef.current
      );

      const certificationsRevealTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: certificationsSectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      certificationsRevealTimeline
        .from(certificationsHeading, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        })
        .from(
          certificateRows,
          {
            y: 14,
            opacity: 0,
            duration: 0.45,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.2"
        );
    },
    { scope: certificationsSectionRef }
  );

  return (
    <section
      id="certifications"
      ref={certificationsSectionRef}
      className="border-t border-white/10"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10">
        <p className="font-mono text-xs tracking-[0.18em] text-sage">
          05 / CERTIFICATIONS
        </p>

        <h2 className="certifications-heading mt-4 font-display text-4xl text-alabaster md:text-5xl">
          Learning, documented.
        </h2>

        <div className="mt-10">
          {certificates.map((certificate) => (
            <article
              key={certificate.name}
              className="certifications-certificate-row grid gap-3 border-t border-white/10 py-5 sm:grid-cols-[1fr_0.8fr_auto] sm:items-center"
            >
              <p className="w-fit text-sm text-alabaster transition-colors">
                {certificate.name}
              </p>

              <p className="text-sm text-ash">{certificate.issuer}</p>

              <a
                href={certificate.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit text-sm text-alabaster underline underline-offset-4 transition-colors duration-200 hover:text-sage"
              >
                View Certificate ↗
              </a>
            </article>
          ))}

          <div className="border-t border-white/10" />
        </div>
      </div>
    </section>
  );
}