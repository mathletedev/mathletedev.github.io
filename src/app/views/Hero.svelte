<script lang="ts">
    import { Canvas } from "@threlte/core";
    import Glitch from "$components/Glitch.svelte";
    import MetallicText from "$components/MetallicText.svelte";
    import { CONTROLS_DELAY } from "$config";
    import Score from "$features/synthwave/components/Score.svelte";
    import Synthwave from "$features/synthwave/components/Synthwave.svelte";
    import gsap from "gsap";
    import { onMount } from "svelte";

    let heroEl: HTMLElement | null = $state(null);
    let synthwaveVisible = $state(true);
    let scoreVisible: boolean | null = $state(null);

    $effect(() => {
        const tl = gsap.timeline();
        tl.from("#title", { opacity: 0, duration: 1, ease: "power1.out" });
        tl.delay(1);
        tl.from("#title", { y: "25vh", duration: 2, ease: "power2.out" });
        tl.from("#glitch", { opacity: 0, duration: 1, ease: "power1.out" });
        tl.from("#synthwave", {
            opacity: 0,
            duration: 3,
            ease: "power1.out",
        });
    });

    $effect(() => {
        setTimeout(() => {
            if (scoreVisible === null) {
                scoreVisible = true;
            }
        }, CONTROLS_DELAY);
    });

    onMount(() => {
        const synthwaveObserver = new IntersectionObserver(
            ([entry]) => {
                synthwaveVisible = entry.isIntersecting;
            },
            { threshold: 0.1 },
        );
        const scoreObserver = new IntersectionObserver(
            ([entry]) => {
                if (scoreVisible !== null) {
                    scoreVisible = entry.isIntersecting;
                }
            },
            { threshold: 0.9 },
        );

        if (heroEl) {
            synthwaveObserver.observe(heroEl);
            scoreObserver.observe(heroEl);
        }

        return () => {
            synthwaveObserver.disconnect();
            scoreObserver.disconnect();
        };
    });
</script>

{#if scoreVisible}
    <Score />
{/if}

{#if synthwaveVisible}
    <div id="synthwave" class="fixed top-0 z-[-10] h-screen w-screen">
        <Canvas>
            <Synthwave />
        </Canvas>
    </div>
{/if}

<div class="flex h-screen flex-col items-center" bind:this={heroEl}>
    <div id="title" class="mt-[20vh] flex flex-col items-center">
        <h1 class="mb-[-0.4em] text-5xl sm:text-7xl md:text-8xl">
            <MetallicText>Neal Wang</MetallicText>
        </h1>
        <div id="glitch">
            <Glitch />
        </div>
    </div>
</div>
