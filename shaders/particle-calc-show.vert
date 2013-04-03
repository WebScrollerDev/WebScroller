attribute vec2 inPosition;

uniform mat4 projMatrix;
uniform mat4 modelViewMatrix;
varying vec4 color;
void main(void) {
	gl_Position = projMatrix * modelViewMatrix * vec4(inPosition, 0., 1.);//texture2D(samp1, inTex); //
	color = vec4(1., 0., 0., 1.);
}