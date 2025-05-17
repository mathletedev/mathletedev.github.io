import { navigate } from "astro:transitions/client";
import gsap from "gsap";
// @ts-ignore
import Typewriter from "typewriter-effect/dist/core";

const TEXTS = [
    "Software Engineer",
    "Neovim Enthusiast",
    "NixOS User <i>(btw)</i>",
    "Haskell Enjoyer",
    "Student & Teacher",
    "Violin/Tennis/Swim/XC",
];

gsap.from("#console", {
    y: "-100vh",
    delay: 1,
    duration: 1,
    ease: "power2.out",
});

const run = (delay = 2500) => {
    const typewriterElem = document.getElementById("typewriter")!;

    const typewriter = new Typewriter(typewriterElem, {
        loop: true,
        delay: 75,
        cursor: "<span class='bg-ctp-text'>|</span>",
    });

    typewriter.pauseFor(delay);

    for (const text of TEXTS) {
        typewriter.typeString(text);
        typewriter.pauseFor(1000);
        typewriter.deleteChars(text.length);
        typewriter.pauseFor(1000);
    }

    typewriter.start();
};

document.addEventListener("play", () => {
    const typewriterElem = document.getElementById("typewriter")!;

    const typewriter = new Typewriter(typewriterElem, {
        loop: false,
        delay: 250,
        cursor: "<span class='bg-ctp-text'>|</span>",
    });

    typewriter.typeString(
        "<span class='text-ctp-red'>:i</span> <span class='text-ctp-blue'>main</span>",
    );
    // typewriter.pauseFor(1500);
    typewriter.callFunction(destroy);
    typewriter.start();
});

const destroy = () => {
    // typewriterElem.innerHTML = "";

    // gsap.to("#console", {
    //     x: "100vw",
    //     duration: 1,
    // });

    setTimeout(() => {
        navigate("/main");
    }, 1000);
};

run();
document.addEventListener("astro:after-swap", run.bind(null, 1500));
