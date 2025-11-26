const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

function raf(time) {
    lenis.raf(time);
    ScrollTrigger.update();
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Navbar scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// register ScrollTrigger plugin with GSAP (safe to call even if already available)
if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
    gsap.registerPlugin(ScrollTrigger);
}

let tl = gsap.timeline({
    scrollTrigger:{
        trigger: "#hero",
        start: "top top",
        end: "30% top",
        scrub: true,
        // markers: true,
    }
});

tl.to(".h1one",{
    x: -50,
    // duration: 1,
    ease: Power1.easeInOut
},"<")
tl.to(".h1two",{
    x: 50,
    // duration: 1,
    ease: Power1.easeInOut,
},"<")
tl.to("#herovid",{
    width: "90%",
    ease: Power1.easeInOut,
},"<")

// Services horizontal scroll animation
let tl2 = gsap.timeline({
    scrollTrigger:{
        trigger: "#services",
        start: "50 top",
        end: "+=0%",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        // markers: true
    }
});

tl2.to(".servcardslist",{
    x: -650,
    ease: "none",
});

// About-section counters: animate numbers when #about enters view
(() => {
    const counters = document.querySelectorAll('#abstat .abstatelem h1');
    if (!counters || counters.length === 0) return;

    let started = false;

    ScrollTrigger.create({
        trigger: '#about',
        start: 'top 80%',
        onEnter: () => {
            if (started) return;
            started = true;

            counters.forEach((el) => {
                const txt = el.textContent.trim();
                // extract number and suffix (like +)
                const m = txt.match(/^(\d+[\d,]*)/);
                if (!m) return;
                const target = parseInt(m[0].replace(/,/g, ''), 10) || 0;
                const suffix = txt.slice(m[0].length) || '';

                const obj = { val: 0 };
                gsap.to(obj, {
                    val: target,
                    duration: 2,
                    ease: 'power1.out',
                    onUpdate() {
                        const v = Math.floor(obj.val).toLocaleString();
                        el.textContent = v + suffix;
                    }
                });
            });
        }
    });
})();