import { projectsData } from "./projectData.js";
// assets/scripts/projects.js

document.addEventListener("DOMContentLoaded", () => {
    // ==========================
    // Smooth scrolling with Lenis
    // ==========================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        if (typeof ScrollTrigger !== "undefined") {
            ScrollTrigger.update();
        }
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    function loadProjects(){
        // Load project cards dynamically
        const projectsGrid = document.querySelector(".projects-grid");

        if (projectsGrid) {
            projectsData.forEach((project) => {
                projectsGrid.innerHTML += `
                    <article class="project-card" data-category="branding">
                        <div class="project-meta">
                            <h2 class="project-title">
                                ${project.name} — ${project.tagLine}
                            </h2>
                            <p class="project-lead">
                                ${project.shortDescription}
                            </p>
                            <div class="project-tags">
                                ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                            </div>
                        </div>
                        <a class="project-media" href="javascript:void(0);">
                            <img
                                src="${project.bannerImage}"
                                alt="${project.name} branding"
                            />
                        </a>
                    </article>
                ` 
            });
        }
    }
    loadProjects();


    // ==========================
    // Custom cursor – from hero down, except header & footer
    // ==========================
    const main = document.getElementById("main");
    const hero = document.querySelector(".projects-hero");
    const nav = document.getElementById("nav");

    // Guards
    if (!main || !hero) return;
    if (
        !window.matchMedia ||
        !window.matchMedia("(pointer: fine)").matches
    ) {
        return; // skip on touch / coarse pointer
    }

    // Create the custom cursor element
    const cursor = document.createElement("div");
    cursor.className = "work-cursor";
    cursor.innerHTML = "<span>Our work</span>";
    document.body.appendChild(cursor);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let active = false;

    const ease = 0.16; // smaller = slower, smoother

    function activateCursor() {
        if (active) return;
        active = true;
        cursor.classList.add("is-visible");
        main.classList.add("custom-cursor-active"); // hide system cursor (CSS)
    }

    function deactivateCursor() {
        if (!active) return;
        active = false;
        cursor.classList.remove("is-visible");
        main.classList.remove("custom-cursor-active"); // show system cursor again
    }

    function handleMove(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // If we're over the header/nav – NO custom cursor
        if (e.target.closest("#nav")) {
            deactivateCursor();
            return;
        }

        // If we've left #main (into footer / outside page) => handled by mouseleave
        // Decide if cursor should be active based on hero position
        const heroRect = hero.getBoundingClientRect();
        const inHeroOrBelow = e.clientY >= heroRect.top;

        if (inHeroOrBelow) {
            activateCursor();
        } else {
            // Above hero (e.g. top area below nav): no custom cursor
            deactivateCursor();
        }
    }

    main.addEventListener("mousemove", handleMove);
    main.addEventListener("mouseenter", handleMove);
    main.addEventListener("mouseleave", () => {
        // Leaving #main -> hide custom cursor, system cursor comes back
        deactivateCursor();
    });

    function render() {
        // Smoothly lerp towards mouse
        cursorX += (mouseX - cursorX) * ease;
        cursorY += (mouseY - cursorY) * ease;

        const scale = active ? 1 : 0.4;

        cursor.style.transform =
            `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%) scale(${scale})`;

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);


    
});
