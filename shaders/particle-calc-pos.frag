precision highp float;

uniform sampler2D posSamp;
uniform sampler2D velDenSamp;

varying vec2 tex;

void main(void) {

	vec2 position = texture2D(posSamp, tex).xy;
	vec2 velocity = texture2D(velDenSamp, tex).xy;
	float density = texture2D(velDenSamp, tex).z;
	position += velocity;
	gl_FragColor = vec4(position, 0.0, 1.0);
}