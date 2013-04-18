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

void main(void)
{
	vec3 Ia = vec3(1.0, 1.0, 0.0) * 0.1;
    vec3 Id = vec3(0.0);
	for(int i = 0; i < 6; i++) {
		vec3 lightPosTrans = vec3(lightPos[i].x - trans.x, lightPos[i].y - trans.y, lightPos[i].z);
        vec3 lightDirection = normalize(lightPosTrans - viewPos);
		float distfactor = pow(1./(length(lightPosTrans - viewPos)),0.4);
        Id += lightColor[i] * vec3(distfactor) * lightIntensity[i];
    }

  vec4 textureColor = texture2D(inTexSample, texCoord) * vec4(vec3(Ia + Id), 1.0);
  if (textureColor.a < 0.9) 
    discard;
  else
    gl_FragColor = vec4(textureColor.rgb, textureColor.a);

}