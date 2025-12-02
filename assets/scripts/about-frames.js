// About Section Frame Sequence Animation
(() => {
    // Only run canvas animation on desktop
    if (window.innerWidth <= 768) return;
    
    const frames = {
        currentIndex: 0,
        maxIndex: 150,
    };
    
    const canvas = document.querySelector("#abright canvas");
    if (!canvas) return;
    
    const context = canvas.getContext("2d");
    let images = [];
    let imagesLoaded = 0;

    function preloadImages() {
        for (let i = 1; i <= frames.maxIndex; i++) {
            const imgUrl = `./assets/images/aboutFrames/frame${i.toString().padStart(3, "0")}.webp`;

            const img = new Image();
            img.src = imgUrl;

            img.onload = () => {
                imagesLoaded++;
                if (imagesLoaded === frames.maxIndex) {
                    console.log("All about frames loaded");
                    loadImage(frames.currentIndex);
                    startAnimation();
                }
            };
            images.push(img);
        }
    }

    function loadImage(imageIndex) {
        if (imageIndex >= 0 && imageIndex < frames.maxIndex) {
            const img = images[imageIndex];

            const abrightDiv = document.querySelector("#abright");
            canvas.width = abrightDiv.offsetWidth;
            canvas.height = abrightDiv.offsetHeight;

            const scaleX = canvas.width / img.width;
            const scaleY = canvas.height / img.height;
            const scale = Math.max(scaleX, scaleY);

            const newWidth = img.width * scale;
            const newHeight = img.height * scale;

            const offsetX = (canvas.width - newWidth) / 2;
            const offsetY = (canvas.height - newHeight) / 2;

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = "high";
            context.drawImage(img, offsetX, offsetY, newWidth, newHeight);

            frames.currentIndex = imageIndex;
        }
    }

    function startAnimation() {
        var tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#about",
                start: "top top",
                end: "bottom bottom",
                scrub: 4,
                pin: "#about-content",
                // markers: true,
            },
        });

        tl.to(frames, {
            currentIndex: frames.maxIndex - 1,
            onUpdate: function () {
                loadImage(Math.floor(frames.currentIndex));
            },
        });
    }

    preloadImages();
})();
