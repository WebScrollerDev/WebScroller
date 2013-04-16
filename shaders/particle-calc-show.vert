attribute vec2 inPoints;
uniform mat4 modelViewMatrix;
uniform mat4 projMatrix;
uniform sampler2D samp1;
varying vec4 color;
void main(void) {
	gl_Position = projMatrix * modelViewMatrix * texture2D(samp1, inPoints);
	gl_PointSize = 2.;
	color = vec4(.5, .5, 1., .3);
}