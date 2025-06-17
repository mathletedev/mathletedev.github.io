uniform float iTime;
uniform vec2 iResolution;
varying vec2 vUv;

float grid(vec2 uv) {
	vec2 size = vec2(uv.y, uv.y * uv.y * 0.2) * 0.01;
	uv += vec2(0.0, iTime * 4.0);
	uv = abs(fract(uv) - 0.5);
	vec2 lines = smoothstep(size, vec2(0.0), uv);
	lines += smoothstep(size * 5.0, vec2(0.0), uv) * 0.4;
	return clamp(lines.x + lines.y, 0.0, 3.0);
}

void main() {
	vec2 fragCoord = vUv * iResolution;
	vec2 uv = (2.0 * fragCoord.xy - iResolution.xy) / iResolution.y;
	float horizon = -0.9;

	float fog = smoothstep(0.2, -0.05, abs(uv.y + horizon));
	vec3 col = vec3(0.0, 0.1, 0.2);
	if (uv.y < -horizon) {
		uv.y = 3.0 / (abs(uv.y + horizon) + 0.05);
		uv.x *= uv.y * 1.0;
		float gridVal = grid(uv);
		col = mix(col, vec3(1.0, 0.25, 0.5), gridVal);
	}

	col += fog * fog * fog;
	col = mix(vec3(0.75, 0.1, 0.45) * 0.2, col, 0.7);

	gl_FragColor = vec4(col, 1.0);
}
