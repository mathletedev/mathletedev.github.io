<script lang="ts">
    import { T, useTask, useThrelte } from "@threlte/core";
    import { useGltf } from "@threlte/extras";
    import sunURL from "$assets/sun.png";
    import { TAU } from "$lib/constants";
    import { getPeak } from "$lib/music";
    import { mp, score } from "$lib/shared.svelte";
    import gridFragmentShader from "$shaders/grid.frag.glsl?raw";
    import gridVertexShader from "$shaders/grid.vert.glsl?raw";
    import sunFragmentShader from "$shaders/sun.frag.glsl?raw";
    import sunVertexShader from "$shaders/sun.vert.glsl?raw";
    import { onDestroy, onMount } from "svelte";
    import * as THREE from "three";
    import { EffectComposer, RenderPass } from "three/examples/jsm/Addons.js";

    // in seconds
    const MP_OFFSET = 0.2;
    const PEAK_DECAY = 8;
    // in units per second
    const NOTE_SPEED = 8;
    // in units
    const NOTE_SPAWN_DISTANCE = 10;
    // in seconds
    const NOTE_SPAWN_OFFSET = NOTE_SPAWN_DISTANCE / NOTE_SPEED;
    const NOTE_X_VARIANCE = 4;
    const NOTE_PEAK_DECAY = 4;
    const CAR_SPEED = 1.8;
    const CAR_MAX_X = 5;
    const CAR_TURN_SPEED = 10;

    const { scene, camera, renderer, renderStage } = useThrelte();
    const gltf = useGltf("/models/toyota_corolla_ae86_trueno.glb");

    let time = $state(0);
    let composer: EffectComposer | null = $state(null);
    let peak = $state(0);
    let prevNotePeak = $state(0);
    let notes: {
        pos: THREE.Vector3;
        hit: boolean;
    }[] = $state([]);
    let carX = $state(0);
    let carZ = $state(0);
    let carTargetX = $state(0);
    let carTargetZ = $state(0);
    let carRotation = $state(0);
    let ndcMouse = $state(new THREE.Vector2());
    let keys: Record<string, boolean> = $state({
        ArrowLeft: false,
        ArrowRight: false,
        ArrowUp: false,
        ArrowDown: false,
    });
    let useMouse = $state(true);

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

    const onMouseMove = (e: MouseEvent) => {
        ndcMouse = new THREE.Vector2(
            (e.clientX / innerWidth) * 2 - 1,
            -(e.clientY / innerHeight) * 2 + 1,
        );
        useMouse = true;
    };

    const onKeyDown = (e: KeyboardEvent) => {
        keys[e.key] = true;
        useMouse = false;
    };

    const onKeyUp = (e: KeyboardEvent) => {
        keys[e.key] = false;
    };

    onMount(async () => {
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);

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

    $effect(() => {
        notes = [];

        mp.waveform;
    });

    onDestroy(() => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
    });

    const getWorldPosFromNDC = (ndc: THREE.Vector2) => {
        const vec = new THREE.Vector3(ndc.x, ndc.y, 0.5);
        vec.unproject(camera.current);
        const dir = vec.sub(camera.current.position).normalize();
        const dist = -camera.current.position.z / dir.z;
        const pos = camera.current.position
            .clone()
            .add(dir.multiplyScalar(dist));
        return new THREE.Vector2(pos.x, pos.y);
    };

    useTask((delta) => {
        time += delta;

        // update material pulses
        gridMaterial.uniforms.uTime.value = time;
        sunMaterial.uniforms.uTime.value = time;

        // handle input
        if (useMouse) {
            // handle mouse input
            const worldMouse = getWorldPosFromNDC(ndcMouse);
            carTargetX = worldMouse.x;
            carTargetZ = worldMouse.y;
        } else {
            // handle keyboard input
            if (keys.ArrowLeft) {
                carTargetX -= 0.1;
            }
            if (keys.ArrowRight) {
                carTargetX += 0.1;
            }
            if (keys.ArrowUp) {
                carTargetZ += 0.1;
            }
            if (keys.ArrowDown) {
                carTargetZ -= 0.1;
            }
        }

        carTargetX = THREE.MathUtils.clamp(
            carTargetX,
            -CAR_MAX_X / 2,
            CAR_MAX_X / 2,
        );
        carTargetZ = THREE.MathUtils.clamp(carTargetZ, -0.5, 1.5);

        // move car
        carX = THREE.MathUtils.lerp(carX, carTargetX, CAR_SPEED * delta);
        carZ = THREE.MathUtils.lerp(carZ, carTargetZ, CAR_SPEED * delta);

        const dx = carTargetX - carX;
        carRotation = THREE.MathUtils.lerp(
            carRotation,
            -dx * 0.2,
            CAR_TURN_SPEED * delta,
        );

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

        // update material peaks
        gridMaterial.uniforms.uPeak.value = peak;
        sunMaterial.uniforms.uPeak.value = peak;

        // update notes
        for (let i = 0; i < notes.length; i++) {
            if (
                !notes[i].hit &&
                notes[i].pos.y < 0.5 &&
                notes[i].pos.x > carX - 0.8 &&
                notes[i].pos.x < carX + 0.8
            ) {
                score.hit++;
                notes[i].hit = true;
            }

            notes[i].pos.y -= NOTE_SPEED * delta;
            if (notes[i].hit) {
                notes[i].pos.z += 40 * delta;
            }

            // force reactivity
            notes[i] = {
                ...notes[i],
                pos: new THREE.Vector3(
                    notes[i].pos.x,
                    notes[i].pos.y,
                    notes[i].pos.z,
                ),
            };
        }
        const prevCount = notes.length;
        notes = notes.filter((note) => note.pos.y >= 0);
        score.total += prevCount - notes.length;

        if (mp.paused) {
            return;
        }

        nextPeak = getPeak(
            mp.audioEl.currentTime + MP_OFFSET + NOTE_SPAWN_OFFSET,
        );
        if (nextPeak === -1) {
            return;
        }

        // spawn new note
        if (nextPeak > prevNotePeak) {
            notes.push({
                pos: new THREE.Vector3(
                    Math.random() * NOTE_X_VARIANCE - NOTE_X_VARIANCE / 2,
                    NOTE_SPAWN_DISTANCE,
                    0,
                ),
                hit: false,
            });
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

<T.AmbientLight intensity={0.05} color="#00bafe" />
<T.DirectionalLight
    position={[0, 1, 30]}
    intensity={(10 * peak) / 100}
    color="#6c3baa"
/>

<T.Mesh position.y={0} position.z={-10} material={sunMaterial}>
    <T.PlaneGeometry args={[20 + peak / 100, 20 + peak / 100]} />
</T.Mesh>

<T.Group position={[0, -1.1, -carZ]} rotation.x={TAU * -0.25}>
    <T.Mesh material={gridMaterial}>
        <T.PlaneGeometry args={[30, 10]} />
    </T.Mesh>
    {#await gltf then { scene }}
        <T
            position={[carX, -1.8, 0.3]}
            rotation={[
                TAU * 0.25,
                TAU * 0.5 - carRotation * 0.5,
                carRotation * 0.5,
            ]}
            scale={0.25}
            is={scene}
        />
    {/await}
    {#each notes as note}
        <T.Mesh
            position={[note.pos.x, -3.5 + 2.6 + note.pos.y, 0.1 + note.pos.z]}
        >
            <T.SphereGeometry
                args={[
                    (0.1 * (NOTE_SPAWN_DISTANCE - note.pos.y)) /
                        NOTE_SPAWN_DISTANCE,
                    16,
                    16,
                ]}
            />
            <T.MeshToonMaterial
                emissive={note.hit ? "yellow" : "red"}
                emissiveIntensity={note.pos.y < 0.25 ? 4 : 0}
            />
        </T.Mesh>
    {/each}
</T.Group>
