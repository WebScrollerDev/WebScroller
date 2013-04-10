attribute vec3 inPosition;
attribute vec2 inTexCoord;
attribute vec3 inNormal;
uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat4 projMatrix;

varying vec2 texCoord;
varying vec3 normal;
varying vec3 viewPos;
varying vec3 viewNorm;

void main(void)
{
	viewPos = vec3(viewMatrix * vec4(inPosition, 1.0));
    viewNorm = vec3(viewMatrix * vec4(inNormal, 0.0));
	normal = inNormal;
	texCoord = inTexCoord;
	gl_Position = projMatrix * modelViewMatrix * vec4(inPosition, 1.0);
}