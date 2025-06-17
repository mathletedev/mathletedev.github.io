<script lang="ts">
    import { T, useTask } from "@threlte/core";
    import { TAU } from "$lib/constants";
    import fragmentShader from "$shaders/grid.frag.glsl?raw";
    import vertexShader from "$shaders/grid.vert.glsl?raw";
    import { ShaderMaterial } from "three";

    let time = $state(0);
    let material = $state(
        new ShaderMaterial({
            fragmentShader,
            vertexShader,
            transparent: true,
            uniforms: {
                uTime: { value: 0 },
            },
        }),
    );

    useTask((delta) => {
        time += delta;
        material.uniforms.uTime.value = time;
    });
</script>

<T.Mesh position.y={-1} rotation.x={TAU * -0.24} {material}>
    <T.PlaneGeometry args={[30, 10]} />
</T.Mesh>
