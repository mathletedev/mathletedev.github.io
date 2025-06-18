<script lang="ts">
    import { T, useTask } from "@threlte/core";
    import sunURL from "$assets/sun.png";
    import { TAU } from "$lib/constants";
    import gridFragmentShader from "$shaders/grid.frag.glsl?raw";
    import gridVertexShader from "$shaders/grid.vert.glsl?raw";
    import sunFragmentShader from "$shaders/sun.frag.glsl?raw";
    import sunVertexShader from "$shaders/sun.vert.glsl?raw";
    import { onMount } from "svelte";
    import { ShaderMaterial, TextureLoader, Vector2 } from "three";

    let time = $state(0);

    let gridMaterial = $state(
        new ShaderMaterial({
            fragmentShader: gridFragmentShader,
            vertexShader: gridVertexShader,
            transparent: true,
            uniforms: {
                uTime: { value: 0 },
            },
        }),
    );

    let sunMaterial = $state(
        new ShaderMaterial({
            fragmentShader: sunFragmentShader,
            vertexShader: sunVertexShader,
            transparent: true,
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new Vector2(innerWidth, innerHeight) },
                uTexture: { value: null },
            },
        }),
    );

    onMount(async () => {
        const sunTexture = await new TextureLoader().loadAsync(sunURL);
        sunMaterial.uniforms.uTexture.value = sunTexture;
    });

    useTask((delta) => {
        time += delta;
        gridMaterial.uniforms.uTime.value = time;
        sunMaterial.uniforms.uTime.value = time;
    });
</script>

<T.Mesh position.y={0} position.z={-10} material={sunMaterial}>
    <T.PlaneGeometry args={[20, 20]} />
</T.Mesh>

<T.Mesh position.y={-1.5} rotation.x={TAU * -0.245} material={gridMaterial}>
    <T.PlaneGeometry args={[30, 10]} />
</T.Mesh>
