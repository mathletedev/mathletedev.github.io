<script lang="ts">
    import { getRandomTrack } from "$lib/music";

    let audioEl: HTMLAudioElement | null = $state(null);
    let playing = $state(false);
    let track: any = $state(null);
    let bgColour = $state("#000000");

    $effect(() => {
        (async () => {
            track = await getRandomTrack();
        })();
    });

    const visualise = () => {
        if (!audioEl) {
            return;
        }

        const waveform = JSON.parse(track.waveform).peaks;
        const interval = audioEl.duration / waveform.length;

        let prevI = 0;
        const loop = () => {
            if (!audioEl) {
                return;
            }

            const i = Math.floor(audioEl.currentTime / interval);

            if (i !== prevI && i < waveform.length) {
                const peak = waveform[i];
                bgColour = `rgb(0, 0, ${(peak / 100) * 255})`;

                prevI = i;
            }

            requestAnimationFrame(loop);
        };

        loop();
    };
</script>

{#if !playing}
    <div
        class="absolute z-10 flex h-screen w-screen items-center justify-center"
    >
        <button class="btn btn-primary" onclick={() => audioEl?.play()}
            >Play!</button
        >
    </div>
{/if}

<div
    class="absolute z-10 h-4 w-screen"
    style="background-color: {bgColour}"
></div>

<audio
    autoplay
    bind:this={audioEl}
    onloadedmetadata={visualise}
    onplay={() => (playing = true)}
    onended={() => (playing = false)}
>
    {#if track}
        <source src={track.audio} type="audio/mp3" />
    {/if}
</audio>
