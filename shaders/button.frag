precision mediump float;
varying vec3 normal;
varying vec2 texCoord;

uniform sampler2D inTexSample;

void main(void)
{
	vec4 textureColor = texture2D(inTexSample, texCoord);
	if (textureColor.a < 0.5) 
		discard;
	else
		gl_FragColor = vec4(textureColor.rgb, textureColor.a);
}