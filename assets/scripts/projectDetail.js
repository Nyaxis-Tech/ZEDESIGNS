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

    // Get current language
    const getCurrentLanguage = () => localStorage.getItem('language') || 'ar';
    let currentLang = getCurrentLanguage();
    let projectData = project[currentLang] || project.en;
    let isInitialLoad = true;

    // Function to build all project content
    function buildProjectContent() {
        currentLang = getCurrentLanguage();
        projectData = project[currentLang] || project.en;

        // Populate Hero Section
        document.getElementById('project-title').textContent = projectData.name;
        document.getElementById('project-tagline').textContent = projectData.tagLine;
        document.getElementById('hero-image').src = projectData.bannerImage;
        document.getElementById('hero-image').alt = projectData.name + " Banner";

        // Populate Specs Strip
        const separator = currentLang === 'ar' ? '، ' : ', ';
        document.getElementById('spec-services').textContent = projectData.tags.slice(0, 2).join(separator);
        document.getElementById('spec-location').textContent = projectData.location || "KSA";
        document.getElementById('spec-industry').textContent = projectData.industry || (currentLang === 'ar' ? 'عام' : 'General');
        document.getElementById('spec-year').textContent = projectData.year || "2024";

        // --- Layout Construction ---
        const projectContainer = document.getElementById('project-container');
        const bentoGrid = document.getElementById('bento-grid'); // This is our anchor for the end
        
        // Clear all dynamic content between specs and bento
        const specsStrip = document.getElementById('specs-strip');
        const nextNav = document.getElementById('next-project-nav');
        while (specsStrip.nextElementSibling !== bentoGrid) {
            specsStrip.nextElementSibling.remove();
        }
        bentoGrid.innerHTML = '';
    
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
        img.alt = projectData.name + " Visual";
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
        
        // Read More Button with i18n
        if (content.length > 150) {
            const btn = document.createElement('button');
            btn.className = 'read-more-trigger';
            const readMoreText = currentLang === 'ar' ? 'اقرأ المزيد' : 'Read More';
            const readLessText = currentLang === 'ar' ? 'اقرأ أقل' : 'Read Less';
            btn.textContent = readMoreText;
            
            btn.addEventListener('click', () => {
                col.classList.toggle('is-expanded');
                btn.textContent = col.classList.contains('is-expanded') ? readLessText : readMoreText;
            });
            col.appendChild(btn);
        } else {
            wrapper.style.maxHeight = 'none';
            fade.style.display = 'none';
        }
        
        return col;
    };

    // 1. Cinematic Opener (Image 0)
    if (projectData.images[0]) {
        const openerWrapper = document.createElement('div');
        openerWrapper.style.width = '95%';
        openerWrapper.style.margin = '0 auto 60px auto';
        openerWrapper.appendChild(createImage(projectData.images[0], 'span-full'));
        projectContainer.insertBefore(openerWrapper, bentoGrid);
    }

    // 2. Split Overview Section
    const overviewTitle = currentLang === 'ar' ? 'نظرة عامة' : 'Overview';
    const overviewHTML = `<p>${projectData.overview}</p>`;
    const overviewSection = createSplitSection(overviewTitle, overviewHTML);
    projectContainer.insertBefore(overviewSection, bentoGrid);

    // 3. Random Grid (Images 1-4)
    const randomGrid = document.createElement('div');
    randomGrid.className = 'random-grid';
    
    const midBatch = projectData.images.slice(1, 5);
    
    midBatch.forEach((src, index) => {
        let span = 'span-full';
        if (index === 1 || index === 2) span = 'span-half';
        
        // Check if it's the 4th item and video exists
        if (index === 3 && projectData.video && projectData.video.length > 0) {
             randomGrid.appendChild(createVideo(projectData.video[0], span));
        } else {
             randomGrid.appendChild(createImage(src, span));
        }
    });
    projectContainer.insertBefore(randomGrid, bentoGrid);

    // 4. Challenge & Solution
    const csSection = document.createElement('div');
    csSection.className = 'challenge-solution-section';
    
    const solutionTitle = currentLang === 'ar' ? 'الحل' : 'The Solution';
    const solutionCol = createCSColumn(solutionTitle, projectData.solution);
    const challengeTitle = currentLang === 'ar' ? 'التحدي' : 'The Challenge';
    const challengeCol = createCSColumn(challengeTitle, projectData.challenge);
    
        csSection.appendChild(solutionCol);
        csSection.appendChild(challengeCol);
        
        projectContainer.insertBefore(csSection, bentoGrid);

        // 5. Bento Grid (Remaining Images)
        const remainingImages = projectData.images.slice(5);
        
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
        img.alt = projectData.name + " Detail";
        img.loading = "lazy";
        right.appendChild(img);
        
        container.appendChild(left);
        container.appendChild(right);
        
        return container;
    };

    remainingImages.forEach((src, index) => {
        // Insert Text Image Section after 4th image in this loop
        if (index === 4 && projectData.textImage) {
             bentoGrid.appendChild(createTextImageSection(projectData.textImage.text, projectData.textImage.imagesrc));
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

        bentoGrid.appendChild(createImage(src, span));
    });

    // Setup Next Project Link
    const nextId = project.id === projectsData.length ? 1 : project.id + 1;
    const nextProject = projectsData.find(p => p.id === nextId);
    const nextProjectData = nextProject[currentLang] || nextProject.en;
    if (nextProject) {
        document.getElementById('next-project-name').textContent = nextProjectData.name;
        document.getElementById('next-project-link').href = `./projectDetails.html?id=${nextId}`;
        
        const nextNav = document.getElementById('next-project-nav');
        if (nextProjectData.bannerImage) {
            nextNav.style.backgroundImage = `url('${nextProjectData.bannerImage}')`;
        }
    }

        // Re-run animations after content is built (only on initial load)
        if (isInitialLoad) {
            runAnimations();
            isInitialLoad = false;
        } else {
            // On language change, just refresh ScrollTrigger for new content
            ScrollTrigger.refresh();
        }
    }

    // Initial build
    buildProjectContent();

    // Listen for language changes
    window.addEventListener('languageChanged', () => {
        buildProjectContent();
    });

    // --- Animations ---
    function runAnimations() {
        // Kill existing ScrollTriggers to avoid duplicates
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        
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

    // Images - parallax effect
    gsap.utils.toArray('.image-container').forEach(container => {
            const inner = container.querySelector('.parallax-inner img, .parallax-inner video');
            if (inner) {
                gsap.set(inner, { scale: 1 });
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
    }

});
