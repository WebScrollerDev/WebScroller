precision highp float;

uniform sampler2D posSamp;
uniform sampler2D velSamp;
uniform vec4 worldSize;
varying vec2 tex;



void main(void) {

	vec2 position = texture2D(posSamp, tex).xy;
	vec2 velocity = texture2D(velSamp, tex).xy;
	position += velocity;
	
	if(position.x > worldSize.z)
		position.x = worldSize.x;
	else if(position.y > worldSize.w)
		position.y = worldSize.y;
		
	if(position.x < worldSize.x)
		position.x = worldSize.z;
	else if(position.y < worldSize.y)
		position.y = worldSize.w;

	gl_FragColor = vec4(position, 0.0, 1.0);
}