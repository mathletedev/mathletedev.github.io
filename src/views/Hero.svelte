<script lang="ts">
    import { Canvas } from "@threlte/core";
    import Glitch from "$components/Glitch.svelte";
    import MetallicText from "$components/MetallicText.svelte";
    import Score from "$components/Score.svelte";
    import Synthwave from "$scenes/Synthwave.svelte";
    import gsap from "gsap";

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
</script>

<Score />

<div id="synthwave" class="fixed top-0 z-[-10] h-screen w-screen">
    <Canvas>
        <Synthwave />
    </Canvas>
</div>

<div class="flex h-screen flex-col items-center">
    <div id="title" class="mt-[20vh] flex flex-col items-center">
        <h1 class="mb-[-0.4em] text-5xl sm:text-7xl md:text-8xl">
            <MetallicText>Neal Wang</MetallicText>
        </h1>
        <div id="glitch">
            <Glitch />
        </div>
    </div>
</div>
