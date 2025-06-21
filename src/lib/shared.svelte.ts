// shared music player state
export const mp = $state({
    queue: [] as any[],
    waveform: [] as any[],
    audioEl: null as HTMLAudioElement | null,
    paused: false,
});

export const score = $state({
    hit: 0,
    missed: 0,
});
