import { projectsData } from './projectData.js';

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

    /* ==========================
       HERO ANIMATIONS
       ========================== */

    const heroTl = gsap.timeline({ delay: 0.3 });
    
    heroTl
        .from('.services-hero-content .tag', {
            y: 30,
            duration: 0.8,
            ease: 'power2.out',
            onComplete: () => {
                document.querySelector('.services-hero-content .tag')?.classList.add('revealed');
            }
        })
        .from('.services-hero-content h1', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        }, '-=0.5')
        .from('.services-hero-content > p', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        }, '-=0.6');

    /* ==========================
       SERVICE ROWS ANIMATIONS
       ========================== */

    const serviceRows = document.querySelectorAll('.service-row');

    serviceRows.forEach((row, index) => {
        const borderTop = row.querySelector('.service-border-top');
        const serviceName = row.querySelector('.service-name');
        const serviceDesc = row.querySelector('.service-desc');
        const serviceSubs = row.querySelector('.service-subs');

        // Set initial states
        gsap.set(borderTop, { scaleX: 0, transformOrigin: 'left' });

        // Create timeline for each row
        const rowTl = gsap.timeline({
            scrollTrigger: {
                trigger: row,
                start: 'top 75%',
                toggleActions: 'play none none none',
            }
        });

        // Animate border draw-in
        rowTl
            .to(borderTop, {
                scaleX: 1,
                duration: 1.2,
                ease: 'power2.inOut'
            })
            // Stagger content columns
            .from([serviceName, serviceDesc, serviceSubs], {
                y: 60,
                opacity: 0,
                duration: 0.9,
                stagger: 0.15,
                ease: 'power3.out'
            }, '-=0.8');

        // Parallax effect on service name
        gsap.to(serviceName, {
            scrollTrigger: {
                trigger: row,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            },
            y: -30,
            ease: 'none'
        });
    });

    // Bottom border for last service
    const lastBorder = document.querySelector('.service-border-bottom');
    if (lastBorder) {
        gsap.set(lastBorder, { scaleX: 0, transformOrigin: 'left' });
        gsap.to(lastBorder, {
            scrollTrigger: {
                trigger: lastBorder,
                start: 'top 90%',
            },
            scaleX: 1,
            duration: 1.2,
            ease: 'power2.inOut'
        });
    }

    /* ==========================
       SUB-SERVICE EXPANDABLES
       ========================== */

    const expandBtns = document.querySelectorAll('.expand-btn');

    expandBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const subServiceItem = btn.closest('.sub-service-item');
            const content = subServiceItem.querySelector('.sub-service-content');
            const isExpanded = subServiceItem.classList.contains('expanded');

            if (isExpanded) {
                // Collapse
                gsap.to(content, {
                    height: 0,
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        subServiceItem.classList.remove('expanded');
                    }
                });
            } else {
                // Expand
                subServiceItem.classList.add('expanded');
                
                // Get natural height
                content.style.height = 'auto';
                const height = content.offsetHeight;
                content.style.height = '0';

                gsap.to(content, {
                    height: height,
                    opacity: 1,
                    duration: 0.4,
                    ease: 'power2.out',
                    onComplete: () => {
                        content.style.height = 'auto';
                    }
                });

                // Icon rotation
                const icon = btn.querySelector('.plus-icon');
                gsap.to(icon, {
                    rotation: 45,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });

        // Also make the header clickable
        const header = btn.closest('.sub-service-header');
        header.addEventListener('click', (e) => {
            if (e.target !== btn && !btn.contains(e.target)) {
                btn.click();
            }
        });
    });

    /* ==========================
       FEATURED PROJECTS
       ========================== */

    // Inject projects from projectsData
    const projectsGrid = document.querySelector('.projects-grid');
    
    // Check if projectsData is available
    if (typeof projectsData !== 'undefined' && projectsData.length > 0) {
        // Get first 4 projects from projectsData
        const featuredProjects = projectsData.slice(0, 4);

        featuredProjects.forEach((project, index) => {
            const projectItem = document.createElement('div');
            projectItem.className = 'project-item';
            projectItem.innerHTML = `
                <div class="project-image-wrapper">
                    <img src="${project.bannerImage}" alt="${project.name}">
                </div>
                <div class="project-info">
                    <h3>${project.name}</h3>
                </div>
            `;

            // Click to navigate to project details
            projectItem.addEventListener('click', () => {
                window.location.href = `./projectDetails.html?id=${project.id}`;
            });

            projectsGrid.appendChild(projectItem);
        });

        // Animate project items after they're added to DOM
        setTimeout(() => {
            const projectItems = document.querySelectorAll('.project-item');
            projectItems.forEach((item, index) => {
                gsap.from(item, {
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 85%',
                    },
                    scale: 0.95,
                    opacity: 0,
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: 'power3.out'
                });

                // Hover animation for image
                const img = item.querySelector('img');
                item.addEventListener('mouseenter', () => {
                    gsap.to(img, {
                        scale: 1.05,
                        duration: 0.6,
                        ease: 'power2.out'
                    });
                });

                item.addEventListener('mouseleave', () => {
                    gsap.to(img, {
                        scale: 1,
                        duration: 0.6,
                        ease: 'power2.out'
                    });
                });
            });
        }, 100);
    } else {
        console.error('projectsData is not available');
    }

    /* ==========================
       FEATURED SECTION TITLE ANIMATION
       ========================== */

    gsap.from('#featured-projects h2', {
        scrollTrigger: {
            trigger: '#featured-projects',
            start: 'top 80%',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
    });
});