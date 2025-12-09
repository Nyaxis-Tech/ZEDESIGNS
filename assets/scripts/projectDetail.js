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
        window.location.href = './projects.html';
        return;
    }

    // Populate Hero Section
    document.getElementById('project-title').textContent = project.name;
    document.getElementById('project-tagline').textContent = project.tagLine;
    document.getElementById('hero-image').src = project.bannerImage;
    document.getElementById('hero-image').alt = project.name + " Banner";

    // Populate Specs Strip
    document.getElementById('spec-services').textContent = project.tags.slice(0, 2).join(', ');
    document.getElementById('spec-location').textContent = project.location || "KSA";
    document.getElementById('spec-industry').textContent = project.industry || "General";
    document.getElementById('spec-year').textContent = project.year || "2024";

    // --- Layout Construction ---
    const projectContainer = document.getElementById('project-container');
    const bentoGrid = document.getElementById('bento-grid'); // This is our anchor for the end
    
    // Helper: Create Split Section
    const createSplitSection = (title, contentHTML) => {
        const section = document.createElement('div');
        section.className = 'split-section';
        
        const left = document.createElement('div');
        left.className = 'split-left';
        const h2 = document.createElement('h2');
        h2.textContent = title;
        left.appendChild(h2);
        
        const right = document.createElement('div');
        right.className = 'split-right';
        right.innerHTML = contentHTML;
        
        section.appendChild(left);
        section.appendChild(right);
        
        return section;
    };

    // Helper: Create Image
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

    // Helper: Create Video
    const createVideo = (src, className = '') => {
        const container = document.createElement('div');
        container.className = `grid-item image-container ${className}`;
        
        const inner = document.createElement('div');
        inner.className = 'parallax-inner';

        const video = document.createElement('video');
        video.src = src;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        
        inner.appendChild(video);
        container.appendChild(inner);
        return container;
    };

    // Helper: Create Challenge/Solution Column
    const createCSColumn = (title, content) => {
        const col = document.createElement('div');
        col.className = 'cs-col';
        
        const h3 = document.createElement('h3');
        h3.textContent = title;
        col.appendChild(h3);
        
        const wrapper = document.createElement('div');
        wrapper.className = 'read-more-wrapper';
        
        const p = document.createElement('p');
        p.textContent = content;
        wrapper.appendChild(p);
        
        const fade = document.createElement('div');
        fade.className = 'fade-overlay';
        wrapper.appendChild(fade);
        
        col.appendChild(wrapper);
        
        // Read More Button
        if (content.length > 150) {
            const btn = document.createElement('button');
            btn.className = 'read-more-trigger';
            btn.innerHTML = '<span>Read More</span>';
            
            btn.addEventListener('click', () => {
                col.classList.toggle('is-expanded');
                btn.innerHTML = col.classList.contains('is-expanded') 
                    ? '<span>Read Less</span>' 
                    : '<span>Read More</span>';
            });
            col.appendChild(btn);
        } else {
            wrapper.style.maxHeight = 'none';
            fade.style.display = 'none';
        }
        
        return col;
    };

    // 1. Cinematic Opener (Image 0) - NOW FIRST
    if (project.images[0]) {
        // We wrap it in a div to ensure it behaves as a block in the main container
        const openerWrapper = document.createElement('div');
        openerWrapper.style.width = '95%';
        openerWrapper.style.margin = '0 auto 60px auto';
        openerWrapper.appendChild(createImage(project.images[0], 'span-full'));
        projectContainer.insertBefore(openerWrapper, bentoGrid);
    }

    // 2. Split Overview Section - NOW SECOND
    const overviewHTML = `<p>${project.overview}</p>`;
    const overviewSection = createSplitSection('Overview', overviewHTML);
    projectContainer.insertBefore(overviewSection, bentoGrid);

    // 3. Random Grid (Images 1-4)
    const randomGrid = document.createElement('div');
    randomGrid.className = 'random-grid';
    
    // Use next 4 images
    const midBatch = project.images.slice(1, 5);
    
    midBatch.forEach((src, index) => {
        let span = 'span-full';
        // Layout Logic:
        // 0: Full
        // 1: Half
        // 2: Half
        // 3: Full
        if (index === 1 || index === 2) span = 'span-half';
        
        randomGrid.appendChild(createImage(src, span));
    });
    projectContainer.insertBefore(randomGrid, bentoGrid);

    // 4. Challenge & Solution (Two Columns)
    const csSection = document.createElement('div');
    csSection.className = 'challenge-solution-section';
    
    // Left: Solution
    const solutionCol = createCSColumn('The Solution', project.solution);
    // Right: Challenge
    const challengeCol = createCSColumn('The Challenge', project.challenge);
    
    csSection.appendChild(solutionCol);
    csSection.appendChild(challengeCol);
    
    projectContainer.insertBefore(csSection, bentoGrid);

    // 5. Bento Grid (Remaining Images)
    const remainingImages = project.images.slice(5);
    
    // Helper: Create Text Image Section
    const createTextImageSection = (text, imgSrc) => {
        const container = document.createElement('div');
        container.className = 'grid-item span-full text-image-section';
        
        const left = document.createElement('div');
        left.className = 'text-image-left';
        const p = document.createElement('p');
        p.textContent = text;
        left.appendChild(p);
        
        const right = document.createElement('div');
        right.className = 'text-image-right';
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = "Project Detail";
        img.loading = "lazy";
        right.appendChild(img);
        
        container.appendChild(left);
        container.appendChild(right);
        
        return container;
    };

    remainingImages.forEach((src, index) => {
        // Insert Text Image Section after 3rd image in this loop (which is 8th image overall: 0+1+4+3 = 8)
        // remainingImages starts at index 5.
        // index 0 -> image 5
        // index 1 -> image 6
        // index 2 -> image 7
        // index 3 -> image 8
        // So we insert AFTER index 3.
        
        if (index === 4 && project.textImage) {
             bentoGrid.appendChild(createTextImageSection(project.textImage.text, project.textImage.imagesrc));
        }

        // Mosaic Pattern
        let span = 'span-one-third';
        const pattern = index % 5;
        
        if (pattern === 0) span = 'span-two-thirds';
        else if (pattern === 1) span = 'span-one-third';
        else if (pattern === 2) span = 'span-one-third';
        else if (pattern === 3) span = 'span-two-thirds';
        else if (pattern === 4) span = 'span-full';

        if (index === remainingImages.length - 1 && pattern !== 4) {
            span = 'span-full';
        }

        // Check for video replacement on the last item
        if (index === remainingImages.length - 1 && project.video && project.video.length > 0) {
             bentoGrid.appendChild(createVideo(project.video[0], span));
        } else {
             bentoGrid.appendChild(createImage(src, span));
        }
    });

    // Setup Next Project Link
    const nextId = project.id === projectsData.length ? 1 : project.id + 1;
    const nextProject = projectsData.find(p => p.id === nextId);
    if (nextProject) {
        const nextNav = document.getElementById('next-project-nav');
        document.getElementById('next-project-name').textContent = nextProject.name;
        document.getElementById('next-project-link').href = `./projectDetails.html?id=${nextId}`;
        
        if (nextProject.bannerImage) {
            nextNav.style.backgroundImage = `url('${nextProject.bannerImage}')`;
        }
    }

    // --- Animations ---
    gsap.registerPlugin(ScrollTrigger);

    // Hero
    const tl = gsap.timeline();
    tl.from('#hero-image', { scale: 1.1, duration: 1.5, ease: "power2.out" })
      .from('#project-title', { y: 50, opacity: 0, duration: 1, ease: "power3.out" }, "-=1")
      .from('#project-tagline', { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.8");

    // Specs
    gsap.from('.spec-item', {
        scrollTrigger: { trigger: '#specs-strip', start: "top 95%" },
        y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out"
    });

    // Split Sections & CS Section
    const textSections = gsap.utils.toArray('.split-section, .challenge-solution-section');
    textSections.forEach(section => {
        gsap.from(section.children, {
            scrollTrigger: { trigger: section, start: "top 85%" },
            y: 30, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out"
        });
    });

    // Images
    gsap.utils.toArray('.image-container').forEach(container => {
        // gsap.from(container, {
        //     scrollTrigger: { trigger: container, start: "top 85%" },
        //     y: 0, opacity: 0, duration: 1, ease: "power2.out"
        // });

        const inner = container.querySelector('.parallax-inner');
        if (inner) {
            gsap.set(inner, { scale: 1.1 });
            gsap.to(inner, {
                scrollTrigger: {
                    trigger: container,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                },
                yPercent: 10,
                ease: "none"
            });
        }
    });

});
