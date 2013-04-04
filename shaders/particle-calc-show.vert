attribute vec2 inPoints;
uniform mat4 mvMatrix;
uniform mat4 prMatrix;
uniform sampler2D sampl1;
varying vec4 color;
void main(void) {
	gl_Position = prMatrix * mvMatrix * texture2D(sampl1, inPoints);
	gl_PointSize = 2.;
	color = vec4(1., 1., 0., 1.);
}