precision highp float;

uniform sampler2D samp1;
uniform sampler2D samp2;

varying vec2 tex;

void main(void) {
	vec4 tmp1 = texture2D(samp1, tex);
	vec4 tmp2 = texture2D(samp2, tex);
	tmp1.x += 1.;
	gl_FragColor = tmp1;
}