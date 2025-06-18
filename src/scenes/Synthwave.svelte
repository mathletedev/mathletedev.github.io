<script lang="ts">
    import { T, useTask, useThrelte } from "@threlte/core";
    import sunURL from "$assets/sun.png";
    import { TAU } from "$lib/constants";
    import gridFragmentShader from "$shaders/grid.frag.glsl?raw";
    import gridVertexShader from "$shaders/grid.vert.glsl?raw";
    import sunFragmentShader from "$shaders/sun.frag.glsl?raw";
    import sunVertexShader from "$shaders/sun.vert.glsl?raw";
    import { onMount } from "svelte";
    import * as THREE from "three";
    import { EffectComposer, RenderPass } from "three/examples/jsm/Addons.js";

    const { scene, camera, renderer, renderStage } = useThrelte();

    let time = $state(0);
    let composer: EffectComposer | null = $state(null);

    let gridMaterial = $state(
        new THREE.ShaderMaterial({
            fragmentShader: gridFragmentShader,
            vertexShader: gridVertexShader,
            transparent: true,
            uniforms: {
                uTime: { value: 0 },
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
    <T.PlaneGeometry args={[20, 20]} />
</T.Mesh>

<T.Mesh position.y={-1.1} rotation.x={TAU * -0.25} material={gridMaterial}>
    <T.PlaneGeometry args={[30, 10]} />
</T.Mesh>
