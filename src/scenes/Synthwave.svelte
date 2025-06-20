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

    // in seconds
    const MP_OFFSET = 0.2;
    const PEAK_DECAY = 8;
    // in units per second
    const NOTE_SPEED = 10;
    // in units
    const NOTE_SPAWN_DISTANCE = 10;
    // in seconds
    const NOTE_SPAWN_OFFSET = NOTE_SPAWN_DISTANCE / NOTE_SPEED;
    const NOTE_PEAK_DECAY = 4;

    const { scene, camera, renderer, renderStage } = useThrelte();

    let time = $state(0);
    let composer: EffectComposer | null = $state(null);
    let peak = $state(0);
    let prevNotePeak = $state(0);
    let notes: THREE.Vector2[] = $state([]);

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
        // BUG: bloom makes everything look dull
        /* composer.addPass(
            new UnrealBloomPass(
                new THREE.Vector2(innerWidth, innerHeight),
                1,
                0.2,
                1,
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

        for (let i = 0; i < notes.length; i++) {
            notes[i] = new THREE.Vector2(
                notes[i].x,
                notes[i].y - NOTE_SPEED * delta,
            );
        }
        notes = notes.filter((note) => note.y > 0);

        if (mp.paused) {
            return;
        }

        nextPeak = getPeak(
            mp.audioEl.currentTime + MP_OFFSET + NOTE_SPAWN_OFFSET,
        );
        if (nextPeak === -1) {
            return;
        }

        if (nextPeak > prevNotePeak) {
            notes.push(
                new THREE.Vector2(Math.random() * 2 - 1, NOTE_SPAWN_DISTANCE),
            );
            prevNotePeak = nextPeak;
        } else {
            prevNotePeak += (nextPeak - prevNotePeak) * NOTE_PEAK_DECAY * delta;
        }
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

<T.AmbientLight intensity={0.5} />
<T.DirectionalLight position={[0, 1, 0]} intensity={1} />

<T.Mesh position.y={0} position.z={-10} material={sunMaterial}>
    <T.PlaneGeometry args={[20 + peak / 100, 20 + peak / 100]} />
</T.Mesh>

<T.Group position.y={-1.1} rotation.x={TAU * -0.25}>
    {#each notes as note}
        <T.Mesh position={[note.x, -3.5 + note.y, 0.1]}>
            <T.SphereGeometry
                args={[
                    (0.05 * (NOTE_SPAWN_DISTANCE - note.y)) /
                        NOTE_SPAWN_DISTANCE,
                    16,
                    16,
                ]}
            />
            <T.MeshPhongMaterial emissive="indigo" emissiveIntensity={10} />
        </T.Mesh>
    {/each}
    <T.Mesh material={gridMaterial}>
        <T.PlaneGeometry args={[30, 10]} />
    </T.Mesh>
</T.Group>
