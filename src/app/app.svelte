<script lang="ts">
    import MatrixRain from "$features/matrix-rain/components/MatrixRain.svelte";
    import MusicPlayer from "$features/music/components/MusicPlayer.svelte";
    import Awards from "./views/Awards.svelte";
    import Hero from "./views/Hero.svelte";
</script>

<main>
    <MusicPlayer />
    <Hero />
    <Awards />
    <MatrixRain />
</main>
