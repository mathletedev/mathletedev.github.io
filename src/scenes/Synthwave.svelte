<script lang="ts">
    import { T, useTask } from "@threlte/core";
    import { TAU } from "$lib/constants";
    import fragmentShader from "$shaders/grid.frag.glsl?raw";
    import vertexShader from "$shaders/grid.vert.glsl?raw";
    import { ShaderMaterial, Vector2 } from "three";

    let time = $state(0);
    let material = $state(
        new ShaderMaterial({
            fragmentShader,
            vertexShader,
            uniforms: {
                iTime: { value: 0 },
                iResolution: { value: new Vector2(innerWidth, innerHeight) },
            },
        }),
    );

    useTask((delta) => {
        time += delta;
        material.uniforms.iTime.value = time;
    });
</script>

<T.Mesh position.y={-4} {material}>
    <T.PlaneGeometry args={[10, 10]} />
</T.Mesh>
