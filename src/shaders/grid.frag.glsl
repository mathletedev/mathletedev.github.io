uniform float uTime;
uniform float uPeak;
varying vec2 vUv;

const float SPEED = 3.0;
const float ROW_DENSITY = 10.0;
const float COL_DENSITY = 20.0;
const float LINE_THICKNESS = 0.03;
const vec3 BASE_COL = vec3(0.02, 0, 0.05);
const vec3 GRID_COL = vec3(0.44, 0.82, 1);
const float PEAK_MULT = 1.2;

float rampUp(float t) {
	return pow(t, 1.5);
}

float grid(vec2 uv) {
    vec2 lineThickness = vec2(LINE_THICKNESS);

	uv += 0.5;
    uv.x *= COL_DENSITY;
	uv.y *= ROW_DENSITY;
    uv.y += uTime * SPEED;
    uv = abs(fract(uv) - 0.5);

    vec2 lines = smoothstep(lineThickness, vec2(0.0), uv);
    return clamp(lines.x + lines.y, 0.0, 1.0);
}

void main() {
    vec2 uv = vUv;
	uv -= 0.5;

    float gridVal = grid(uv);
	float fade = smoothstep(0.5, -0.5, uv.y) * 0.75;

    vec3 col = mix(BASE_COL, GRID_COL, gridVal);

    gl_FragColor = vec4(col * (0.2 + rampUp(uPeak / 100.0) * PEAK_MULT), fade);
}
