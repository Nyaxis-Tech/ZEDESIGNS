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

    // --- Service Dropdown Functionality (Multi-Select) ---
    const serviceToggle = document.getElementById('serviceToggle');
    const serviceDropdown = document.getElementById('serviceDropdown');
    const serviceOptions = document.querySelectorAll('.service-option');
    const serviceInput = document.getElementById('service');
    const serviceSelected = document.querySelector('.service-selected');
    let selectedServices = [];

    if (serviceToggle && serviceDropdown) {
        serviceToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            serviceToggle.classList.toggle('active');
            serviceDropdown.classList.toggle('active');
        });

        serviceOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const value = option.getAttribute('data-value');
                const text = option.querySelector('span:last-child').textContent;
                
                // Toggle selection
                option.classList.toggle('selected');
                
                if (option.classList.contains('selected')) {
                    // Add to selected services
                    if (!selectedServices.find(s => s.value === value)) {
                        selectedServices.push({ value, text });
                    }
                } else {
                    // Remove from selected services
                    selectedServices = selectedServices.filter(s => s.value !== value);
                }
                
                // Update hidden input with comma-separated values
                serviceInput.value = selectedServices.map(s => s.value).join(',');
                
                // Update button text
                if (selectedServices.length === 0) {
                    serviceSelected.textContent = 'Service Interest';
                    serviceToggle.classList.remove('selected');
                } else if (selectedServices.length === 1) {
                    serviceSelected.textContent = selectedServices[0].text;
                    serviceToggle.classList.add('selected');
                } else {
                    serviceSelected.textContent = `${selectedServices.length} Services Selected`;
                    serviceToggle.classList.add('selected');
                }
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!serviceToggle.contains(e.target) && !serviceDropdown.contains(e.target)) {
                serviceToggle.classList.remove('active');
                serviceDropdown.classList.remove('active');
            }
        });
    }

    // --- Form Section Reveal ---
    gsap.from('.contact-form-section', {
        scrollTrigger: {
            trigger: '.contact-left',
            start: "top 75%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    });

    // --- Info Section Tag Reveal ---
    const infoTag = document.querySelector('.contact-info-section .tag');
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
    if (document.querySelector('.video-fixed-wrapper video')) {
        gsap.to('.video-fixed-wrapper video', {
            scrollTrigger: {
                trigger: '.contact-left',
                start: "top top",
                end: "bottom bottom",
                scrub: 1
            },
            scale: 1.1,
            ease: "none"
        });
    }

    // --- Form Submit Handler ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Check if service is selected
            if (!serviceInput.value) {
                alert('Please select at least one service interest.');
                return;
            }
            
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
                    selectedServices = [];
                    serviceSelected.textContent = 'Service Interest';
                    serviceToggle.classList.remove('selected');
                    serviceOptions.forEach(opt => opt.classList.remove('selected'));
                    alert('Thank you! We\'ll be in touch within 24 hours.');
                }
            });
        });
    }
});