// const lenis = new Lenis({
//     duration: 1.2,
//     easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
//     infinite: false,
// });

// function raf(time) {
//     lenis.raf(time);
//     ScrollTrigger.update();
//     requestAnimationFrame(raf);
// }
// requestAnimationFrame(raf);
// make sure whenever the page is reloaded, the scroll position is at the top
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

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
                opacity: 0.2,
                display: "block",
                duration: 0.8,
                ease: Power2.easeInOut,
                delay: 0.3,
            });

            loader.classList.add("fade-out");
            setTimeout(() => {
                loader.style.display = "none";
            }, 1000);
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
                left: "10%",
                top: "10%",
                duration: 0.8,
                ease: "Power1.easeOut",
                opacity: 0.2,
            },
            "<"
        )
        .to(
            svg2,
            {
                opacity: 0,
                duration: 0.8,
                ease: "Power1.easeOut",
            },
            "<"
        )
        .to(
            svg3,
            {
                right: "10%",
                bottom: "17%",
                duration: 0.8,
                ease: "Power1.easeOut",
                opacity: 0.2,
            },
            "<"
        );
})();

// Hero section initial animation
function heroSectionAnimation() {
    let herotl = gsap.timeline({
        delay: 1.5,
    });

    herotl.fromTo(
        "#nav",
        {
            y: "-100",
            opacity: 0,
        },
        {
            y: "0",
            opacity: 1,
            duration: 1,
            ease: "power1.out",
            // delay: 4
        }
    );

    // Animate hero tag reveal
    herotl.fromTo(
        "#herotext .tag",
        {
            paddingLeft: "0.9rem",
            paddingRight: "0.9rem",
        },
        {
            paddingLeft: "2rem",
            paddingRight: "2rem",
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => {
                document
                    .querySelector("#herotext .tag")
                    .classList.add("revealed");
            },
        },
        "-=0.3"
    );

    herotl.fromTo(
        "#herotext h1",
        {
            y: 30,
            opacity: 0,
        },
        {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power1.out",
            stagger: 0.2,
        },
        "-=0.5"
    );
    herotl.fromTo(
        "#herotext > p",
        {
            y: 15,
            opacity: 0,
        },
        {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power1.out",
        },
        "-=0.5"
    );
    herotl.fromTo(
        "#herotext .btnelem",
        {
            y: 15,
            opacity: 0,
        },
        {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power1.out",
        },
        "-=0.3"
    );
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
        end: "20% top",
        scrub: true,
        // markers: true,
    },
});

// Only apply horizontal text movement on desktop
if (window.innerWidth > 768) {
    tl.to(
        ".h1one",
        {
            x: -50,
            ease: Power1.easeInOut,
        },
        "<"
    );
    tl.to(
        ".h1two",
        {
            x: 50,
            ease: Power1.easeInOut,
        },
        "<"
    );
}

tl.to(
    "#herovid",
    {
        width: window.innerWidth > 768 ? "90%" : "95%",
        ease: Power1.easeInOut,
    },
    "<"
);

if (window.innerWidth > 768) {
    function serviceHorizontalScroll() {
        let serviceStrip = document.querySelector("#servcardstrip");

        let hortl = gsap.timeline({
            scrollTrigger: {
                trigger: "#servcardstrip",
                start: "center 60%",
                end: "center 0%",
                pin: "#services",
                markers: true,
                scrub: 1,
                invalidateOnRefresh: true,
                // ease: "Power1.out",

            },
            onComplete: () => {
                gsap.set("#main", {
                    backgroundColor: "var(--green-color)",
                    // delay: 0.2,
                });
            }
        });
        hortl.to(
            "#main",
            {
                backgroundColor: "var(--primary-black-color)",
            },
            "<"
        );
        hortl.to(
            "#servcardstrip",
            {
                x: () => -(serviceStrip.scrollWidth - window.innerWidth),
                // ease: "none",
            },
            "<"
        );
        // hortl.to("#main", {
        //     backgroundColor: "var(--green-color)",
        //     // delay: 0.2,
        // });
    }
    serviceHorizontalScroll();
}

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

// About heading word-by-word animation
(() => {
    const aboutHeading = document.querySelector("#about #ableft h1");
    if (
        !aboutHeading ||
        typeof gsap === "undefined" ||
        typeof ScrollTrigger === "undefined"
    )
        return;

    // Split text into words
    const words = aboutHeading.textContent.trim().split(/\s+/);
    aboutHeading.innerHTML = words
        .map((w) => `<span class="word">${w}&nbsp;</span>`)
        .join("");

    // Set initial state
    gsap.set("#about #ableft h1 .word", {
        opacity: 0,
        y: 20,
    });

    // Animate on scroll
    ScrollTrigger.create({
        trigger: "#about",
        start: "top 75%",
        onEnter: () => {
            gsap.to("#about #ableft h1 .word", {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out",
                stagger: 0.05,
            });
        },
        once: true,
    });
})();
