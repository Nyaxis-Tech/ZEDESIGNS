// Optional Lenis smooth scroll (if not already initialised elsewhere)
if (window.Lenis && !window.__lenisInitialized) {
    const lenis = new Lenis({
        smooth: true,
        lerp: 0.08,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    window.__lenisInitialized = true;
}

document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    /* ==========================
       HERO STATS COUNTERS
       ========================== */

    const statNumbers = document.querySelectorAll(".stat-number");
    let heroCountersDone = false;

    function animateHeroCounters() {
        if (heroCountersDone) return;
        heroCountersDone = true;

        statNumbers.forEach((el) => {
            const raw = el.textContent.trim();
            const end = parseInt(raw.replace(/[^0-9]/g, ""), 10) || 0;
            const suffix = raw.replace(/[0-9]/g, ""); // keep '+' etc.

            const counter = { value: 0 };
            gsap.to(counter, {
                value: end,
                duration: 1.4,
                ease: "power3.out",
                onUpdate: () => {
                    el.textContent = Math.round(counter.value) + suffix;
                },
            });
        });
    }

    /* ==========================
       HERO SECTION ANIMATIONS
       ========================== */

    const heroTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".about-hero",
            start: "top 80%",
            toggleActions: "play none none none", // play once
        },
    });

    heroTl
        .from(".about-hero-left .eyebrow", {
            y: 20,
            opacity: 0,
            duration: 0.4,
            ease: "power2.out",
        })
        .from(
            ".about-hero-left h1",
            {
                y: 30,
                opacity: 0,
                duration: 0.6,
                ease: "power3.out",
            },
            "-=0.1"
        )
        .from(
            ".about-hero-left .lead",
            {
                y: 20,
                opacity: 0,
                duration: 0.5,
                ease: "power2.out",
            },
            "-=0.25"
        )
        .from(
            ".about-hero-pillars .pillar",
            {
                y: 30,
                opacity: 0,
                duration: 0.5,
                ease: "power2.out",
                stagger: 0.12,
            },
            "-=0.2"
        )
        .from(
            ".about-stats .stat-card",
            {
                x: 30,
                opacity: 0,
                duration: 0.5,
                ease: "power2.out",
                stagger: 0.1,
            },
            "-=0.3"
        )
        .from(
            ".about-stats .stat-tagline",
            {
                x: 20,
                opacity: 0,
                duration: 0.45,
                ease: "power2.out",
            },
            "-=0.25"
        )
        .add(animateHeroCounters, "-=0.1");

    /* ==========================
       STRUCTURE DIAGRAM
       ========================== */

    const diagram = document.querySelector(".structure-diagram");

    if (diagram) {
        const linkPaths = diagram.querySelectorAll(".structure-link-path");
        const nodes = diagram.querySelectorAll(".structure-node");
        const labels = diagram.querySelectorAll(".structure-label");

        // Prepare line drawing
        linkPaths.forEach((path) => {
            const length = path.getTotalLength();
            gsap.set(path, {
                strokeDasharray: length,
                strokeDashoffset: length,
            });
        });

        // Initial states
        gsap.set(nodes, {
            opacity: 0,
            scale: 0.7,
            transformOrigin: "50% 50%",
        });

        gsap.set(labels, {
            opacity: 0,
        });

        const structureTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".about-structure",
                start: "top 75%",
                toggleActions: "play none none none", // animate once
            },
        });

        // Copy block (left side)
        structureTl
            .from(".about-structure .structure-copy .eyebrow", {
                y: 20,
                opacity: 0,
                duration: 0.4,
                ease: "power2.out",
            })
            .from(
                ".about-structure .structure-copy h2",
                {
                    y: 26,
                    opacity: 0,
                    duration: 0.5,
                    ease: "power3.out",
                },
                "-=0.2"
            )
            .from(
                ".about-structure .structure-copy p",
                {
                    y: 20,
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.out",
                    stagger: 0.1,
                },
                "-=0.25"
            );

        // Nodes pop in
        structureTl.to(
            nodes,
            {
                opacity: 1,
                scale: 1,
                duration: 0.7,
                ease: "back.out(1.5)",
                stagger: 0.15,
            },
            "-=0.1"
        );

        // Lines draw
        structureTl.to(
            linkPaths,
            {
                strokeDashoffset: 0,
                duration: 0.8,
                ease: "power2.out",
                stagger: 0.15,
            },
            "-=0.3"
        );

        // Labels fade in
        structureTl.to(
            labels,
            {
                opacity: 1,
                duration: 0.5,
                ease: "power1.out",
                stagger: 0.1,
            },
            "-=0.25"
        );

        // Interactive info ↔ nodes link
        const infoItems = document.querySelectorAll(".structure-info-item");

        function setActiveNode(name) {
            nodes.forEach((node) => {
                node.classList.toggle(
                    "is-active",
                    node.dataset.node === name
                );
            });
            infoItems.forEach((item) => {
                item.classList.toggle(
                    "is-active",
                    item.dataset.node === name
                );
            });
        }

        nodes.forEach((node) => {
            const name = node.dataset.node;
            node.addEventListener("mouseenter", () => setActiveNode(name));
        });

        infoItems.forEach((item) => {
            const name = item.dataset.node;
            item.addEventListener("mouseenter", () => setActiveNode(name));
            item.addEventListener("focus", () => setActiveNode(name));
        });
    }

    /* ==========================
       TRIANGLE SVG DRAWING ANIMATION
       ========================== */

    const triangleSVG = document.querySelector("#Layer_1");
    
    if (triangleSVG) {
        // Get all stroke elements (paths and lines)
        const strokeElements = triangleSVG.querySelectorAll(".st14");
        
        // Prepare each path/line for drawing animation
        strokeElements.forEach((element) => {
            const length = element.getTotalLength ? element.getTotalLength() : 0;
            if (length > 0) {
                gsap.set(element, {
                    strokeDasharray: length,
                    strokeDashoffset: length,
                });
            }
        });

        // Create timeline for triangle drawing
        const triangleTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".structure-visual",
                start: "top 70%",
                toggleActions: "play none none none",
            },
        });

        // Animate all stroke elements drawing in
        triangleTl.to(strokeElements, {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: "power2.inOut",
            stagger: 0.15,
        });

        // Fade in text elements after drawing
        const textElements = triangleSVG.querySelectorAll("text");
        gsap.set(textElements, { opacity: 0 });
        
        triangleTl.to(
            textElements,
            {
                opacity: 1,
                duration: 0.6,
                ease: "power2.out",
                stagger: 0.08,
            },
            "-=0.5"
        );
    }

    /* ==========================
       TRIANGLE HOVER INTERACTION
       ========================== */

    const structureCards = document.querySelectorAll(".structure-info-item");
    const trianglePaths = document.querySelectorAll(".triangle-path");

    if (structureCards.length && trianglePaths.length) {
        structureCards.forEach((card) => {
            const cardType = card.dataset.node; // strategy, design, or experience

            card.addEventListener("mouseenter", () => {
                // Find the corresponding triangle
                const targetTriangle = document.querySelector(
                    `.triangle-path[data-triangle="${cardType}"]`
                );

                if (targetTriangle) {
                    // Highlight the triangle
                    gsap.to(targetTriangle, {
                        stroke: "#eccf9c",
                        strokeWidth: 3,
                        opacity: 1,
                        duration: 0.3,
                        ease: "power2.out",
                    });

                    // Dim other triangles
                    trianglePaths.forEach((path) => {
                        if (path !== targetTriangle) {
                            gsap.to(path, {
                                opacity: 0.3,
                                duration: 0.3,
                                ease: "power2.out",
                            });
                        }
                    });
                }
            });

            card.addEventListener("mouseleave", () => {
                // Reset all triangles to default state
                trianglePaths.forEach((path) => {
                    gsap.to(path, {
                        stroke: "#eccf9d",
                        strokeWidth: 2,
                        opacity: 1,
                        duration: 0.3,
                        ease: "power2.out",
                    });
                });
            });
        });
    }

    /* ==========================
       METHODOLOGY CARDS
       ========================== */

    gsap.from(".about-methodology .about-section-header", {
        scrollTrigger: {
            trigger: ".about-methodology",
            start: "top 80%",
            toggleActions: "play none none none",
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
    });

    gsap.from(".about-methodology .method-card", {
        scrollTrigger: {
            trigger: ".about-methodology",
            start: "top 75%",
            toggleActions: "play none none none",
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.15,
    });

    /* ==========================
       EXPERTISE COLUMNS
       ========================== */

    // gsap.from(".about-expertise .about-section-header", {
    //     scrollTrigger: {
    //         trigger: ".about-expertise",
    //         start: "top 80%",
    //         toggleActions: "play none none none",
    //     },
    //     y: 30,
    //     opacity: 0,
    //     duration: 0.6,
    //     ease: "power2.out",
    // });

    // gsap.from(".about-expertise .expertise-column", {
    //     scrollTrigger: {
    //         trigger: ".about-expertise",
    //         start: "top 75%",
    //         toggleActions: "play none none none",
    //     },
    //     y: 35,
    //     opacity: 0,
    //     duration: 0.55,
    //     ease: "power3.out",
    //     stagger: 0.12,
    // });

    /* ==========================
       SECTOR CARDS
       ========================== */

    gsap.from(".about-sectors .about-section-header", {
        scrollTrigger: {
            trigger: ".about-sectors",
            start: "top 80%",
            toggleActions: "play none none none",
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
    });

    gsap.from(".about-sectors .sector-card", {
        scrollTrigger: {
            trigger: ".about-sectors",
            start: "top 75%",
            toggleActions: "play none none none",
        },
        y: 40,
        opacity: 0,
        duration: 0.55,
        ease: "power3.out",
        stagger: 0.12,
    });

    /* ==========================
       CULTURE / PHILOSOPHY
       ========================== */

    gsap.from(".about-culture .about-culture-grid > div", {
        scrollTrigger: {
            trigger: ".about-culture",
            start: "top 80%",
            toggleActions: "play none none none",
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.15,
    });

    /* ==========================
    CUSTOM IMAGE CURSOR ON HOW WE WORK CARDS
    ========================== */

    const methodCards = document.querySelectorAll(".method-card");

    if (methodCards.length) {
        // Create cursor element once
        const cursor = document.createElement("div");
        cursor.className = "cursor-preview";
        document.body.appendChild(cursor);

        // Smooth follow using gsap.quickTo (short duration = snappy, smooth)
        const setX = gsap.quickTo(cursor, "left", {
            duration: 0.06,
            ease: "none",
        });
        const setY = gsap.quickTo(cursor, "top", {
            duration: 0.06,
            ease: "none",
        });

        // --- PRELOAD ALL CURSOR IMAGES so there is no lag when swapping ---
        const cursorSources = Array.from(methodCards)
            .map((card) => card.dataset.cursorImg)
            .filter(Boolean); // remove undefined / empty

        cursorSources.forEach((src) => {
            const img = new Image();
            img.src = src; // browser caches it
        });

        methodCards.forEach((card) => {
            const img = card.dataset.cursorImg;

            card.addEventListener("mouseenter", (e) => {
                if (img) {
                    // directly swap image, no fade
                    cursor.style.backgroundImage = `url('${img}')`;
                } else {
                    cursor.style.backgroundImage = "none";
                }

                cursor.classList.add("is-visible");
                setX(e.clientX);
                setY(e.clientY);
            });

            card.addEventListener("mousemove", (e) => {
                setX(e.clientX);
                setY(e.clientY);
            });

            card.addEventListener("mouseleave", () => {
                cursor.classList.remove("is-visible");
            });
        });
    }

});
