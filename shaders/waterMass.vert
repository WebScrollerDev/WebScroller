attribute vec2 inPosition;
attribute vec3 inColor;
uniform mat4 modelViewMatrix;
uniform mat4 projMatrix;

varying vec3 color;
void main(void)
{
	gl_Position = projMatrix * modelViewMatrix * vec4(inPosition, 2.0, 1.0);
	color = inColor;
}