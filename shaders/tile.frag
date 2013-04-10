precision highp float;
varying vec3 normal;
varying vec2 texCoord;
varying vec3 viewPos;
varying vec3 viewNorm;

uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform sampler2D inTexSample;
uniform vec3 lightPos[1];
uniform vec3 lightColor[1];

void main(void)
{
	vec3 Ia = vec3(1.0, 1.0, 0.0) * 0.2;
    vec3 Id = vec3(0.0);
	
	vec3 tmpLightPos = vec3(415, 50, 10);
	vec3 tmpLightColor = vec3(1.0, 1.0, 0.0);
	//const int tmp = lightNrs;
	for(int i = 0; i < 1; i++) {
        vec3 lightPosView = vec3(viewMatrix * vec4(tmpLightPos, 1.0));
		vec3 lightDirection = normalize(tmpLightPos - viewPos);
		float distfactor = pow(1./(length(tmpLightPos - viewPos)),0.1);
        float dot_prod = max(dot(normalize(normal), lightDirection), 0.0);
        Id = Id + tmpLightColor * dot_prod * distfactor;
    }

  vec4 textureColor = texture2D(inTexSample, texCoord) * vec4(vec3(Id), 1.0);
  if (textureColor.a < 0.5) 
    discard;
  else
    gl_FragColor = vec4(textureColor.rgb, textureColor.a);

}