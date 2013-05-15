precision highp float;
varying vec2 tex;
uniform sampler2D velDenSamp;
void main(void) {
	vec3 color = vec3(0.1, 1.0, 0.1);
	float density = texture2D(velDenSamp, tex).z;
	color *= 1./density;
	gl_FragColor = vec4(color, density);
}