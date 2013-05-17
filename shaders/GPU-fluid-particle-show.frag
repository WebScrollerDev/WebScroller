precision highp float;
varying vec2 tex;
uniform sampler2D velDenSamp;
uniform vec3 inColor;
void main(void) {
	vec3 color = inColor;
	float density = texture2D(velDenSamp, tex).z;
	color *= 1./density;
	gl_FragColor = vec4(color, density);
}