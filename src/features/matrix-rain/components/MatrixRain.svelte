<script lang="ts">
    import { onMount } from "svelte";
    import { MatrixRain } from "../matrix-rain/matrixRain";

    let canvas: HTMLCanvasElement | undefined = $state();

    let matrixRain: MatrixRain | undefined = $state();

    onMount(() => {
        matrixRain = new MatrixRain(canvas!);
        matrixRain.init();
        matrixRain.update();

        return () => {
            matrixRain?.deinit();
        };
    });
</script>

<canvas
    bind:this={canvas}
    class="pointer-events-none fixed top-0 left-0 z-[-10] h-screen w-full"
></canvas>

<style>
    canvas {
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;
    }
</style>
