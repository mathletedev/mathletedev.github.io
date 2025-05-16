const glitches = document.querySelectorAll(".glitch");

for (const glitch of glitches) {
    const loop = () => {
        const delay = Math.floor(Math.random() * 2000) + 2000;
        const child0 = glitch.children[0] as HTMLElement;
        const child1 = glitch.children[1] as HTMLElement;

        setTimeout(() => {
            if (glitch.classList.contains("glitch")) {
                glitch.classList.remove("glitch");
                child0.style.visibility = "hidden";
                child1.style.visibility = "hidden";
            } else {
                glitch.classList.add("glitch");
                child0.style.visibility = "visible";
                child1.style.visibility = "visible";
            }

            loop();
        }, delay);
    };

    loop();
}
