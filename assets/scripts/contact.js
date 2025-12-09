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

    // --- Form Section Reveal ---
    gsap.from('.contact-form-section', {
        scrollTrigger: {
            trigger: '#contact-content',
            start: "top 75%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    });

    // --- Info Section Tag Reveal (matching landing page) ---
    const infoTag = document.querySelector(' .tag');
    if (infoTag) {
        ScrollTrigger.create({
            trigger: '.contact-info-section',
            start: 'top 80%',
            onEnter: () => {
                gsap.fromTo(
                    infoTag,
                    {},
                    {
                        duration: 0.6,
                        ease: "power2.out",
                        onComplete: () => {
                            infoTag.classList.add("revealed");
                        }
                    }
                );
            },
            once: true,
        });
    }

    // --- Video Column Reveal ---
    gsap.from('.video-wrapper', {
        scrollTrigger: {
            trigger: '.info-video-col',
            start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    });

    // --- Info Blocks Stagger ---
    gsap.from('.info-block', {
        scrollTrigger: {
            trigger: '.info-details-col',
            start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
    });

    // --- Video Parallax ---
    if (document.querySelector('.video-wrapper video')) {
        gsap.to('.video-wrapper video', {
            scrollTrigger: {
                trigger: '.video-wrapper',
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            },
            scale: 1.15,
            ease: "none"
        });
    }

    // --- Form Submit Handler ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            console.log('Form Data:', data);
            
            // Success animation
            gsap.to('.contact-form-section', {
                scale: 0.99,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    contactForm.reset();
                    alert('Thank you! We\'ll be in touch within 24 hours.');
                }
            });
        });
    }
});