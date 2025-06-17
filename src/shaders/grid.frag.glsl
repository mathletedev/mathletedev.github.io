uniform float uTime;
varying vec2 vUv;

float grid(vec2 uv) {
    float rowDensity = 12.0;
    float colDensity = 4.0;
    vec2 lineThickness = vec2(0.03);

	uv += 0.5;
    uv.x *= rowDensity;
	uv.y *= colDensity;
    uv.y += uTime * 4.0;
    uv = abs(fract(uv) - 0.5);

    vec2 lines = smoothstep(lineThickness, vec2(0.0), uv);
    return clamp(lines.x + lines.y, 0.0, 1.0);
}

void main() {
    vec2 uv = vUv;
	uv -= 0.5;

    float gridVal = grid(uv);
	float fade = smoothstep(0.5, -0.5, uv.y);

    vec3 baseCol = vec3(0.035, 0, 0.184);
	vec3 gridCol = vec3(0.44, 0.82, 1);

    vec3 col = mix(baseCol, gridCol, gridVal);

    gl_FragColor = vec4(col, fade);
}
