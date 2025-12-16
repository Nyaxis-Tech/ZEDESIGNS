// Internationalization (i18n) System - Simplified Version for Non-Landing Pages
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
            let response = await fetch("../assets/translations.json").catch(
                () => null
            );
            // if (!response || !response.ok) {
            //     response = await fetch("../assets/translations.json");
            //     if (!response || !response.ok) {
            //         throw new Error(
            //             `Failed to load translations: ${
            //                 response ? response.status : "unknown"
            //             }`
            //         );
            //     }
            // }
            this.translations = await response.json();
        } catch (error) {
            console.error("Failed to load translations:", error);
            throw error;
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
    }

    updateContent(animate = true) {
        // Update elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            
            if (translation) {
                if (animate) {
                    // Simple fade animation
                    element.style.opacity = '0';
                    element.style.transition = 'opacity 0.2s ease';
                    
                    setTimeout(() => {
                        element.innerHTML = translation;
                        element.style.opacity = '1';
                    }, 200);
                } else {
                    // Initial load - no animation
                    element.innerHTML = translation;
                }
            }
        });
        
        // Update elements with data-i18n-placeholder attribute
        const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
        placeholderElements.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.getTranslation(key);
            
            if (translation) {
                element.placeholder = translation;
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
                const svg = langToggle.querySelector('svg');
                if (svg) {
                    svg.style.transition = 'transform 0.3s ease';
                    svg.style.transform = 'rotate(360deg)';
                    setTimeout(() => {
                        svg.style.transform = '';
                    }, 300);
                }
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
