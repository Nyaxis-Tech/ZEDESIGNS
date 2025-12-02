// assets/scripts/projects.js

document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("main");

    // Only enable on desktop / precise pointer
    if (!root) return;
    if (!window.matchMedia || !window.matchMedia("(pointer: fine)").matches) {
        return;
    }

    // Create the custom cursor element
    const cursor = document.createElement("div");
    cursor.className = "work-cursor";
    cursor.innerHTML = "<span>Our work</span>";
    document.body.appendChild(cursor);

    // Hide native cursor inside #main
    root.classList.add("has-custom-cursor");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let active = false;

    const ease = 0.16; // smaller = slower, smoother

    function showCursor() {
        active = true;
        cursor.classList.add("is-visible");
    }

    function hideCursor() {
        active = false;
        cursor.classList.remove("is-visible");
    }

    root.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        showCursor();
    });

    root.addEventListener("mouseenter", showCursor);
    root.addEventListener("mouseleave", hideCursor);

    function render() {
        // lerp towards mouse
        cursorX += (mouseX - cursorX) * ease;
        cursorY += (mouseY - cursorY) * ease;

        const scale = active ? 1 : 0.4;

        cursor.style.transform =
            `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%) scale(${scale})`;

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
});
