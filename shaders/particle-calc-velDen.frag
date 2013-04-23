precision highp float;

uniform sampler2D posSamp;
uniform sampler2D velDenSamp;
uniform sampler2D borderSamp;
uniform vec2 borderPos;

varying vec2 tex;

void main(void) {

	vec2 position = texture2D(posSamp, tex).xy;
	vec2 velocity = texture2D(velDenSamp, tex).xy;
	vec2 border = texture2D(borderSamp, tex).xy;
	float density = texture2D(velDenSamp, tex).z;
	
	vec2 direction = vec2(0.);
	density = 0.0;
	for(float x = 0.; x < 1.; x+=(1./32.)) {
		for(float y = 0.; y < 1.; y+=(1./32.)) {
			vec2 otherPos = texture2D(posSamp, vec2(x, y)).xy;
			vec2 delta = abs(otherPos - position);
			float diff = sqrt(pow(delta.x, 2.) + pow(delta.y, 2.));
			if(diff < 20.)
				density += 0.05;
						
		}
	}
	
	velocity.xy += direction;
	gl_FragColor = vec4(velocity, density, 1.0);
}