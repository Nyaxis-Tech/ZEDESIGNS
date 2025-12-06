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

gsap.registerPlugin(ScrollTrigger);

// Hero Section Image Animation
const heroImg = document.querySelector("#heroimg img");
// You can change this path dynamically for each project
// Using encodeURI to handle spaces safely
const maskImagePath = "../assets/images/home/PNGS/ZEDESIGNS%20Client%20Logos-03.png"; 

if (heroImg) {
    // Define the solid mask layer (fades out)
    const solidMask = "linear-gradient(rgba(0,0,0,var(--mask-bg-alpha, 1)), rgba(0,0,0,var(--mask-bg-alpha, 1)))";
    
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
        webkitMaskSize: "100%, 100% 100%"
    });

    // Animate the mask
    gsap.to(heroImg, {
        "--mask-bg-alpha": 0, // Fade out the solid background
        maskSize: "50%, 100% 100%", // Shrink logo to 30%
        webkitMaskSize: "50%, 100% 100%",
        ease: "power2.inOut",
        scrollTrigger: {
            trigger: "#heroimg",
            start: "top center",
            end: "+=350",
            scrub: 1,
            // markers: true
        }
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
    y: "-65%"
})

const footer = document.querySelector("#footer");
const lastCard = document.querySelector(".card.scroll");
const pinnedSections = gsap.utils.toArray(".pinned");

if (footer && lastCard && pinnedSections.length > 0) {
    pinnedSections.forEach((section, index, sections) => {
        let img = section.querySelector(".img");
        let nextSection = sections[index + 1] || lastCard;
        let endScalePoint = `top+=${nextSection.offsetTop - section.offsetTop} top`;

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
            }
        });

        if (img) {
            gsap.fromTo(img, { scale: 1 }, {
                scale: 0.5,
                ease: Power1.easeInOut,
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: endScalePoint,
                    scrub: 1
                }
            });
        }
    });
}