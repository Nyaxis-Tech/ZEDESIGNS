
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
