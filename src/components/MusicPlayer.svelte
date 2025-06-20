<script lang="ts">
    import { getRandomTrack } from "$lib/music";
    import { musicPlayer } from "$lib/shared.svelte";

    let modalEl: HTMLDialogElement | null = $state(null);
    let audioEl: HTMLAudioElement | null = $state(null);
    let playing = $state(false);
    let track: any = $state(null);

    $effect(() => {
        (async () => {
            track = await getRandomTrack();
        })();
    });

    $effect(() => {
        if (!playing && modalEl) {
            modalEl.showModal();
        }
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
                musicPlayer.peak = waveform[i];
            }

            requestAnimationFrame(loop);
        };

        loop();
    };
</script>

<dialog class="modal" bind:this={modalEl}>
    <div class="modal-box">
        <h3 class="text-lg font-bold">Aw snap! Audio playback is disabled</h3>
        <p class="py-4">Click the button below to start jamming!</p>
        <div class="modal-action">
            <form method="dialog" onsubmit={() => audioEl?.play()}>
                <button class="btn btn-primary">Play!</button>
            </form>
        </div>
    </div>
</dialog>

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
