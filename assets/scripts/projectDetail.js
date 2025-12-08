import { projectsData } from './projectData.js';

document.addEventListener('DOMContentLoaded', () => {

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

    // Get project ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = parseInt(urlParams.get('id'));

    // Find project data
    const project = projectsData.find(p => p.id === projectId);

    if (!project) {
        // Redirect to projects page if not found
        window.location.href = './projects.html';
        return;
    }

    // Populate Hero Section
    document.getElementById('project-title').textContent = project.name;
    document.getElementById('project-tagline').textContent = project.tagLine;
    document.getElementById('hero-image').src = project.bannerImage;
    document.getElementById('hero-image').alt = project.name + " Banner";

    // Populate Specs Strip
    document.getElementById('spec-services').textContent = project.tags.slice(0, 2).join(', '); // Show first 2 tags
    document.getElementById('spec-location').textContent = project.location || "KSA";
    document.getElementById('spec-industry').textContent = project.industry || "General";
    document.getElementById('spec-year').textContent = project.year || "2024";

    // Populate Bento Grid
    const gridContainer = document.getElementById('bento-grid');
    
    // Helper: Create a clean text block with Read More
    const createReadMoreBlock = (title, content, className = '') => {
        const block = document.createElement('div');
        block.className = `grid-item text-block ${className}`;
        
        const h3 = document.createElement('h3');
        h3.textContent = title;
        
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'read-more-wrapper';
        
        const p = document.createElement('p');
        p.textContent = content;
        contentWrapper.appendChild(p);

        // Fade Overlay
        const fade = document.createElement('div');
        fade.className = 'fade-overlay';
        contentWrapper.appendChild(fade);
        
        block.appendChild(h3);
        block.appendChild(contentWrapper);

        // Only add button if text is long enough
        if (content.length > 250) {
            const btn = document.createElement('button');
            btn.className = 'read-more-trigger';
            btn.innerHTML = '<span>Read More</span> <i class="arrow-icon">↓</i>';
            
            btn.addEventListener('click', () => {
                const isExpanded = block.classList.contains('is-expanded');
                
                if (isExpanded) {
                    block.classList.remove('is-expanded');
                    btn.innerHTML = '<span>Read More</span> <i class="arrow-icon">↓</i>';
                } else {
                    block.classList.add('is-expanded');
                    btn.innerHTML = '<span>Read Less</span> <i class="arrow-icon">↑</i>';
                }
            });
            block.appendChild(btn);
        } else {
            // If short, remove collapsed state styling
            contentWrapper.style.maxHeight = 'none';
            fade.style.display = 'none';
        }
        
        return block;
    };

    // Helper: Create a massive image with Parallax Wrapper
    const createImage = (src, className = '') => {
        const container = document.createElement('div');
        container.className = `grid-item image-container ${className}`;
        
        const inner = document.createElement('div');
        inner.className = 'parallax-inner';

        const img = document.createElement('img');
        img.src = src;
        img.alt = project.name + " Visual";
        img.loading = "lazy";
        
        inner.appendChild(img);
        container.appendChild(inner);
        return container;
    };

    // --- Magazine Layout Strategy (Refined Flow) ---
    
    // 1. "Cinematic Opener" - Full Width Image (Visuals First!)
    if (project.images[0]) {
        gridContainer.appendChild(createImage(project.images[0], 'span-full cinematic-opener'));
    }

    // 2. The "Magazine Spread" Intro - Two Columns of Text
    // Now appearing AFTER the first visual impact
    // We append directly to grid for perfect alignment
    const overviewBlock = createReadMoreBlock('The Vision', project.overview, 'span-half');
    const challengeBlock = createReadMoreBlock('The Challenge', project.challenge, 'span-half');
    
    gridContainer.appendChild(overviewBlock);
    gridContainer.appendChild(challengeBlock);

    // 3. "Visual Dialogue" - Two Tall Images Side-by-Side
    if (project.images[1] && project.images[2]) {
        gridContainer.appendChild(createImage(project.images[1], 'span-half tall-visual'));
        gridContainer.appendChild(createImage(project.images[2], 'span-half tall-visual'));
    }

    // 4. "The Anchor" - Full Width Image (New Request)
    // We use image[3] if available
    if (project.images[3]) {
        gridContainer.appendChild(createImage(project.images[3], 'span-full anchor-visual'));
    }

    // 5. "The Execution" - Left Aligned Text Block (Shifted Down)
    // User requested "left end", so we use span-two-thirds.
    const executionBlock = createReadMoreBlock('The Execution', project.solution, 'span-two-thirds');
    gridContainer.appendChild(executionBlock);

    // Add spacer to prevent dense grid from pulling items up
    // This ensures the next row starts fresh with the Big/Small pattern
    const spacer = document.createElement('div');
    spacer.className = 'grid-item span-one-third spacer-block';
    gridContainer.appendChild(spacer);

    // 6. "Mosaic Gallery" - Complex Grid Pattern
    // We start from index 4 (since 0,1,2,3 are used)
    const remainingImages = project.images.slice(4);
    
    remainingImages.forEach((imgSrc, index) => {
        let spanClass = 'span-one-third'; // Default
        
        // Pattern: 
        // 0: Big (8 cols)
        // 1: Small (4 cols)
        // 2: Small (4 cols)
        // 3: Big (8 cols)
        // 4: Full (12 cols)
        
        const patternIndex = index % 5;
        
        if (patternIndex === 0) spanClass = 'span-two-thirds';
        else if (patternIndex === 1) spanClass = 'span-one-third';
        else if (patternIndex === 2) spanClass = 'span-one-third';
        else if (patternIndex === 3) spanClass = 'span-two-thirds';
        else if (patternIndex === 4) spanClass = 'span-full';

        // Edge case: Last image should be full if it's hanging
        if (index === remainingImages.length - 1 && patternIndex !== 4) {
             spanClass = 'span-full';
        }

        gridContainer.appendChild(createImage(imgSrc, spanClass));
    });

    // Setup Next Project Link
    const nextId = project.id === projectsData.length ? 1 : project.id + 1;
    const nextProject = projectsData.find(p => p.id === nextId);
    if (nextProject) {
        const nextNav = document.getElementById('next-project-nav');
        document.getElementById('next-project-name').textContent = nextProject.name;
        document.getElementById('next-project-link').href = `./projectDetails.html?id=${nextId}`;
        
        // Set Background Image if available
        if (nextProject.bannerImage) {
            nextNav.style.backgroundImage = `url('${nextProject.bannerImage}')`;
        }
    }

    // GSAP Animations
    gsap.registerPlugin(ScrollTrigger);

    // Hero Animation
    const tl = gsap.timeline();
    tl.from('#hero-image', { scale: 1.1, duration: 1.5, ease: "power2.out" })
      .from('#project-title', { y: 50, opacity: 0, duration: 1, ease: "power3.out" }, "-=1")
      .from('#project-tagline', { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.8");

    // Fresh Specs Animation (Staggered Reveal)
    gsap.from('.spec-item', {
        scrollTrigger: {
            trigger: '#specs-strip',
            start: "top 95%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.7)" // A slight "pop" for freshness
    });

    // Image Reveal & Parallax Animation
    gsap.utils.toArray('.image-container').forEach(container => {
        // Reveal Container
        gsap.from(container, {
            scrollTrigger: {
                trigger: container,
                start: "top 85%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        });

        // Parallax Inner
        const inner = container.querySelector('.parallax-inner');
        if (inner) {
            gsap.set(inner, { scale: 1.05 }); // Zoom in initially
            
            gsap.to(inner, {
                scrollTrigger: {
                    trigger: container,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                },
                yPercent: 15, // Move content down relative to container
                ease: "Power2.easeInOut"
            });
        }
    });

    // Text Reveal Animation
    gsap.utils.toArray('.text-block').forEach(text => {
        gsap.from(text, {
            scrollTrigger: {
                trigger: text,
                start: "top 80%",
            },
            y: 30,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        });
    });
});
