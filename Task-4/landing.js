const skyLayer = document.getElementById("sky-layer");
const weatherLink = document.getElementById("weather-link");

const PARALLAX_STRENGTH = 30;
const PAGE_FADE_DURATION = 500;

const hasMouse = window.matchMedia("(hover: hover)").matches;

if (hasMouse) {
  document.addEventListener("pointermove", (event) => {
    const mouseX = event.clientX / window.innerWidth - 0.5;
    const mouseY = event.clientY / window.innerHeight - 0.5;

    // The sky moves opposite to the mouse to give a sense of depth
    skyLayer.style.transform = `translate(${-mouseX * PARALLAX_STRENGTH}px, ${-mouseY * PARALLAX_STRENGTH}px)`;

    document.documentElement.style.setProperty("--glow-x", `${event.clientX}px`);
    document.documentElement.style.setProperty("--glow-y", `${event.clientY}px`);
  });
}

// Fade the page out before opening the weather page
weatherLink.addEventListener("click", (event) => {
  event.preventDefault();
  document.body.classList.add("opacity-0");
  setTimeout(() => {
    window.location.href = weatherLink.href;
  }, PAGE_FADE_DURATION);
});

// Coming back with the browser's back button should not show a blank page
window.addEventListener("pageshow", () => {
  document.body.classList.remove("opacity-0");
});