precision mediump float;
varying vec3 normal;
varying vec2 texCoord;

void main(void)
{
	//gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
	//gl_FragColor = vec4(normal, 1.0);
	gl_FragColor = vec4(texCoord, 0.0, 1.0);
}