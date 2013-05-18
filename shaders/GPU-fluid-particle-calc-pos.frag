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
	float vaporiseValue = texture2D(posSamp, tex).z;
	vec2 velocity = texture2D(velDenSamp, tex).xy;
	float density = texture2D(velDenSamp, tex).z;
	
	vaporiseValue += 0.01;
	if(density >= (0.05 * 20.)) {
		// particles together dont vaporise
		vaporiseValue = 0.;
	}

	if(isInsideQuad(inWarpFrom, 10., position) || vaporiseValue >= 1.) {
		position = inWarpTo;
		vaporiseValue = 0.;
	}

	position += velocity;
	
	gl_FragColor = vec4(position, vaporiseValue, 1.0);
}