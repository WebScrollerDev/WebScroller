attribute vec2 inPos;
attribute vec2 inTex;

varying vec2 tex;

void main(void) {
	gl_Position = vec4(1.);
	tex = inTex;
}