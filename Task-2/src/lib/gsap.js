import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register once. Import { gsap, ScrollTrigger } from here everywhere else.
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
