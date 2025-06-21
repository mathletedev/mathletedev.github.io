<script lang="ts">
    import { CONTROLS_DELAY } from "$lib/config";
    import { score } from "$lib/shared.svelte";

    let showControls = $state(false);

    $effect(() => {
        setTimeout(() => {
            showControls = true;
        }, CONTROLS_DELAY);
    });

    const scorePercent = $derived.by(() => {
        if (score.hit + score.missed === 0) {
            return 100;
        }

        return Math.round((score.hit / (score.hit + score.missed)) * 100);
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
            {scorePercent}%
        </div>
    </div>
{/if}
