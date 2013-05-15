attribute vec2 inPosition;

uniform mat4 modelViewMatrix;
uniform mat4 projMatrix;

void main(void)
{
	gl_Position = projMatrix * modelViewMatrix * vec4(inPosition, 2.0, 1.0);
	gl_Color = vec4(1.0, 1.0, 1.0, 0.9);
}