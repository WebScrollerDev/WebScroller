attribute vec3 inPosition;
attribute vec2 inTexCoord;
attribute vec3 inNormal;
uniform mat4 modelViewMatrix;
uniform mat4 projMatrix;


varying vec2 texCoord;
varying vec3 normal;

void main(void)
{
	gl_Position = projMatrix * modelViewMatrix * vec4(inPosition, 1.0);
	texCoord = inTexCoord;
	normal = inNormal;
}

