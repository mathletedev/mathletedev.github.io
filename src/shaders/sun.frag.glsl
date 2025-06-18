uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D uTexture;
varying vec2 vUv;

const float CUTOFF = 0.4;
const vec3 GLOW_COL = vec3(0.96, 0.19, 0.6);

float easeOut(float t) {
	return 1.0 - (1.0 - t) * (1.0 - t) * (1.0 - t);
}

// https://github.com/Experience-Monks/glsl-fast-gaussian-blur
vec4 blur(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
	vec4 color = vec4(0.0);
	vec2 off1 = vec2(1.411764705882353) * direction;
	vec2 off2 = vec2(3.2941176470588234) * direction;
	vec2 off3 = vec2(5.176470588235294) * direction;
	color += texture2D(image, uv) * 0.1964825501511404;
	color += texture2D(image, uv + (off1 / resolution)) * 0.2969069646728344;
	color += texture2D(image, uv - (off1 / resolution)) * 0.2969069646728344;
	color += texture2D(image, uv + (off2 / resolution)) * 0.09447039785044732;
	color += texture2D(image, uv - (off2 / resolution)) * 0.09447039785044732;
	color += texture2D(image, uv + (off3 / resolution)) * 0.010381362401148057;
	color += texture2D(image, uv - (off3 / resolution)) * 0.010381362401148057;
	return color;
}

void main() {
    vec2 uv = vUv;

	vec4 texCol = blur(uTexture, uv, uResolution, vec2(0.0, 2.5));

	float lines = 1.0 - max(sin(uv.y * 160.0 + uTime * 1.5), 0.0);
	float falloff = uv.y < CUTOFF ? 0.0 : easeOut(1.0 - (1.0 - uv.y) / (1.0 - CUTOFF));
    float glow = smoothstep(0.8, 0.4, uv.y);

	vec2 centre = vec2(0.5, 0.5);
	vec2 pos = uv - centre;
	float dist = length(pos / vec2(uResolution.x / uResolution.y, 1.0));
	float soften = smoothstep(0.8, 0.0, dist);

    vec3 col = mix(texCol.rgb, GLOW_COL, glow);

    gl_FragColor = vec4(col, texCol.a * lines * falloff * soften);
}
