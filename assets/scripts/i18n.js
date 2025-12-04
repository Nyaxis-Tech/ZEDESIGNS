// Internationalization (i18n) System
class I18n {
    constructor() {
        this.translations = {};
        this.currentLang = localStorage.getItem('language') || 'ar'; // Default to Arabic
        this.init();
    }

    async init() {
        await this.loadTranslations();
        this.setLanguage(this.currentLang, false);
        this.setupEventListeners();
    }

    async loadTranslations() {
        try {
            const response = await fetch('./assets/translations.json');
            this.translations = await response.json();
        } catch (error) {
            console.error('Failed to load translations:', error);
        }
    }

    setLanguage(lang, animate = true) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        
        // Set HTML attributes
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        
        // Update all elements with data-i18n attribute
        this.updateContent(animate);
        
        // Update active state in dropdown
        this.updateDropdownState();
        
        // Update body class for font changes if needed
        document.body.classList.toggle('lang-ar', lang === 'ar');
        document.body.classList.toggle('lang-en', lang === 'en');
        
        // Update ScrollTrigger animations for language change
        this.updateScrollAnimations();
        this.updateCounterAnimations();
    }
    
    updateScrollAnimations() {
        // Find and update the hero scroll animation
        const heroScrollTrigger = ScrollTrigger.getAll().find(st => st.trigger === document.querySelector('#hero'));
        
        if (heroScrollTrigger && window.innerWidth > 768) {
            // Kill the old animation
            heroScrollTrigger.kill();
            
            // Recreate with correct direction
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: "#hero",
                    start: "top top",
                    end: "20% top",
                    scrub: true,
                }
            });
            
            if (this.currentLang === "ar") {
                // For Arabic, reverse the directions
                tl.to(".h1one", {
                    x: 50,
                    ease: Power1.easeInOut,
                }, "<");
                tl.to(".h1two", {
                    x: -50,
                    ease: Power1.easeInOut,
                }, "<");
            } else {
                // For English and other LTR languages
                tl.to(".h1one", {
                    x: -50,
                    ease: Power1.easeInOut,
                }, "<");
                tl.to(".h1two", {
                    x: 50,
                    ease: Power1.easeInOut,
                }, "<");
            }
            
            tl.to("#herovid", {
                width: window.innerWidth > 768 ? "90%" : "95%",
                ease: Power1.easeInOut,
            }, "<");
        }
        
        // Find and update the services horizontal scroll animation
        const servicesScrollTrigger = ScrollTrigger.getAll().find(st => st.trigger === document.querySelector('#servcardstrip'));
        
        if (servicesScrollTrigger && window.innerWidth > 768) {
            // Kill the old animation
            servicesScrollTrigger.kill();
            
            // Recreate with correct direction
            let serviceStrip = document.querySelector("#servcardstrip");
            let hortl = gsap.timeline({
                scrollTrigger: {
                    trigger: "#servcardstrip",
                    start: "center 60%",
                    end: "+=3000",
                    pin: "#services",
                    anticipatePin: 1,
                    scrub: 1,
                    invalidateOnRefresh: true,
                }
            });
            
            if (this.currentLang === "ar") {
                hortl.to("#servcardstrip", {
                    x: () => serviceStrip.scrollWidth - window.innerWidth,
                }, "<");
            } else {
                hortl.to("#servcardstrip", {
                    x: () => -(serviceStrip.scrollWidth - window.innerWidth),
                }, "<");
            }
        }
    }

    updateCounterAnimations() {

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
                    // Get target from data attribute
                    const target =
                        parseInt(el.getAttribute("data-count-target"), 10) || 0;

                    // Get current translation text to extract suffix
                    const txt = el.textContent.trim();
                    // Extract suffix (like + or any other characters after the number)
                    const match = txt.match(/[\d٠-٩]+(.*)$/);
                    const suffix = match ? match[1] : "+";

                    const obj = { val: 0 };
                    gsap.to(obj, {
                        val: target,
                        duration: 3.5,
                        ease: "power1.out",
                        onUpdate() {
                            const v = Math.floor(obj.val);
                            // Convert to Arabic numerals if current language is Arabic
                            const currentLang =
                                document.documentElement.getAttribute("lang") ||
                                "en";
                            let displayNum = v.toString();

                            if (currentLang === "ar") {
                                // Convert Western numerals to Arabic-Indic numerals
                                displayNum = v
                                    .toString()
                                    .replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);
                            }

                            el.textContent = displayNum + suffix;
                        },
                    });
                });
            },
        });
    }

    updateContent(animate = true) {
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            
            if (translation) {
                // Special handling for tag elements to preserve animation
                const isTagElement = element.closest('.tag') && element.tagName === 'P';
                
                // Special handling for about heading (word animation)
                const isAboutHeading = element.matches('#about #ableft h1');
                
                // Special handling for counter elements
                const isCounter = element.hasAttribute('data-count-target');
                
                if (animate) {
                    // For tag elements, handle differently
                    if (isTagElement) {
                        const tag = element.closest('.tag');
                        const wasRevealed = tag.classList.contains('revealed');
                        
                        if (wasRevealed) {
                            // Temporarily remove revealed class
                            tag.classList.remove('revealed');
                            
                            // Wait for CSS transition to finish, then update text
                            setTimeout(() => {
                                element.textContent = translation;
                                
                                // Re-add revealed class to trigger animation
                                setTimeout(() => {
                                    tag.classList.add('revealed');
                                }, 50);
                            }, 1000); // Wait for max-width transition (1s)
                        } else {
                            // If not revealed, just update text
                            element.textContent = translation;
                        }
                    } else if (isAboutHeading) {
                        // For about heading, fade out, update, re-split words, fade in
                        element.style.opacity = '0';
                        
                        setTimeout(() => {
                            // Update text
                            element.textContent = translation;
                            
                            // Re-split into words for animation
                            const words = translation.trim().split(/\s+/);
                            element.innerHTML = words
                                .map((w) => `<span class="word">${w}&nbsp;</span>`)
                                .join("");
                            
                            // Set words to visible (already animated in)
                            const wordSpans = element.querySelectorAll('.word');
                            wordSpans.forEach(span => {
                                span.style.opacity = '1';
                                span.style.transform = 'translateY(0)';
                            });
                            
                            // Fade heading back in
                            setTimeout(() => {
                                element.style.opacity = '1';
                            }, 50);
                        }, 200);
                    } else if (isCounter) {
                        // For counters, just update the text without animation
                        // The counting animation will handle it
                        element.textContent = translation;
                    } else {
                        // Normal elements
                        element.style.opacity = '0';
                        element.style.transform = 'translateY(5px)';
                        
                        setTimeout(() => {
                            element.textContent = translation;
                            
                            // Fade in
                            setTimeout(() => {
                                element.style.opacity = '1';
                                element.style.transform = 'translateY(0)';
                            }, 50);
                        }, 200);
                    }
                } else {
                    // Initial load - no animation
                    element.textContent = translation;
                    
                    // For about heading on initial load, split into words
                    if (isAboutHeading) {
                        const words = translation.trim().split(/\s+/);
                        element.innerHTML = words
                            .map((w) => `<span class="word">${w}&nbsp;</span>`)
                            .join("");
                    }
                }
                
                // Add transition if not already present
                if (!element.style.transition && !isTagElement && !isAboutHeading) {
                    element.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
                }
            }
        });
    }

    getTranslation(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];
        
        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return null;
            }
        }
        
        return value;
    }

    setupEventListeners() {
        const langToggle = document.getElementById('langToggle');
        const langDropdown = document.getElementById('langDropdown');
        const langOptions = document.querySelectorAll('.lang-option');

        if (!langToggle || !langDropdown) return;

        // Toggle dropdown
        langToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!langToggle.contains(e.target) && !langDropdown.contains(e.target)) {
                langDropdown.classList.remove('active');
            }
        });

        // Language option click
        langOptions.forEach(option => {
            option.addEventListener('click', () => {
                const lang = option.getAttribute('data-lang');
                this.setLanguage(lang);
                langDropdown.classList.remove('active');
                
                // Animate the globe icon
                langToggle.querySelector('svg').style.transform = 'rotate(360deg)';
                setTimeout(() => {
                    langToggle.querySelector('svg').style.transform = '';
                }, 300);
            });
        });

        // Update initial state
        this.updateDropdownState();
    }

    updateDropdownState() {
        const langOptions = document.querySelectorAll('.lang-option');
        langOptions.forEach(option => {
            const lang = option.getAttribute('data-lang');
            option.classList.toggle('active', lang === this.currentLang);
        });
    }

    // Get current language
    getCurrentLanguage() {
        return this.currentLang;
    }

    // Check if current language is RTL
    isRTL() {
        return this.currentLang === 'ar';
    }
}

// Initialize i18n when DOM is ready
let i18nInstance;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        i18nInstance = new I18n();
    });
} else {
    i18nInstance = new I18n();
}

// Export for use in other scripts
window.i18n = i18nInstance;
