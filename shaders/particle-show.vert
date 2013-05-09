attribute vec2 inPoints;
uniform mat4 modelViewMatrix;
uniform mat4 projMatrix;
uniform sampler2D posSamp;

varying vec2 tex;
void main(void) {
	tex = inPoints;
	gl_Position = projMatrix * modelViewMatrix * texture2D(posSamp, inPoints);
	gl_PointSize = 10.;
}