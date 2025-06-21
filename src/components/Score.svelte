<script lang="ts">
    import { CONTROLS_DELAY } from "$lib/config";
    import { mp, score } from "$lib/shared.svelte";

    let showControls = $state(false);

    $effect(() => {
        setTimeout(() => {
            showControls = true;
        }, CONTROLS_DELAY);
    });

    $effect(() => {
        score.hit = 0;
        score.total = 0;

        mp.waveform;
    });

    const scorePercent = $derived.by(() => {
        if (score.total === 0) {
            return 100;
        }

        return Math.round((score.hit / score.total) * 100);
    });

    const colour = $derived.by(() => {
        if (scorePercent < 50) {
            return "text-neutral-content";
        }
        if (scorePercent < 75) {
            return "text-secondary";
        }
        if (scorePercent < 90) {
            return "text-accent";
        }
        return "text-primary";
    });
</script>

{#if showControls}
    <div class="fixed top-4 left-4 z-50">
        <div class={`radial-progress ${colour}`} style="--value:{scorePercent}">
            <span class="font-stereofunk mt-1">
                {scorePercent}%
            </span>
        </div>
    </div>
{/if}
