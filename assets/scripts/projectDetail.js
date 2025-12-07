import { projectsData } from "./projectData.js";


const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    ScrollTrigger.update();
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

document.addEventListener("DOMContentLoaded", function () {
    function loadProjectData(project){
        let heroText = document.querySelector("#herotext");
        let bannerImg = document.querySelector("#heroimg img");
        let overviewDiv = document.querySelector("#overview");
        let challengeDiv = document.querySelector("#challenge");
        let solutionDiv = document.querySelector("#solution");
        let projectLogoImg = document.querySelector("#projectInfoLogo");
        let projectResultsDiv = document.querySelector("#projectresults");
    
        if (heroText){
            heroText.innerHTML += `
                <h1>${project.name} - ${project.tagLine}</h1>
                    <p>${project.shortDescription}</p>
                    <div id="hrtags">
                        ${project.tags.map(tag=>`
                        <div id="hrtag">
                            <p>${tag}</p>
                        </div>
                        `).join('')}
                    </div>
            `
        }
    
        if (bannerImg){
            bannerImg.src = project.bannerImage;
        }
    
        if (overviewDiv){
            overviewDiv.innerHTML += `
                <p>${project.overview}</p>
                <div id="hrtags">
                    ${project.tags.map(tag=>`
                    <div id="hrtag">
                        <p>${tag}</p>
                    </div>
                    `).join('')}
                </div>
            `
        }
    
        if (challengeDiv){
            challengeDiv.innerHTML += `
                <p>${project.challenge}</p>
            `
        }
    
        if (solutionDiv){
            solutionDiv.innerHTML += `
                <p>${project.solution}</p>
                <ul>
                    ${project.solutionPoints.map(point=>`
                    <li>${point}</li>
                    `).join('')}
                </ul>
            `
        }
    
        if (projectLogoImg){
            projectLogoImg.src = project.images[0];
        }
    
        if (projectResultsDiv){
            projectResultsDiv.innerHTML += `
                ${project.images.slice(1).map((image, index)=>`
                    <section class="card ${index === project.images.length - 2 ? 'scroll' : 'pinned'}">
                        <div class="img">
                            <img src="${image}" alt="Image">
                        </div>
                    </section>
                `).join('')}
            `;
        }
    }
    
    // Get Query Parameter for Project Name
    const urlParams = new URLSearchParams(window.location.search);
    const projectName = urlParams.get("project");

    let project = projectsData.find(p => p.name === projectName); // Change "SanBun" to the desired project name
    loadProjectData(project);
    
    gsap.registerPlugin(ScrollTrigger);

    const heroImg = document.querySelector("#heroimg img");

    const maskImagePath = project.logoImage;

    if (heroImg) {
        // Define the solid mask layer (fades out)
        const solidMask =
            "linear-gradient(rgba(0,0,0,var(--mask-bg-alpha, 1)), rgba(0,0,0,var(--mask-bg-alpha, 1)))";

        // Use GSAP to set initial properties
        gsap.set(heroImg, {
            "--mask-bg-alpha": 1, // Start fully opaque (Full Image Visible)
            maskImage: `url('${maskImagePath}'), ${solidMask}`,
            webkitMaskImage: `url('${maskImagePath}'), ${solidMask}`,
            maskRepeat: "no-repeat, no-repeat",
            webkitMaskRepeat: "no-repeat, no-repeat",
            maskPosition: "center, center",
            webkitMaskPosition: "center, center",
            // Initial sizes: Logo starts larger, Solid full
            maskSize: "100%, 100% 100%",
            webkitMaskSize: "100%, 100% 100%",
        });

        // Animate the mask
        // Change mask size on Mobile to 70%
        let isMobile = window.innerWidth <= 768;
        let finalMaskSize = isMobile ? "90%, 100% 100%" : "50%, 100% 100%";
        let startOffset = isMobile ? "top+=50 center" : "top+=100 center";
        let endOffset = isMobile ? "+=150" : "+=250";
        gsap.to(heroImg, {
            "--mask-bg-alpha": 0, // Fade out the solid background
            maskSize: finalMaskSize, // Shrink logo to 30%
            webkitMaskSize: finalMaskSize,
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: "#heroimg",
                start: startOffset,
                end: endOffset,
                scrub: 1,
            },
        });
    }

    // Pin the right information wrapper while scrolling through project info
    ScrollTrigger.matchMedia({
        "(min-width: 769px)": function() {
            gsap.to("#inforightwrapper", {
                scrollTrigger: {
                    trigger: "#projectinfo",
                    start: "top top+=5%",
                    end: "bottom center-+=200",
                    endTrigger: ".lastdiv",
                    pin: true,
                    scrub: true,
                    // markers: true,
                },
                y: "-70%",
            });
        }
    });

    const footer = document.querySelector("#footer");
    const lastCard = document.querySelector(".card.scroll");
    const pinnedSections = gsap.utils.toArray(".pinned");

    ScrollTrigger.matchMedia({
        // Desktop: Pinning animation
        "(min-width: 769px)": function() {
            if (footer && lastCard && pinnedSections.length > 0) {
                pinnedSections.forEach((section, index, sections) => {
                    let img = section.querySelector(".img");
                    let nextSection = sections[index + 1] || lastCard;
                    let endScalePoint = `top+=${
                        nextSection.offsetTop - section.offsetTop
                    } top`;

                    gsap.to(section, {
                        scrollTrigger: {
                            trigger: section,
                            start: "top top",
                            end: () => footer.offsetTop - window.innerHeight,
                            scrub: 1,
                            pin: true,
                            pinSpacing: false,
                            anticipatePin: 1,
                            invalidateOnRefresh: true,
                        },
                    });

                    if (img) {
                        // Ensure GSAP handles the centering transform
                        gsap.set(img, { xPercent: -50, yPercent: -50 });
                        
                        gsap.fromTo(
                            img,
                            { scale: 1, xPercent: -50, yPercent: -50 },
                            {
                                scale: 0.5,
                                xPercent: -50, // Maintain centering
                                yPercent: -50, // Maintain centering
                                ease: "power1.inOut",
                                scrollTrigger: {
                                    trigger: section,
                                    start: "top top",
                                    end: endScalePoint,
                                    scrub: 1,
                                },
                            }
                        );
                    }
                });
            }
        },

        // Mobile: 3D Coverflow Slider
        "(max-width: 768px)": function() {
             // Project Info Animation (Keep this)
             gsap.utils.toArray(".infodiv, #projectInfoLogo").forEach(el => {
                 gsap.fromTo(el, 
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1, 
                        y: 0, 
                        duration: 0.8, 
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        }
                    }
                 )
             });

             // 3D Coverflow Logic
             const resultsContainer = document.querySelector("#projectresults");
             const cards = gsap.utils.toArray(".card");

             if (resultsContainer && cards.length > 0) {
                function updateCoverflow() {
                    const containerCenter = window.innerWidth / 2;
                    
                    cards.forEach(card => {
                        const cardRect = card.getBoundingClientRect();
                        const cardCenter = cardRect.left + cardRect.width / 2;
                        const dist = (cardCenter - containerCenter);
                        // Normalize distance based on viewport width
                        const normalizedDist = dist / (window.innerWidth * 0.6); 
                        
                        // Calculate rotation and scale
                        const rotation = normalizedDist * -20; // Rotate slightly
                        const scale = 1 - Math.abs(normalizedDist) * 0.15; // Scale down sides
                        const alpha = 1 - Math.abs(normalizedDist) * 0.4; // Fade out sides
                        const zIndex = 100 - Math.round(Math.abs(normalizedDist) * 10);

                        gsap.set(card, {
                            transformPerspective: 1000,
                            rotationY: rotation,
                            scale: gsap.utils.clamp(0.8, 1, scale),
                            opacity: gsap.utils.clamp(0.3, 1, alpha),
                            zIndex: zIndex,
                            // x: -normalizedDist * 20 // Optional: pull them closer
                        });
                    });
                }

                // Add scroll listener
                resultsContainer.addEventListener("scroll", updateCoverflow);
                window.addEventListener("resize", updateCoverflow);
                
                // Initial call
                updateCoverflow();
                
                // Cleanup function for matchMedia
                return () => {
                    resultsContainer.removeEventListener("scroll", updateCoverflow);
                    window.removeEventListener("resize", updateCoverflow);
                };
             }
        }
    });
});
