precision highp float;

uniform sampler2D posSamp;
uniform sampler2D velSamp;

uniform vec2 inPosPlayer;
uniform vec2 inVelPlayer;

varying vec2 tex;

const float playerRadius = 15.;
const float maxVelocity = 0.1;

void main(void) {

	vec2 position = texture2D(posSamp, tex).xy;
	vec2 velocity = texture2D(velSamp, tex).xy;
	
	//Calculate particle-player collision
	if( (inPosPlayer.x + playerRadius) > position.x && (inPosPlayer.x - playerRadius) < position.x &&
	    (inPosPlayer.y + playerRadius) > position.y && (inPosPlayer.y - playerRadius) < position.y) {
		velocity += inVelPlayer * 0.05;	
		}
		
	if(velocity.x > maxVelocity)
		velocity.x -= 0.01;
	else if(velocity.x < -maxVelocity)
		velocity.x += 0.01;
		
	if(velocity.y > maxVelocity)
		velocity.y -= 0.01;
	else if(velocity.y < -maxVelocity)
		velocity.y += 0.01;

	gl_FragColor = vec4(velocity, 1.0, 1.0);
}