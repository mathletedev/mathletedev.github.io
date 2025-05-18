<script lang="ts">
    import { onMount } from "svelte";

    let glitched = false;
    let text = "";
    $: text = glitched ? "『王诗朗』" : "Neal Wang";

    const loop = () => {
        const delay = Math.floor(Math.random() * 2000) + 2000;

        setTimeout(() => {
            glitched = !glitched;
            loop();
        }, delay);
    };

    onMount(loop);
</script>

<!-- source: https://codepen.io/cbanlawi/pen/xxRBeMY -->
<div class="flex h-16 items-center">
    <p
        class={`select-none ${glitched ? "glitch font-[Zhi_Mang_Xing] text-6xl md:text-8xl" : "neon text-4xl md:text-6xl"}`}
    >
        {#if glitched}
            <span aria-hidden="true">{text}</span>
        {/if}
        {text}
        {#if glitched}
            <span aria-hidden="true">{text}</span>
        {/if}
    </p>
</div>

<style>
    :root {
        --colour1: #00fffc;
        --colour2: #fc00ff;
        --colour3: #fffc00;
    }

    .glitch {
        position: relative;
        text-shadow:
            0.05em 0 0 var(--colour1),
            -0.03em -0.04em 0 var(--colour2),
            0.025em 0.04em 0 var(--colour3);
        animation: glitch 725ms infinite;
    }

    .glitch span {
        position: absolute;
        top: 0;
        left: 0;
    }

    .glitch span:first-child {
        animation: glitch 500ms infinite;
        clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
        transform: translate(-0.04em, -0.03em);
        opacity: 0.75;
    }

    .glitch span:last-child {
        animation: glitch 375ms infinite;
        clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
        transform: translate(0.04em, 0.03em);
        opacity: 0.75;
    }

    @keyframes glitch {
        0% {
            text-shadow:
                0.05em 0 0 var(--colour1),
                -0.03em -0.04em 0 var(--colour2),
                0.025em 0.04em 0 var(--colour3);
        }
        15% {
            text-shadow:
                0.05em 0 0 var(--colour1),
                -0.03em -0.04em 0 var(--colour2),
                0.025em 0.04em 0 var(--colour3);
        }
        16% {
            text-shadow:
                -0.05em -0.025em 0 var(--colour1),
                0.025em 0.035em 0 var(--colour2),
                -0.05em -0.05em 0 var(--colour3);
        }
        49% {
            text-shadow:
                -0.05em -0.025em 0 var(--colour1),
                0.025em 0.035em 0 var(--colour2),
                -0.05em -0.05em 0 var(--colour3);
        }
        50% {
            text-shadow:
                0.05em 0.035em 0 var(--colour1),
                0.03em 0 0 var(--colour2),
                0 -0.04em 0 var(--colour3);
        }
        99% {
            text-shadow:
                0.05em 0.035em 0 var(--colour1),
                0.03em 0 0 var(--colour2),
                0 -0.04em 0 var(--colour3);
        }
        100% {
            text-shadow:
                -0.05em 0 0 var(--colour1),
                -0.025em -0.04em 0 var(--colour2),
                -0.04em -0.025em 0 var(--colour3);
        }
    }
</style>
