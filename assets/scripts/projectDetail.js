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
    
    let project = projectsData.find(p => p.name === "SanBun"); // Change "SanBun" to the desired project name
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
        gsap.to(heroImg, {
            "--mask-bg-alpha": 0, // Fade out the solid background
            maskSize: "50%, 100% 100%", // Shrink logo to 30%
            webkitMaskSize: "50%, 100% 100%",
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: "#heroimg",
                start: "top+=100 center",
                end: "+=250",
                scrub: 1,
            },
        });
    }

    // Pin the right information wrapper while scrolling through project info
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

    const footer = document.querySelector("#footer");
    const lastCard = document.querySelector(".card.scroll");
    const pinnedSections = gsap.utils.toArray(".pinned");

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
                gsap.fromTo(
                    img,
                    { scale: 1 },
                    {
                        scale: 0.5,
                        ease: Power1.easeInOut,
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
});
