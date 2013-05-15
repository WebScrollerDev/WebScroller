precision highp float;

uniform sampler2D posSamp;
uniform sampler2D velDenSamp;
uniform vec2 inWarpTo;
uniform vec2 inWarpFrom;

varying vec2 tex;

bool isInsideQuad(vec2 rectCenter, float radius, vec2 point) {
	if(rectCenter.x + radius > point.x && rectCenter.x - radius < point.x && rectCenter.y + radius > point.y && rectCenter.y - radius < point.y)
		return true;
	return false;
}

void main(void) {

	vec2 position = texture2D(posSamp, tex).xy;
	vec2 velocity = texture2D(velDenSamp, tex).xy;
	float density = texture2D(velDenSamp, tex).z;
	position += velocity;
	
	if(isInsideQuad(inWarpFrom, 10., position))
		position = inWarpTo;
	
	gl_FragColor = vec4(position, 0.0, 1.0);
}