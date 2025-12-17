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
        
        // Get current language from i18n
        const currentLang = localStorage.getItem("language") || 'ar';

        if (projectsGrid) {
            projectsGrid.innerHTML = projectsData.map((project, index) => {
                // Get the project data for current language
                const projectData = project[currentLang] || project.en;
                
                const queryParam = encodeURIComponent(projectData.name);
                return `
                <a href="projectDetails.html?id=${index+1}" class="project-card" data-index="${index}" data-category="branding">
                    <div class="project-meta">
                        <h2 class="project-title">
                            ${projectData.name}
                        </h2>
                        <div class="project-tags">
                            ${projectData.tags.slice(0,2).map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                    <div class="project-media">
                        <img
                            src="${projectData.bannerImage}"
                            alt="${projectData.name} branding"
                        />
                    </div>
                </a>
            `}).join('');
        }
    }
    loadProjects();

    // Reload projects when language changes
    window.addEventListener('languageChanged', (e) => {
        // reload complete page
        loadProjects();
        // Update cursor text
        const cursor = document.querySelector('.work-cursor span');
        if(cursor){
            cursor.textContent = e.detail.language === 'en' ? 'Our work' : 'عملنا';
        }
    });


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
    const currentLang = localStorage.getItem("language") || 'ar';

    cursor.innerHTML = currentLang == 'en' ? "<span>Our work</span>" : "<span>عملنا</span>";
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


    // Handle Click/(tap for mobile) on project cards to go to projectDetail.html page with query param
    // Removed JS event listener as we are now using <a> tags for better accessibility and mobile support
});
