<script lang="ts">
    import { Info, Music, Pause, Play, StepForward } from "@lucide/svelte";
    import { CONTROLS_DELAY } from "$lib/config";
    import { getRandomTrack } from "$lib/music";
    import { mp, score } from "$lib/shared.svelte";
    import { onMount } from "svelte";

    const TOAST_TIME = 4000;

    let modalEl: HTMLDialogElement | null = $state(null);
    let audioEl: HTMLAudioElement | null = $state(null);
    let track: any = $state(null);
    let showControls = $state(false);
    let showToast = $state(false);

    // use onMount to avoid infinite querying
    onMount(() => {
        play();

        setTimeout(() => {
            if (modalEl && audioEl && audioEl.paused) {
                modalEl.showModal();
            }

            showControls = true;
        }, CONTROLS_DELAY);
    });

    $effect(() => {
        mp.audioEl = audioEl;
    });

    $effect(() => {
        if (mp.paused) {
            audioEl?.pause();
        } else {
            audioEl?.play();
        }
    });

    $effect(() => {
        if (audioEl && audioEl.paused) {
            mp.paused = false;
        }
    });

    const nextTrack = async () => {
        track = await getRandomTrack();
        if (audioEl) {
            audioEl.src = track.audio;
        }
    };

    const toast = () => {
        showToast = true;
        setTimeout(() => {
            showToast = false;
        }, TOAST_TIME);
    };

    const play = async () => {
        await nextTrack();

        mp.paused = false;
        score.hit = 0;
        score.missed = 0;

        modalEl?.close();

        toast();
    };

    const togglePaused = () => {
        if (!audioEl) {
            return;
        }

        if (audioEl.paused) {
            mp.paused = false;
        } else {
            mp.paused = true;
        }
    };

    const start = () => {
        if (!audioEl) {
            return;
        }

        mp.waveform = JSON.parse(track.waveform).peaks;
    };
</script>

<dialog class="modal" bind:this={modalEl}>
    <div class="modal-box">
        <h3 class="text-lg font-bold">Aw snap! Audio playback is disabled</h3>
        <p class="py-4">Click the button below to start jamming!</p>
        <div class="modal-action">
            <form method="dialog" onsubmit={play}>
                <button class="btn btn-primary">Play!</button>
            </form>
        </div>
    </div>
</dialog>

{#if showControls}
    <div class="fixed top-4 flex w-screen justify-center gap-4">
        <div class="tooltip tooltip-bottom" data-tip="Track info">
            <button class="btn btn-soft btn-primary px-2" onclick={toast}>
                <Info />
            </button>
        </div>
        <div
            class="tooltip tooltip-bottom"
            data-tip={mp.paused ? "Play" : "Pause"}
        >
            <button
                class="btn btn-soft btn-primary px-2"
                onclick={togglePaused}
            >
                {#if mp.paused}<Play />{:else}<Pause />{/if}
            </button>
        </div>
        <div class="tooltip tooltip-bottom" data-tip="Skip track">
            <button class="btn btn-soft btn-primary px-2" onclick={play}>
                <StepForward />
            </button>
        </div>
    </div>

    {#if showToast}
        <div class="toast">
            <div class="alert alert-info">
                <Music />
                <div>
                    <span class="font-bold">[{track.artist_name}]</span>
                    {track.name}
                </div>
            </div>
        </div>
    {/if}
{/if}

<audio
    autoplay
    bind:this={audioEl}
    onloadedmetadata={start}
    onplay={() => (mp.paused = false)}
    onpause={() => (mp.paused = true)}
    onended={play}
></audio>
