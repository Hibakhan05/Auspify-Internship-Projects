gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    const image = document.querySelector(".hero-image");
    const logo = document.querySelector(".logo");
    const headline = document.querySelector(".headline");
    const titleLines = document.querySelectorAll(".hero-title span, .hero-title em");
    const meta = document.querySelector(".hero-meta");
    const menuBtn = document.querySelector(".menu-btn");
    const navLinks = document.querySelector(".nav-links");

    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        menuBtn.classList.toggle("active");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            menuBtn.classList.remove("active");
        });
    });

    // Initial states
    gsap.set(image, {
        scale: 1.12,
        opacity: 0
    });
    gsap.set(
        [logo, headline, titleLines, meta],
        {
            opacity: 0,
            y: 30
        }
    );

    // Hero entrance
    const tl = gsap.timeline({
        defaults: {
            ease: "power3.out"
        }
    });
    tl.to(image, {
        opacity: 1,
        scale: 1.06,
        duration: 1.8,
        ease: "power3.out"
    })
        .to(logo, {
            opacity: 1,
            y: 0,
            duration: 0.7
        }, "-=1.15"
        )
        .to(headline, {
            opacity: 1,
            y: 0,
            duration: 0.6
        }, "-=0.4"
        )
        .to(titleLines, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.12
        }, "-=0.25"
        )
        .to(meta, {
            opacity: 1,
            y: 0,
            duration: 0.7
        }, "-=0.45"
        );

    // Subtle hero image movement on scroll
    gsap.to(image, {
        yPercent: 5,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

});

/* STUDIO REVEAL */
gsap.registerPlugin(ScrollTrigger);
gsap.from(".studio-label span", {
    y: 20,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: "power3.out",
    scrollTrigger: {
        trigger: ".studio-section",
        start: "top 75%"
    }
});

gsap.from(".studio-heading h2", {
    y: 80,
    opacity: 0,
    duration: 1.1,
    ease: "power4.out",
    scrollTrigger: {
        trigger: ".studio-heading",
        start: "top 75%"
    }
});

gsap.from(".studio-description > *", {
    y: 35,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: "power3.out",
    scrollTrigger: {
        trigger: ".studio-description",
        start: "top 80%"
    }
});

gsap.from(".studio-image", {
    y: 70,
    opacity: 0,
    duration: 1.2,
    stagger: 0.18,
    ease: "power3.out",
    scrollTrigger: {
        trigger: ".studio-bottom",
        start: "top 80%"
    }
});

/* SELECTED SPACES REVEAL */
gsap.from(".spaces-number span", {
    y: 20,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: "power3.out",
    scrollTrigger: {
        trigger: ".spaces-section",
        start: "top 75%"
    }
});

gsap.from(".spaces-intro h2", {
    y: 90,
    opacity: 0,
    duration: 1.1,
    ease: "power4.out",
    scrollTrigger: {
        trigger: ".spaces-intro",
        start: "top 78%"
    }
});

gsap.utils.toArray(".project").forEach((project) => {
    gsap.from(project, {
        y: 80,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: project,
            start: "top 82%"
        }
    });

});

/* APPROACH REVEAL */
gsap.from(".approach-heading h2", {
    y: 100,
    opacity: 0,
    duration: 1.2,
    ease: "power4.out",
    scrollTrigger: {
        trigger: ".approach-section",
        start: "top 70%"
    }
});

gsap.from(".approach-heading > p", {
    y: 40,
    opacity: 0,
    duration: 0.9,
    delay: 0.2,
    ease: "power3.out",
    scrollTrigger: {
        trigger: ".approach-heading",
        start: "top 75%"
    }
});

gsap.from(".approach-item", {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: "power3.out",
    scrollTrigger: {
        trigger: ".approach-list",
        start: "top 78%"
    }
});

/* CONTACT REVEAL */
gsap.from(".contact-content h2", {
    y: 100,
    opacity: 0,
    duration: 1.5,
    ease: "power4.out",
    scrollTrigger: {
        trigger: ".contact-section",
        start: "top 70%"
    }
});

gsap.from(".contact-button", {
    y: 30,
    opacity: 0,
    duration: 0.8,
    delay: 0.25,
    ease: "power3.out",
    scrollTrigger: {
        trigger: ".contact-content",
        start: "top 70%"
    }
});


/* FOOTER REVEAL */
gsap.from(".footer-brand, .footer-links", {
    y: 35,
    opacity: 0,
    duration: 0.9,
    stagger: 0.15,
    scrollTrigger: {
        trigger: ".footer",
        start: "top 85%"
    }
});

gsap.from(".intro-content", {
    y: 70,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
        trigger: ".intro",
        start: "top 75%",
        toggleActions: "play none none none"
    }
});

gsap.from(".intro-image", {
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 0.15,
    ease: "power3.out",
    scrollTrigger: {
        trigger: ".intro",
        start: "top 75%",
        toggleActions: "play none none none"
    }
});