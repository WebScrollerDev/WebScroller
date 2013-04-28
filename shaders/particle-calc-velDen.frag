precision highp float;

uniform sampler2D posSamp;
uniform sampler2D velDenSamp;
uniform sampler2D borderSamp;
uniform vec2 borderPos;

varying vec2 tex;
const float gravity = 0.01;
const float d = 1./32.;
void main(void) {

	vec2 position = texture2D(posSamp, tex).xy;
	vec2 velocity = texture2D(velDenSamp, tex).xy;
	//vec2 border = texture2D(borderSamp, tex).xy;
	float density = texture2D(velDenSamp, tex).z;

	//Calculate density
	density = 0.0;
	for(float x = 0.; x < 1.; x+=d) {
		for(float y = 0.; y < 1.; y+=d) {
			vec2 otherPos = texture2D(posSamp, vec2(x, y)).xy;
			vec2 otherVel = texture2D(velDenSamp, vec2(x, y)).xy;
			vec2 delta = otherPos - position;
			float diff = sqrt(pow(delta.x, 2.) + pow(delta.y, 2.));
			if(diff < 10.)
				density += 0.05;
			if(diff < 5.0) {
				if(delta.x < 0.)
					velocity.x += 0.01+(otherVel.x*0.01);
				else if(delta.x > 0.)
					velocity.x -= 0.01+(otherVel.x*0.01);
				if(delta.y < 0.)
					velocity.y += 0.01+(otherVel.y*0.01);
				else if(delta.y > 0.)
					velocity.y -= 0.01+(otherVel.y*0.01);
			}			
		}
	}

	
	//Calculate particle collisions

	//Calculate border collisions
	velocity.y -= gravity;
	if(density > 6.)
		velocity *= vec2(1.0, 0.1);
	vec2 tmp = ((position - borderPos) + velocity)/512.;
	if(tmp.x < 1. && tmp.x > 0.) {
		if(texture2D(borderSamp,vec2(tmp.x, 1.0 - tmp.y)).r == 0.) {
			velocity.x = -velocity.x*0.01;
		}
	} else
		velocity.x = 0.0;
	if(tmp.y < 1. && tmp.y > 0.) {
		if(texture2D(borderSamp,vec2(tmp.x, 1.0 - tmp.y)).r == 0.) {
			velocity.y = -velocity.y*0.01;
		}
	} else
		velocity.y = 0.0;

	gl_FragColor = vec4(velocity, density, 1.0);
}