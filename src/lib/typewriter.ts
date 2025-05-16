// @ts-ignore
import Typewriter from "typewriter-effect/dist/core";

const TEXTS = [
    "Software Engineer",
    "Neovim Enthusiast",
    "NixOS User (btw)",
    "Haskell Enjoyer",
    "Student & Teacher",
    "Violin/Tennis/Swim/XC",
];

const elem = document.getElementById("typewriter")!;

const typewriter = new Typewriter(elem, {
    loop: true,
    delay: 75,
    cursor: "<span class='bg-ctp-text'>|</span>",
});

typewriter.pauseFor(2500);

for (const text of TEXTS) {
    typewriter.typeString(text);
    typewriter.pauseFor(1000);
    typewriter.deleteChars(text.length);
    typewriter.pauseFor(1000);
}

typewriter.start();
