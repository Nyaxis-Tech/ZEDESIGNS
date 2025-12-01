// Navbar scroll effect
const nav = document.getElementById("nav");
const whatsappFloat = document.getElementById("whatsappFloat");

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        nav.classList.add("scrolled");
    } else {
        nav.classList.remove("scrolled");
    }

    // Show/hide WhatsApp float button
    if (window.scrollY > 300) {
        whatsappFloat.classList.add("show");
    } else {
        whatsappFloat.classList.remove("show");
    }
});


// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const closeMenu = document.getElementById('closeMenu');
const mobileMenu = document.getElementById('mobileMenu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
let isMenuOpen = false;

// GSAP timeline for menu animation
const menuTimeline = gsap.timeline({ paused: true });

// Set initial state
gsap.set(mobileMenu, { opacity: 0, visibility: 'hidden' });
gsap.set('.mobile-nav-link', { opacity: 0, y: 30 });
gsap.set('.mobile-menu-footer', { opacity: 0, y: 20 });
gsap.set('.close-menu', { opacity: 0, scale: 0.8, rotation: -90 });

// Build menu animation timeline
menuTimeline
    .to(mobileMenu, {
        opacity: 1,
        visibility: 'visible',
        duration: 0.3,
        ease: 'power2.inOut'
    })
    .to('.close-menu', {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.4,
        ease: 'back.out(1.7)'
    }, '-=0.1')
    .to('.mobile-nav-link', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power3.out'
    }, '-=0.2')
    .to('.mobile-menu-footer', {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out'
    }, '-=0.3');


// Toggle menu function
function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    
    if (isMenuOpen) {
        menuToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
        menuTimeline.play();
    } else {
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
        menuTimeline.reverse();
    }
}

// Event listeners
menuToggle.addEventListener('click', toggleMenu);
closeMenu.addEventListener('click', toggleMenu);

// Close menu when clicking on nav links
mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (isMenuOpen) {
            toggleMenu();
        }
    });
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
        toggleMenu();
    }
});

// Reveal animation for sections with .reveal class
(() => {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

    gsap.utils.toArray(".reveal").forEach((el) => {
        // Skip about section to prevent conflicts with frame animation
        if (el.id === "about") return;
        
        ScrollTrigger.create({
            trigger: el,
            start: "top 55%",
            onEnter: () => {
                gsap.to(el, {
                    opacity: 1,
                    y: 0,
                    duration: 1.5,
                    ease: "power2.out",
                });
                
                let aboutvid = el.querySelector("video");
                if (aboutvid) {
                    // console.log("Animating about video");
                    gsap.fromTo(aboutvid,{
                        opacity: 0,
                        scale: 0.6,
                    },{
                        opacity: 1,
                        scale: 1,
                        duration: 1.5,
                        ease: "power2.out",
                        delay: 0.5

                    })
                }
                // Animate tag reveal in testimonials section
                const tag = el.querySelector('.tag');
                if (tag) {
                    gsap.fromTo(
                        tag,
                        {
                            // paddingLeft: "0.9rem",
                            // paddingRight: "0.9rem",
                        },
                        {
                            // paddingLeft: "1rem",
                            // paddingRight: "1rem",
                            duration: 0.6,
                            ease: "power2.out",
                            delay: 0.3,
                            onComplete: () => {
                                tag.classList.add("revealed");
                            }
                        }
                    );
                }
            },
            once: true,

        });
    });
})();


// Footer tag reveal animation
(() => {
    const footerTag = document.querySelector('#footer .tag');
    if (!footerTag || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    ScrollTrigger.create({
        trigger: '#footer',
        start: 'top 85%',
        onEnter: () => {
            gsap.fromTo(
                footerTag,
                {
                    // paddingLeft: "0.9rem",
                    // paddingRight: "0.9rem",
                },
                {
                    // paddingLeft: "1rem",
                    // paddingRight: "1rem",
                    duration: 0.6,
                    ease: "power2.out",
                    onComplete: () => {
                        footerTag.classList.add("revealed");
                    }
                }
            );
        },
        once: true,
    });
})();
