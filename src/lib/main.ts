import gsap from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import ScrollTrigger from "gsap/ScrollTrigger";

const init = () => {
    if (!document.querySelector(".panel")) {
        return;
    }

    gsap.registerPlugin(ScrollToPlugin);
    gsap.registerPlugin(ScrollTrigger);

    const panels = gsap.utils.toArray(".panel");
    const sts: ScrollTrigger[] = [];

    panels.forEach((panel, _) => {
        const st = ScrollTrigger.create({
            trigger: panel as gsap.DOMTarget,
            start: "top top",
            end: `+=${(document.querySelector(".panel") as HTMLElement).offsetHeight}`,
            pin: true,
            pinSpacing: false,
            snap: 1,
        });

        sts.push(st);
    });

    for (const button of document.querySelectorAll(
        "nav button",
    ) as NodeListOf<HTMLButtonElement>) {
        button.onclick = async () => {
            const panel = document.getElementById(
                button.innerHTML.toLowerCase(),
            ) as HTMLElement | null;
            if (!panel) {
                return;
            }

            const above = panel.getBoundingClientRect().top <= 0;

            if (above) {
                sts.forEach((st) => {
                    st.disable();
                });
            }

            await gsap.to(window, {
                scrollTo: `#${button.innerHTML.toLowerCase()}`,
                duration: 2,
                ease: "power2.out",
            });

            if (above) {
                sts.forEach((st) => {
                    st.enable();
                });
            }

            location.href = `#${button.innerHTML.toLowerCase()}`;
        };
    }
};

init();
document.addEventListener("astro:after-swap", init);
