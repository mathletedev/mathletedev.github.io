<script lang="ts">
    import { T, useTask, useThrelte } from "@threlte/core";
    import sunURL from "$assets/sun.png";
    import { TAU } from "$lib/constants";
    import { getPeak } from "$lib/music";
    import { mp } from "$lib/shared.svelte";
    import gridFragmentShader from "$shaders/grid.frag.glsl?raw";
    import gridVertexShader from "$shaders/grid.vert.glsl?raw";
    import sunFragmentShader from "$shaders/sun.frag.glsl?raw";
    import sunVertexShader from "$shaders/sun.vert.glsl?raw";
    import { onMount } from "svelte";
    import * as THREE from "three";
    import { EffectComposer, RenderPass } from "three/examples/jsm/Addons.js";

    const PEAK_DECAY = 8;
    const MP_OFFSET = 0.1;

    const { scene, camera, renderer, renderStage } = useThrelte();

    let time = $state(0);
    let composer: EffectComposer | null = $state(null);
    let peak = $state(0);

    let gridMaterial = $state(
        new THREE.ShaderMaterial({
            fragmentShader: gridFragmentShader,
            vertexShader: gridVertexShader,
            transparent: true,
            uniforms: {
                uTime: { value: 0 },
                uPeak: { value: 0 },
            },
        }),
    );

    let sunMaterial = $state(
        new THREE.ShaderMaterial({
            fragmentShader: sunFragmentShader,
            vertexShader: sunVertexShader,
            transparent: true,
            uniforms: {
                uTime: { value: 0 },
                uResolution: {
                    value: new THREE.Vector2(innerWidth, innerHeight),
                },
                uTexture: { value: null },
                uPeak: { value: 0 },
            },
        }),
    );

    onMount(async () => {
        const sunTexture = await new THREE.TextureLoader().loadAsync(sunURL);
        sunMaterial.uniforms.uTexture.value = sunTexture;

        composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera.current));
        /* composer.addPass(
            new UnrealBloomPass(
                new THREE.Vector2(innerWidth, innerHeight),
                0.8,
                1.5,
                0.2,
            ),
        ); */
    });

    useTask((delta) => {
        time += delta;
        gridMaterial.uniforms.uTime.value = time;
        sunMaterial.uniforms.uTime.value = time;

        if (!mp.audioEl) {
            return;
        }

        let nextPeak = 0;
        if (!mp.paused) {
            nextPeak = getPeak(mp.audioEl.currentTime + MP_OFFSET);
            if (nextPeak === -1) {
                return;
            }
        }

        if (nextPeak > peak) {
            peak = nextPeak;
        } else {
            peak += (nextPeak - peak) * PEAK_DECAY * delta;
        }

        gridMaterial.uniforms.uPeak.value = peak;
        sunMaterial.uniforms.uPeak.value = peak;
    });

    useTask(
        () => {
            if (composer) {
                composer.render();
            }
        },
        { stage: renderStage, autoInvalidate: false },
    );
</script>

<T.Mesh position.y={0} position.z={-10} material={sunMaterial}>
    <T.PlaneGeometry args={[20 + peak / 100, 20 + peak / 100]} />
</T.Mesh>

<T.Mesh position.y={-1.1} rotation.x={TAU * -0.25} material={gridMaterial}>
    <T.PlaneGeometry args={[30, 10]} />
</T.Mesh>
