precision highp float;
varying vec3 normal;
varying vec2 texCoord;

uniform sampler2D inTexSample;
uniform float fade;


//uniform sampler2D RTScene; // the texture with the scene you want to blur
const float blurSize = 1.0/1024.0; // I've chosen this size because this will result in that every step will be one pixel wide if the RTScene texture is of size 512x512

void main(void)
{
//	vec4 textureColor = texture2D(inTexSample, texCoord);
//	if (textureColor.a < 0.001) 
	//	discard;
	//else{
		vec4 sum = vec4(0.0);

		// take nine samples in x-led, with the distance blurSize between them
		sum += texture2D(inTexSample, vec2(texCoord.x - 4.0*blurSize, texCoord.y)) * 0.01;
		sum += texture2D(inTexSample, vec2(texCoord.x - 3.0*blurSize, texCoord.y)) * 0.02;
		sum += texture2D(inTexSample, vec2(texCoord.x - 2.0*blurSize, texCoord.y)) * 0.03;
		sum += texture2D(inTexSample, vec2(texCoord.x - blurSize, texCoord.y)) * 0.05;
		sum += texture2D(inTexSample, vec2(texCoord.x, texCoord.y)) * 0.09;
	    sum += texture2D(inTexSample, vec2(texCoord.x + blurSize, texCoord.y)) * 0.05;
		sum += texture2D(inTexSample, vec2(texCoord.x + 2.0*blurSize, texCoord.y)) * 0.03;
		sum += texture2D(inTexSample, vec2(texCoord.x + 3.0*blurSize, texCoord.y)) * 0.02;
		sum += texture2D(inTexSample, vec2(texCoord.x + 4.0*blurSize, texCoord.y)) * 0.01;
	
		// take nine samples in y-led, with the distance blurSize between them
		sum += texture2D(inTexSample, vec2(texCoord.x, texCoord.y - 4.0*blurSize)) * 0.01;
		sum += texture2D(inTexSample, vec2(texCoord.x, texCoord.y - 3.0*blurSize)) * 0.02;
		sum += texture2D(inTexSample, vec2(texCoord.x, texCoord.y - 2.0*blurSize)) * 0.03;
		sum += texture2D(inTexSample, vec2(texCoord.x, texCoord.y - blurSize)) * 0.05;
		sum += texture2D(inTexSample, vec2(texCoord.x, texCoord.y)) * 0.09;
		sum += texture2D(inTexSample, vec2(texCoord.x, texCoord.y + blurSize)) * 0.05;
		sum += texture2D(inTexSample, vec2(texCoord.x, texCoord.y + 2.0*blurSize)) * 0.03;
		sum += texture2D(inTexSample, vec2(texCoord.x, texCoord.y + 3.0*blurSize)) * 0.02;
		sum += texture2D(inTexSample, vec2(texCoord.x, texCoord.y + 4.0*blurSize)) * 0.01;
		if (sum.a < 0.001)
			discard;
		else
			gl_FragColor = sum * vec4(1.0,1.0,1.0,fade);
//	}
}