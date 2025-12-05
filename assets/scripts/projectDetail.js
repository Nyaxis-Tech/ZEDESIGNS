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

gsap.registerPlugin(ScrollTrigger);

gsap.to("#inforightwrapper", {
    scrollTrigger: {
        trigger: "#projectinfo",
        start: "top 10%",
        end: "bottom center-+=200",
        endTrigger: ".lastdiv",
        pin: true,
        scrub: true,
        markers: true,
    },
    y: "-65%"
})