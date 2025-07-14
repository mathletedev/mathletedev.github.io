<script lang="ts">
    import MatrixRain from "$features/matrix-rain/components/MatrixRain.svelte";
    import { AWARDS, type Award } from "$lib/awards";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import { onMount } from "svelte";

    gsap.registerPlugin(ScrollTrigger);

    let awards: Award[] = $state([]);

    onMount(() => {
        ScrollTrigger.create({
            trigger: "#awards",
            start: "top center",
            end: "bottom top",
            once: true,
            onEnter: () => {
                setTimeout(() => {
                    const tl = gsap.timeline();
                    for (const [i, award] of AWARDS.entries()) {
                        tl.add(
                            () => {
                                awards = [...awards, award];
                            },
                            1 + i * 0.1,
                        );
                    }
                }, 500);
            },
        });

        gsap.to("#matrix-rain-mask", {
            height: "100vh",
            ease: "none",
            scrollTrigger: {
                trigger: "#awards",
                start: "top bottom",
                end: "top top",
                scrub: true,
            },
        });

        gsap.to("#matrix-rain-bg-mask", {
            height: "100vh",
            ease: "none",
            scrollTrigger: {
                trigger: "#awards",
                start: "top bottom",
                end: "top top",
                scrub: true,
            },
        });
    });

    let titleLength = $derived(
        Math.max(
            "awards".length,
            awards.reduce((acc, curr) => Math.max(acc, curr.title.length), 0),
        ),
    );
    let dateLength = $derived(
        Math.max(
            "date".length,
            awards.reduce((acc, curr) => Math.max(acc, curr.date.length), 0),
        ),
    );

    const pad = (str: string, length: number) => {
        const padding = length - str.length;
        if (padding <= 0) {
            return str;
        }

        const left = Math.floor(padding / 2);
        return str.padStart(str.length + left).padEnd(length);
    };
</script>

<div
    id="matrix-rain-mask"
    class="fixed top-0 z-[-10] h-0 w-screen overflow-hidden"
>
    <MatrixRain />
</div>

<div
    id="matrix-rain-bg-mask"
    class="bg-base-100 fixed bottom-0 z-[-15] h-0 w-screen overflow-hidden"
></div>

<div id="awards" class="flex h-screen flex-col items-center justify-center">
    <div class="w-3xl">
        <div class="mockup-code bg-base-300 w-full">
            <pre data-prefix="λ"><code class="text-primary"
                    >SELECT * FROM awards;</code
                ></pre>
            <pre><code> id | {pad("award", titleLength)} | {pad(
                        "date",
                        dateLength,
                    )} </code></pre>
            <pre><code
                    >----+-{"-".repeat(titleLength)}-+-{"-".repeat(
                        dateLength,
                    )}-</code
                ></pre>
            {#each awards as award, i}
                <pre><code> {String(i).padStart(2)} | <a
                            class="text-secondary link-hover"
                            href={award.href}>{award.title}</a
                        >{" ".repeat(
                            titleLength - award.title.length,
                        )} | {award.date} </code></pre>
            {/each}
            {#if awards.length !== AWARDS.length}
                <pre><code class="text-neutral-content">Loading...</code></pre>
            {/if}
        </div>
    </div>
</div>
