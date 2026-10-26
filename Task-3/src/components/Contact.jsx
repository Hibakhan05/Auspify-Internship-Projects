import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const links = {
  linkedin: "https://www.linkedin.com/in/hibamateen05/",
  github: "https://github.com/Hibakhan05",
  previousPortfolio: "https://hibakhan05.github.io/Portfolio-v1/",
};

export default function Contact() {
  const contactFooterRef = useRef(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) return;

      const contactHeading = contactFooterRef.current.querySelector(
        ".contact-heading"
      );

      const contactPrimaryLink = contactFooterRef.current.querySelector(
        ".contact-primary-link"
      );

      const contactSocialLinks = gsap.utils.toArray(
        ".contact-social-link",
        contactFooterRef.current
      );

      const contactFooterDetails = contactFooterRef.current.querySelector(
        ".contact-footer-details"
      );

      const contactRevealTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: contactFooterRef.current,
          start: "top 82%",
          once: true,
        },
      });

      contactRevealTimeline
        .from(contactHeading, {
          y: 22,
          opacity: 0,
          duration: 0.65,
          ease: "power2.out",
        })
        .from(
          contactPrimaryLink,
          {
            y: 12,
            opacity: 0,
            duration: 0.45,
            ease: "power2.out",
          },
          "-=0.25"
        )
        .from(
          contactSocialLinks,
          {
            y: 10,
            opacity: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.15"
        )
        .from(
          contactFooterDetails,
          {
            opacity: 0,
            duration: 0.5,
            ease: "power1.out",
          },
          "-=0.1"
        );
    },
    { scope: contactFooterRef }
  );

  return (
    <footer
      id="contact"
      ref={contactFooterRef}
      className="border-t border-white/10"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <p className="font-mono text-xs tracking-[0.18em] text-sage">
          06 / CONTACT
        </p>

        <div className="mt-6 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <h2 className="contact-heading max-w-2xl font-display text-4xl leading-tight text-alabaster md:text-6xl">
              Have a project or opportunity in mind?
            </h2>

            <a
              href={links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="contact-primary-link mt-7 inline-block text-sm text-sage underline underline-offset-4 transition-colors duration-200 hover:text-alabaster"
            >
              Let’s Connect ↗
            </a>
          </div>

          <div className="flex flex-wrap gap-5 text-sm text-ash">
            <a
              href={links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="contact-social-link transition-colors duration-200 hover:text-alabaster"
            >
              LinkedIn ↗
            </a>

            <a
              href={links.github}
              target="_blank"
              rel="noreferrer"
              className="contact-social-link transition-colors duration-200 hover:text-alabaster"
            >
              GitHub ↗
            </a>
          </div>
        </div>

        <div className="contact-footer-details mt-16 border-t border-white/10 pt-5">
          <a
            href={links.previousPortfolio}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-ash underline underline-offset-4 transition-colors duration-200 hover:text-sage"
          >
            View my previous portfolio ↗
          </a>

          <div className="mt-8 flex flex-wrap justify-between gap-3 font-mono text-[10px] text-ash">
            <span>DESIGNED & BUILT BY HIBA MATEEN</span>
            <span>© {new Date().getFullYear()} · PORTFOLIO</span>
          </div>
        </div>
      </div>
    </footer>
  );
}