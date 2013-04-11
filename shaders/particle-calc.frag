precision highp float;

uniform sampler2D posSamp;
uniform sampler2D velSamp;

varying vec2 tex;

void main(void) {

	vec4 pos = texture2D(posSamp, tex);
	vec4 vel = texture2D(velSamp, tex);
	
	pos.xy += vel.xy;
	
	gl_FragColor = pos;
}