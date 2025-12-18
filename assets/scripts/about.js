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

    const statNumbers = document.querySelectorAll(".about-stats-strip .stat-value");
    let statsCountersDone = false;

    function animateStatsCounters() {
        if (statsCountersDone) return;
        statsCountersDone = true;

        statNumbers.forEach((el) => {
            const raw = el.textContent.trim();
            const end = parseInt(raw.replace(/[^0-9]/g, ""), 10) || 0;
            const suffix = raw.replace(/[0-9]/g, ""); // keeps + etc.

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

    // trigger when stats strip comes into view
    ScrollTrigger.create({
        trigger: ".about-stats-strip",
        start: "top 90%",
        // markers: true,
        once: true,
        onEnter: animateStatsCounters,
    });

    /* ==========================
       INTERACTIVE GLOBE MAP
       ========================== */

    if (typeof am5viewer !== "undefined" && document.getElementById("globalMapChart")) {
        am5viewer.create("globalMapChart", {
            "settings": {
                "editor": {
                    "theme": "dark",
                    "userData": {
                        "projection": "geoMercator",
                        "geodata": "worldLow"
                    },
                    "themeTags": ["dark"],
                    "backgroundFill": {
                        "type": "Color",
                        "value": "#1a1a1a"
                    },
                    "polygonFill": {
                        "type": "Color",
                        "value": "#212121"
                    },
                    "polygonStrokeWidth": 0.5,
                    "pointFill": {
                        "type": "Color",
                        "value": "#3a4b43"
                    },
                    "pointFillOpacity": 1,
                    "pointFillHover": {
                        "type": "Color",
                        "value": "#fafafa"
                    },
                    "pointStrokeHover": {
                        "type": "Color",
                        "value": "#3a4b43"
                    },
                    "labelColorHover": {
                        "type": "Color",
                        "value": "#ffffff"
                    },
                    "fillColor": {
                        "type": "Color",
                        "value": "#eace9c"
                    },
                    "backgroundNoise": false,
                    "polygonInteractive": true,
                    "lineInteractive": false,
                    "linePointInteractive": false,
                    "pointTooltipText": "",
                    "pointLabelPosition": "top",
                    "labelInteractive": true,
                    "bubbleInteractive": false,
                    "__parse": true,
                    "pointLabelText": "ZEDESIGNS"
                },
                "editor.map": {
                    "minZoomLevel": 0.8,
                    "projection": "geoOrthographic",
                    "panX": "rotateX",
                    "zoomControl": {
                        "type": "ZoomControl",
                        "settings": {
                            "visible": false,
                            "position": "absolute"
                        },
                        "themeTags": ["zoomtools"],
                        "layer": 30,
                        "opacity": 0
                    },
                    "background": {
                        "type": "Rectangle",
                        "settings": {
                            "fill": {
                                "type": "Color",
                                "value": "#1a1a1a"
                            },
                            "fillOpacity": 1,
                            "width": 1536,
                            "height": 729,
                            "x": 0,
                            "y": 0,
                            "isMeasured": false
                        }
                    },
                    "themeTags": ["map"],
                    "translateX": 707.1217543563725,
                    "translateY": 327.41408227383977,
                    "panY": "rotateY",
                    "rotationX": -29.524842376298356,
                    "rotationY": -27.604535204877592,
                    "homeZoomLevel": 1.2572969490684567,
                    "homeRotationX": -29.524842376298356,
                    "homeRotationY": -27.604535204877592,
                    "__parse": true,
                    "homeGeoPoint": {
                        "longitude": 33.563190995341216,
                        "latitude": 23.674541196601837
                    }
                },
                "editor.pointTemplate": {
                    "toggleKey": "active",
                    "centerX": {"type": "Percent", "value": 50},
                    "centerY": {"type": "Percent", "value": 50},
                    "tooltipText": "",
                    "__parse": true
                },
                "editor.bubbleTemplate": {
                    "toggleKey": "active",
                    "tooltipText": "{name}: {value}",
                    "__parse": true
                },
                "editor.pixelTemplate": {
                    "tooltipText": "{name}",
                    "toggleKey": "active",
                    "__parse": true,
                    "userData": {
                        "point1": {"longitude": 107.88761706555671, "latitude": -39.369976033727845},
                        "point2": {"longitude": 115.37981269510925, "latitude": -39.369976033727845}
                    }
                },
                "editor.linePointTemplate": {
                    "toggleKey": "active",
                    "centerX": {"type": "Percent", "value": 50},
                    "centerY": {"type": "Percent", "value": 50},
                    "tooltipText": "{name}",
                    "__parse": true
                },
                "editor.labelTemplate": {
                    "toggleKey": "active",
                    "tooltipText": "{name}",
                    "__parse": true
                },
                "editor.polygonSeries": {
                    "valueField": "value",
                    "calculateAggregates": true,
                    "id": "polygonseries",
                    "exclude": [],
                    "geometryField": "geometry",
                    "geometryTypeField": "geometryType",
                    "idField": "id",
                    "__parse": true
                },
                "editor.lineSeries": {
                    "layer": 30,
                    "id": "lineseries",
                    "lineTypeField": "lineType",
                    "geometryField": "geometry",
                    "geometryTypeField": "geometryType",
                    "idField": "id",
                    "__parse": true
                },
                "editor.pointSeries": {
                    "fixedField": "fixed",
                    "id": "pointseries",
                    "geometryField": "geometry",
                    "geometryTypeField": "geometryType",
                    "idField": "id",
                    "__parse": true
                },
                "editor.labelSeries": {
                    "fixedField": "fixed",
                    "id": "labelseries",
                    "geometryField": "geometry",
                    "geometryTypeField": "geometryType",
                    "idField": "id",
                    "__parse": true
                },
                "editor.bubbleSeries": {
                    "calculateAggregates": true,
                    "valueField": "value",
                    "polygonIdField": "id",
                    "id": "bubbleseries",
                    "geometryField": "geometry",
                    "geometryTypeField": "geometryType",
                    "idField": "id",
                    "__parse": true
                },
                "editor.gridSeries": {
                    "themeTags": ["grid"],
                    "affectsBounds": false,
                    "lineTypeField": "lineType",
                    "geometryField": "geometry",
                    "geometryTypeField": "geometryType",
                    "idField": "id",
                    "visible": false,
                    "clipExtent": true,
                    "__parse": true
                },
                "editor.backgroundSeries": {
                    "visible": false,
                    "themeTags": ["polygon", "background"],
                    "affectsBounds": false,
                    "geometryField": "geometry",
                    "geometryTypeField": "geometryType",
                    "idField": "id",
                    "exclude": ["bg"],
                    "__parse": true
                },
                "editor.backgroundSeries.mapPolygons.template": {
                    "forceInactive": true,
                    "fill": {"type": "Color", "value": "#5d5a5a"},
                    "stroke": {"type": "Color", "value": "#5d5a5a"},
                    "__parse": true
                },
                "editor.gridSeries.mapLines.template": {
                    "forceInactive": true,
                    "stroke": {"type": "Color", "value": "#ffffff"},
                    "strokeOpacity": 0.04,
                    "__parse": true
                }
            },
            "data": {
                "editor.polygonSeries": [
                    {"id": "NL", "name": "Netherlands", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "YE", "name": "Yemen", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "PS", "name": "Palestinian Territories", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "VE", "name": "Venezuela", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "US", "name": "United States", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "TR", "name": "Türkiye", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "TN", "name": "Tunisia", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "SY", "name": "Syria", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "SE", "name": "Sweden", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "SA", "name": "Saudi Arabia", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "EH", "name": "Western Sahara", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#212121"}}}, "__parse": true},
                    {"id": "QA", "name": "Qatar", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "PL", "name": "Poland", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "PK", "name": "Pakistan", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "OM", "name": "Oman", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "NG", "name": "Nigeria", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "MY", "name": "Malaysia", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "MA", "name": "Morocco", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "LY", "name": "Libya", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "LB", "name": "Lebanon", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "KW", "name": "Kuwait", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "JO", "name": "Jordan", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "IT", "name": "Italy", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "IQ", "name": "Iraq", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "IE", "name": "Ireland", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "IN", "name": "India", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "ID", "name": "Indonesia", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "HU", "name": "Hungary", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#212121"}}}, "__parse": true},
                    {"id": "FR", "name": "France", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "ES", "name": "Spain", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "GB", "name": "United Kingdom", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "EG", "name": "Egypt", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "DZ", "name": "Algeria", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "DK", "name": "Denmark", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "DE", "name": "Germany", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "CA", "name": "Canada", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "BE", "name": "Belgium", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "AT", "name": "Austria", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "AU", "name": "Australia", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true},
                    {"id": "AE", "name": "United Arab Emirates", "settings": {"type": "Template", "settings": {"fill": {"type": "Color", "value": "#eace9c"}}}, "__parse": true}
                ],
                "editor.lineSeries": [],
                "editor.pointSeries": [
                    {
                        "fixed": false,
                        "geometry": {"type": "Point", "coordinates": [42.01467, 23.7939], "__parse": false},
                        "id": "point_2",
                        "name": "Point 2",
                        "settings": {
                            "type": "Template",
                            "settings": {
                                "fillOpacity": 1,
                                "fill": {"type": "Color", "value": "#3a4b43"},
                                "stroke": {"type": "Color", "value": "#f9f9f9"},
                                "strokeOpacity": 0.5019607843137255,
                                "scale": 0.7,
                                "strokeWidth": 0.5,
                                "x": {"type": "Percent", "value": 57.96875158945719},
                                "y": {"type": "Percent", "value": 49.300410685388805}
                            }
                        },
                        "pointType": "Balloon",
                        "labelId": "label_1",
                        "__parse": true
                    }
                ],
                "editor.labelSeries": [
                    {
                        "fixed": false,
                        "geometry": {"type": "Point", "coordinates": [44.68543485133088, 24.864475573197602], "__parse": false},
                        "id": "label_1",
                        "name": "ZEDESIGNS",
                        "populateText": true,
                        "settings": {
                            "type": "Template",
                            "settings": {
                                "text": "{name}",
                                "fill": {"type": "Color", "value": "#ffffff"},
                                "fillOpacity": 1,
                                "fontSize": "1em",
                                "fontWeight": "normal",
                                "textAlign": "left",
                                "x": {"type": "Percent", "value": 57.96875158945719},
                                "y": {"type": "Percent", "value": 49.300410685388805}
                            }
                        },
                        "pointId": "point_2",
                        "pointSeries": "pointseries",
                        "labelPosition": "top",
                        "__parse": true
                    }
                ],
                "editor.bubbleSeries": [],
                "editor.gridSeries": []
            }
        });

        // Prevent page scroll when interacting with the map
        const mapWrapper = document.querySelector('.global-map-wrapper');
        
        if (mapWrapper) {
            let isOverMap = false;
            
            // Track when mouse enters/leaves the map area
            mapWrapper.addEventListener('mouseenter', () => {
                isOverMap = true;
                // Disable Lenis smooth scroll when over map
                if (window.lenis) {
                    window.lenis.stop();
                }
            });
            
            mapWrapper.addEventListener('mouseleave', () => {
                isOverMap = false;
                // Re-enable Lenis smooth scroll when leaving map
                if (window.lenis) {
                    window.lenis.start();
                }
            });
            
            // Prevent wheel events from propagating to page
            mapWrapper.addEventListener('wheel', (e) => {
                if (isOverMap) {
                    e.stopPropagation();
                }
            }, { passive: true });
        }

        // Animate globe section entrance
        gsap.from(".about-global-reach", {
            scrollTrigger: {
                trigger: ".about-global-reach",
                start: "top 80%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: "power3.out"
        });

        // Animate stats when globe section is in view
        ScrollTrigger.create({
            trigger: ".about-global-reach .stats-strip",
            start: "top 85%",
            once: true,
            onEnter: () => {
                const globalStats = document.querySelectorAll(".about-global-reach .stat-value");
                globalStats.forEach((el) => {
                    const raw = el.textContent.trim();
                    const end = parseInt(raw.replace(/[^0-9]/g, ""), 10) || 0;
                    const suffix = raw.replace(/[0-9]/g, "");

                    const counter = { value: 0 };
                    gsap.to(counter, {
                        value: end,
                        duration: 1.4,
                        ease: "power3.out",
                        onUpdate: () => {
                            el.textContent = Math.round(counter.value) + suffix;
                        }
                    });
                });
            }
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

    /* ==========================
       INTERACTIVE LOGO TILT ON HERO
       ========================== */

    const logoWrap = document.querySelector(".logo-spin-wrap");
    const logoSpin = document.querySelector(".logo-spin");

    if (logoWrap && logoSpin) {
        // Tilt parameters
        const maxTilt = 25; // Maximum tilt angle in degrees
        
        logoWrap.addEventListener("mousemove", (e) => {
            const rect = logoWrap.getBoundingClientRect();
            const x = e.clientX - rect.left; // Mouse X position within element
            const y = e.clientY - rect.top;  // Mouse Y position within element
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate tilt angles based on mouse position
            // Normalize to -1 to 1 range, then multiply by maxTilt
            const rotateY = ((x - centerX) / centerX) * maxTilt;
            const rotateX = -((y - centerY) / centerY) * maxTilt;
            
            // Apply smooth transform
            logoSpin.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        logoWrap.addEventListener("mouseleave", () => {
            // Reset to neutral position
            logoSpin.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    }
        

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
        duration: 1.5,
        ease: "power3.out",
        stagger: 0.5,
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

    /* ==========================
       SECTORS - WHO WE WORK WITH
       ========================== */

    // Animate section header
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

    // Animate sector cards with stagger
    gsap.from(".about-sectors .sector-card", {
        scrollTrigger: {
            trigger: ".about-sectors",
            start: "top 75%",
            toggleActions: "play none none none",
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.15,
    });

    // Spotlight effect for sector cards (same as tag)
    const sectorCards = document.querySelectorAll(".about-sectors .sector-card");
    sectorCards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
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
    /* ==========================
   PHILOSOPHY SVG DRAW ANIMATION
   ========================== */

    const philosophySVG = document.querySelector(".philosophy-wrapper svg");

    if (philosophySVG) {
        const strokeElements = philosophySVG.querySelectorAll(".st5, .st4"); // lines + boxes
        const textElements = philosophySVG.querySelectorAll("text");

        // Prep draw
        strokeElements.forEach((el) => {
            if (typeof el.getTotalLength !== "function") return;
            const length = el.getTotalLength();
            gsap.set(el, { strokeDasharray: length, strokeDashoffset: length });
        });

        // Prep text
        gsap.set(textElements, { opacity: 0 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".about-culture",
                start: "top 75%",
                toggleActions: "play none none none",
            },
        });

        // Draw strokes
        tl.to(strokeElements, {
            strokeDashoffset: 0,
            duration: 1.4,
            ease: "power2.inOut",
            stagger: 0.12,
        });

        // Fade text in
        tl.to(
            textElements,
            {
                opacity: 1,
                duration: 0.55,
                ease: "power2.out",
                stagger: 0.08,
            },
            "-=0.5"
        );
    }
    // Draggable Clients Section with Auto-scroll (ABOUT)
    (() => {
        const clientsSection = document.querySelector("#clients #clientsbtm");
        const clientWrapper = document.querySelector("#clients #clientwrapper");

        if (!clientsSection || !clientWrapper) return;

        let isDown = false;
        let startX;
        let scrollLeft;
        let velocity = 0;
        let lastX = 0;
        let lastTime = Date.now();
        let hasMoved = false;

        // Auto-scroll function (always LTR due to CSS direction override)
        const autoScroll = () => {
            if (!isDown) {
                if (localStorage.getItem("language") === "ar") {
                    clientsSection.scrollLeft += 1;
                } else {
                    clientsSection.scrollLeft -= 1;
                }

                // Reset scroll position for infinite loop
                const half = clientWrapper.scrollWidth / 2; // because you duplicated in HTML
                if (clientsSection.scrollLeft <= 0) clientsSection.scrollLeft = half;
                if (clientsSection.scrollLeft >= half * 2) clientsSection.scrollLeft = half;
            }
            requestAnimationFrame(autoScroll);
        };

        autoScroll();

        clientsSection.addEventListener("mousedown", (e) => {
            isDown = true;
            hasMoved = false;
            clientsSection.classList.add("grabbing");
            startX = e.pageX - clientsSection.offsetLeft;
            scrollLeft = clientsSection.scrollLeft;
            lastX = e.pageX;
            lastTime = Date.now();
            velocity = 0;
            e.preventDefault();
        });

        clientsSection.addEventListener("mouseleave", () => {
            if (!isDown) return;
            isDown = false;
            clientsSection.classList.remove("grabbing");
        });

        clientsSection.addEventListener("mouseup", (e) => {
            if (!isDown) return;
            isDown = false;
            clientsSection.classList.remove("grabbing");

            if (hasMoved) {
                e.preventDefault();
                e.stopPropagation();
            }

            const half = clientWrapper.scrollWidth / 2;

            const applyInertia = () => {
                if (Math.abs(velocity) > 0.5) {
                    clientsSection.scrollLeft += velocity;
                    velocity *= 0.95;

                    if (clientsSection.scrollLeft <= 0) clientsSection.scrollLeft = half;
                    if (clientsSection.scrollLeft >= half * 2) clientsSection.scrollLeft = half;

                    requestAnimationFrame(applyInertia);
                }
            };
            applyInertia();
        });

        clientsSection.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();

            hasMoved = true;

            const currentTime = Date.now();
            const timeElapsed = currentTime - lastTime;

            const x = e.pageX - clientsSection.offsetLeft;
            const walk = x - startX;

            velocity = (lastX - e.pageX) / (timeElapsed || 16);

            clientsSection.scrollLeft = scrollLeft - walk;

            const half = clientWrapper.scrollWidth / 2;
            if (clientsSection.scrollLeft <= 0) clientsSection.scrollLeft = half;
            if (clientsSection.scrollLeft >= half * 2) clientsSection.scrollLeft = half;

            lastX = e.pageX;
            lastTime = currentTime;
        });

        clientsSection.addEventListener(
            "click",
            (e) => {
                if (!hasMoved) return;
                e.preventDefault();
                e.stopPropagation();
                hasMoved = false;
            },
            true
        );

        // Touch
        clientsSection.addEventListener(
            "touchstart",
            (e) => {
                isDown = true;
                hasMoved = false;
                startX = e.touches[0].pageX - clientsSection.offsetLeft;
                scrollLeft = clientsSection.scrollLeft;
                lastX = e.touches[0].pageX;
                lastTime = Date.now();
                velocity = 0;
            },
            { passive: true }
        );

        clientsSection.addEventListener(
            "touchend",
            () => {
                if (!isDown) return;
                isDown = false;

                const half = clientWrapper.scrollWidth / 2;

                const applyInertia = () => {
                    if (Math.abs(velocity) > 0.5) {
                        clientsSection.scrollLeft += velocity;
                        velocity *= 0.95;

                        if (clientsSection.scrollLeft <= 0) clientsSection.scrollLeft = half;
                        if (clientsSection.scrollLeft >= half * 2) clientsSection.scrollLeft = half;

                        requestAnimationFrame(applyInertia);
                    }
                };
                applyInertia();
            },
            { passive: true }
        );

        clientsSection.addEventListener(
            "touchmove",
            (e) => {
                if (!isDown) return;

                hasMoved = true;

                const currentTime = Date.now();
                const timeElapsed = currentTime - lastTime;

                const x = e.touches[0].pageX - clientsSection.offsetLeft;
                const walk = x - startX;

                velocity = (lastX - e.touches[0].pageX) / (timeElapsed || 16);

                clientsSection.scrollLeft = scrollLeft - walk;

                const half = clientWrapper.scrollWidth / 2;
                if (clientsSection.scrollLeft <= 0) clientsSection.scrollLeft = half;
                if (clientsSection.scrollLeft >= half * 2) clientsSection.scrollLeft = half;

                lastX = e.touches[0].pageX;
                lastTime = currentTime;
            },
            { passive: true }
        );

        clientsSection.style.cursor = "grab";
    })();



});
