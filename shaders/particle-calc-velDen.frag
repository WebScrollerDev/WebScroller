precision highp float;

uniform sampler2D posSamp;
uniform sampler2D velDenSamp;
uniform sampler2D borderSamp;
uniform vec2 borderPos;
uniform vec2 inPosPlayer;
uniform vec2 inVelPlayer;
uniform vec2 inWarpTo;

varying vec2 tex;
const float gravity = 0.05;
const float borderSize = 512.;
const float d = 1./32.;
const float particleRadius = 4.;
const float restitution = .85;
const float playerRadius = 15.;

bool isInsideQuad(vec2 rectCenter, float radius, vec2 point) {
	if(rectCenter.x + radius > point.x && rectCenter.x - radius < point.x && rectCenter.y + radius > point.y && rectCenter.y - radius < point.y)
		return true;
	return false;
}

void main(void) {

	vec2 position = texture2D(posSamp, tex).xy;
	vec2 velocity = texture2D(velDenSamp, tex).xy;
	float density = texture2D(velDenSamp, tex).z;
	
	//Calculate particle-particle collision and density
	velocity.y -= gravity;
	density = 0.0;	

	for(float x = 0.; x < 1.; x+=d) {
		for(float y = 0.; y < 1.; y+=d) {
		
			vec2 otherPos = texture2D(posSamp, vec2(x, y)).xy;
			vec2 otherVel = texture2D(velDenSamp, vec2(x, y)).xy;

			vec2 delta = position - otherPos;
			float diff = sqrt((delta.x*delta.x) + (delta.y*delta.y));
			
			if(diff < 10.) {
				density += 0.05;			
			}		
			
			vec2 deltaAfterVel = (position+velocity) - (otherPos+otherVel);
			float diffAfterVel = sqrt((deltaAfterVel.x*deltaAfterVel.x) + (deltaAfterVel.y*deltaAfterVel.y));
			
			if(diffAfterVel < particleRadius*2.) {	// if colliding
					
						// minimum translation distance to push balls apart after intersecting
						vec2 mtd = delta * (((particleRadius*2.)-diff)/diff); 

						// impact speed
						vec2 v = velocity - otherVel;
						float vn = dot(v,normalize(mtd));

						// sphere intersecting but moving away from each other already
						if (vn > 0.) continue;

						// collision impulse
						float i = (-(1. + restitution) * vn) / 6.5;
						vec2 impulse = mtd*i;

						// change in momentum
						velocity = velocity+impulse;
						otherVel = otherVel-impulse;		
			}			
		}
	}

	//Calculate particle-player collision
	if( (inPosPlayer.x + playerRadius) > position.x && (inPosPlayer.x - playerRadius) < position.x &&
	    (inPosPlayer.y + playerRadius) > position.y && (inPosPlayer.y - playerRadius) < position.y) {
		
		velocity += inVelPlayer * 0.1;
	   }

	//Calculate particle-border collisions
	
	vec2 nextPos = ((position - borderPos) + velocity)/borderSize;
	
	//----------------------------------------X----------------------------------------//
	if(nextPos.x < 1. && nextPos.x > 0.) {
		if(texture2D(borderSamp,vec2(nextPos.x, 1.0 - nextPos.y)).r == 0.) {
			velocity.x = -velocity.x*0.01;	// reflect from wall
		}
	} else
		velocity.x = -velocity.x*0.1;
	//----------------------------------------Y----------------------------------------//	
	if(nextPos.y < 1. && nextPos.y > 0.) {
		if(texture2D(borderSamp,vec2(nextPos.x, 1.0 - nextPos.y)).r == 0.) { // if solid block under particle
			if(texture2D(borderSamp,vec2( (nextPos.x - 5./borderSize) , (1.0 - (nextPos.y - 1./borderSize)) )).r != 0.)	// can go down to the left, down a hill
				velocity.x -= 0.1;
			else if(texture2D(borderSamp,vec2( (nextPos.x + 5./borderSize) , (1.0 - (nextPos.y - 1./borderSize)) )).r != 0.)	// can go down to the right, down a hill
				velocity.x += 0.1;
			
			velocity.y = 0.;	// set velocity.y = 0			
		}
	} else
		velocity.y = 0.0;
		
	// if inside warpzone		
	if(isInsideQuad(inWarpTo, 10., position)) {
		velocity = vec2(0., -gravity*5.);
	}

	gl_FragColor = vec4(velocity, density, 1.0);
}