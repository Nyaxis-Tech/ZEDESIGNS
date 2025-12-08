document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lenis Smooth Scroll
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

    // Register GSAP
    gsap.registerPlugin(ScrollTrigger);

    // --- Hero Animations ---
    const tl = gsap.timeline();

    tl.from('#hero-image', {
        scale: 1.1,
        opacity: 0,
        duration: 1.5,
        ease: "power2.out"
    })
    .from('#contact-title', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    }, "-=1")
    .from('#contact-tagline', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    }, "-=0.8");

    // --- Form Reveal ---
    gsap.from('.left-col', {
        scrollTrigger: {
            trigger: '#contact-split',
            start: "top 80%",
        },
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    });

    // --- Priority Card Reveal (The Focus Shift) ---
    gsap.from('.priority-card', {
        scrollTrigger: {
            trigger: '.right-col',
            start: "top 70%",
        },
        x: 50,
        opacity: 0,
        duration: 1,
        delay: 0.2, // Slight delay to let user see form first
        ease: "back.out(1.7)" // Pop effect
    });

    // --- Parallax for Aesthetic Image ---
    gsap.to('.aesthetic-img', {
        scrollTrigger: {
            trigger: '.right-col',
            start: "top bottom",
            end: "bottom top",
            scrub: true
        },
        yPercent: 20,
        ease: "none"
    });
});