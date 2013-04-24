precision highp float;
varying vec3 normal;
varying vec2 texCoord;
varying vec3 viewPos;
varying vec3 viewNorm;

uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform sampler2D inTexSample;
uniform vec3 lightPos[32];
uniform vec3 lightColor[32];
uniform float lightIntensity[32];

uniform vec2 trans;
const float blurSize = 1.0/1024.0;

void main(void)
{
	vec3 Ia = vec3(1.0, 1.0, 0.0) * 0.1;
    vec3 Id = vec3(0.0);
	for(int i = 0; i < 1; i++) {
		vec3 lightPosTrans = vec3(lightPos[i].x - trans.x, lightPos[i].y - trans.y, lightPos[i].z);
        vec3 lightDirection = normalize(lightPosTrans - viewPos);
		float distfactor = pow(1./(length(lightPosTrans - viewPos)),0.4);
        Id += lightColor[i] * vec3(distfactor) * lightIntensity[i];
    }
	vec4 sum = vec4(0.0);

	// take nine samples in x-led, with the distance blurSize between them
	sum += texture2D(inTexSample, vec2(texCoord.x - 4.0*blurSize, texCoord.y)) * 0.03;
	sum += texture2D(inTexSample, vec2(texCoord.x - 3.0*blurSize, texCoord.y)) * 0.05;
	sum += texture2D(inTexSample, vec2(texCoord.x - 2.0*blurSize, texCoord.y)) * 0.1;
	sum += texture2D(inTexSample, vec2(texCoord.x - blurSize, texCoord.y)) * 0.1;
	sum += texture2D(inTexSample, vec2(texCoord.x, texCoord.y)) * 0.2;
	sum += texture2D(inTexSample, vec2(texCoord.x + blurSize, texCoord.y)) * 0.1;
	sum += texture2D(inTexSample, vec2(texCoord.x + 2.0*blurSize, texCoord.y)) * 0.1;
	sum += texture2D(inTexSample, vec2(texCoord.x + 3.0*blurSize, texCoord.y)) * 0.05;
	sum += texture2D(inTexSample, vec2(texCoord.x + 4.0*blurSize, texCoord.y)) * 0.03;

	// take nine samples in y-led, with the distance blurSize between them
	sum += texture2D(inTexSample, vec2(texCoord.x, texCoord.y - 4.0*blurSize)) * 0.03;
	sum += texture2D(inTexSample, vec2(texCoord.x, texCoord.y - 3.0*blurSize)) * 0.05;
	sum += texture2D(inTexSample, vec2(texCoord.x, texCoord.y - 2.0*blurSize)) * 0.1;
	sum += texture2D(inTexSample, vec2(texCoord.x, texCoord.y - blurSize)) * 0.1;
	sum += texture2D(inTexSample, vec2(texCoord.x, texCoord.y)) * 0.2;
	sum += texture2D(inTexSample, vec2(texCoord.x, texCoord.y + blurSize)) * 0.1;
	sum += texture2D(inTexSample, vec2(texCoord.x, texCoord.y + 2.0*blurSize)) * 0.1;
	sum += texture2D(inTexSample, vec2(texCoord.x, texCoord.y + 3.0*blurSize)) * 0.05;
	sum += texture2D(inTexSample, vec2(texCoord.x, texCoord.y + 4.0*blurSize)) * 0.03;
		
	sum *= vec4(vec3(Ia + Id), 1.0);
  if (sum.a < 0.9) 
    discard;
  else
    gl_FragColor = sum;

}