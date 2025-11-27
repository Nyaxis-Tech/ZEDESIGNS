const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

function raf(time) {
    lenis.raf(time);
    ScrollTrigger.update();
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Navbar scroll effect
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        nav.classList.add("scrolled");
    } else {
        nav.classList.remove("scrolled");
    }
});


// Loading Animation
(() => {
    const loader = document.getElementById("loader");
    const svg1 = document.querySelector(".loader-svg-1");
    const svg2 = document.querySelector(".loader-svg-2");
    const svg3 = document.querySelector(".loader-svg-3");

    const path1 = svg1.querySelector("path");
    const path2 = svg2.querySelector("path");
    const path3 = svg3.querySelector("path");

    const heroDecoSvg1 = document.querySelector(".hero-deco-svg-1");
    const heroDecoSvg3 = document.querySelector(".hero-deco-svg-3");

    // Get actual path lengths
    const length1 = path1.getTotalLength();
    const length2 = path2.getTotalLength();
    const length3 = path3.getTotalLength();

    // Set initial stroke-dasharray and stroke-dashoffset
    gsap.set(path1, {
        strokeDasharray: length1,
        strokeDashoffset: length1,
        scale: 0.95,
        transformOrigin: "center",
    });
    gsap.set(path2, {
        strokeDasharray: length2,
        strokeDashoffset: length2,
        scale: 0.95,
        transformOrigin: "center",
    });
    gsap.set(path3, {
        strokeDasharray: length3,
        strokeDashoffset: length3,
        scale: 0.95,
        transformOrigin: "center",
    });

    // Create timeline
    const loaderTl = gsap.timeline({
        onComplete: () => {
            // Fade out loader
            gsap.to([heroDecoSvg1, heroDecoSvg3], {
                opacity: 0.1,
                display: "block",
                duration: 0.8,
                ease: "power2.easeInOut",
                delay: 0.3,
            });

            loader.classList.add("fade-out");
            setTimeout(() => {
                loader.style.display = "none";
            }, 2000);
        },
    });

    // Step 1: Draw paths with stagger and scale effect
    loaderTl
        .to(path1, {
            strokeDashoffset: 0,
            scale: 1,
            duration: 1,
            ease: "power2.easeInOut",
        })
        .to(
            path2,
            {
                strokeDashoffset: 0,
                scale: 1,
                duration: 1,
                ease: "power2.easeInOut",
            },
            "-=1.2"
        )
        .to(
            path3,
            {
                strokeDashoffset: 0,
                scale: 1,
                duration: 1,
                ease: "power2.easeInOut",
            },
            "-=1.2"
        )
        // Step 2: Fill the paths with glow effect
        .to(
            [path1, path2, path3],
            {
                fill: "#ECCF9C",
                filter: "drop-shadow(0 0 12px rgba(236, 207, 156, 0.6))",
                duration: 0.6,
                ease: "power2.easeInOut",
            },
            "-=0.4"
        )
        .to([path1, path2, path3], {
            filter: "drop-shadow(0 0 0px rgba(236, 207, 156, 0))",
            duration: 0.4,
            ease: "power1.easeOut",
        })
        // Step 3: Animate SVGs to their positions
        .to(
            svg1,
            {
                left: "5%",
                top: "5%",
                duration: 0.8,
                ease: "power2.easeInOut",
                opacity: 0.3,
            },
            "+=0.3"
        )
        .to(
            svg2,
            {
                opacity: 0,
                duration: 0.8,
                ease: "power1.easeInOut",
            },
            "<"
        )
        .to(
            svg3,
            {
                right: "5%",
                bottom: "5%",
                duration: 0.8,
                ease: "power2.easeInOut",
                opacity: 0.3,
            },
            "<"
        );
})();

// Hero section initial animation
function heroSectionAnimation() {
    let herotl = gsap.timeline({
        delay: 2.5,
    });
    
    herotl.fromTo("#nav", {
        y: "-100",
        opacity: 0,
    },{
        y: "0",
        opacity: 1,
        duration: 1,
        ease: "Power1.easeInOut",
        // delay: 4
    });
    
}

heroSectionAnimation();

// register ScrollTrigger plugin with GSAP (safe to call even if already available)
if (typeof gsap !== "undefined" && gsap.registerPlugin) {
    gsap.registerPlugin(ScrollTrigger);
}

let tl = gsap.timeline({
    scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "30% top",
        scrub: true,
        // markers: true,
    },
});

tl.to(
    ".h1one",
    {
        x: -50,
        // duration: 1,
        ease: Power1.easeInOut,
    },
    "<"
);
tl.to(
    ".h1two",
    {
        x: 50,
        // duration: 1,
        ease: Power1.easeInOut,
    },
    "<"
);
tl.to(
    "#herovid",
    {
        width: "90%",
        ease: Power1.easeInOut,
    },
    "<"
);

// Services horizontal scroll animation
let tl2 = gsap.timeline({
    scrollTrigger: {
        trigger: "#services",
        start: "50 top",
        end: "+=0%",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        // markers: true
    },
});

tl2.to(".servcardslist", {
    x: -650,
    ease: "none",
});


// About-section counters: animate numbers when #about enters view
(() => {
    const counters = document.querySelectorAll("#abstat .abstatelem h1");
    if (!counters || counters.length === 0) return;

    let started = false;

    ScrollTrigger.create({
        trigger: "#about",
        start: "top 80%",
        onEnter: () => {
            if (started) return;
            started = true;

            counters.forEach((el) => {
                const txt = el.textContent.trim();
                // extract number and suffix (like +)
                const m = txt.match(/^(\d+[\d,]*)/);
                if (!m) return;
                const target = parseInt(m[0].replace(/,/g, ""), 10) || 0;
                const suffix = txt.slice(m[0].length) || "";

                const obj = { val: 0 };
                gsap.to(obj, {
                    val: target,
                    duration: 2,
                    ease: "power1.out",
                    onUpdate() {
                        const v = Math.floor(obj.val).toLocaleString();
                        el.textContent = v + suffix;
                    },
                });
            });
        },
    });
})();
