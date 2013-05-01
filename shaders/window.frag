precision mediump float;
varying vec3 normal;
varying vec2 texCoord;

uniform sampler2D inTexSample;

void main(void)
{
	//gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
	//gl_FragColor = vec4(normal, 1.0);
	//vec4 texColor = texture2D(inTexSample, texCoord);
	//gl_FragColor = vec4(texColor.rgb, texColor.a * alpha);
	//gl_FragColor = vec4(texCoord, 0.0, 1.0);

  vec4 textureColor = texture2D(inTexSample, texCoord);
  if (textureColor.a < 0.5) 
    discard;
  else
    gl_FragColor = vec4(textureColor.rgb, textureColor.a);

}