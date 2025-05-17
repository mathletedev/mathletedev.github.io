import gsap from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import ScrollTrigger from "gsap/ScrollTrigger";

const init = () => {
    if (!document.querySelector(".panel-container")) {
        return;
    }

    gsap.registerPlugin(ScrollTrigger);
    gsap.registerPlugin(ScrollToPlugin);

    let panels = gsap.utils.toArray(".panel");

    gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
            trigger: ".panel-container",
            pin: true,
            scrub: 1,
            snap: 1 / (panels.length - 1),
            end: () =>
                "+=" +
                (document.querySelector(".panel-container") as HTMLElement)
                    .offsetWidth,
        },
    });

    for (const button of document.querySelectorAll(
        "nav button",
    ) as NodeListOf<HTMLButtonElement>) {
        button.onclick = () => {
            gsap.to(window, {
                scrollTo: `#${button.innerHTML.toLowerCase()}`,
            });
        };
    }
};

init();
document.addEventListener("astro:after-swap", init);
