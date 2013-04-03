precision highp float;

uniform sampler2D samp1;
uniform sampler2D samp2;

varying vec2 tex;

const float d = 1./256.;
void main(void) {
	vec4 tmp1 = texture2D(samp1, tex);
	vec4 tmp2 = texture2D(samp2, tex);
	
	gl_FragColor = vec4(tmp2.x + tmp2.z, tmp2.y + tmp2.a, tmp2.z, tmp2.a);
}