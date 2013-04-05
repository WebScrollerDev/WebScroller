precision mediump float;
varying vec3 normal;
varying vec2 texCoord;
varying vec3 viewPos;
varying vec3 viewNorm;

uniform mat4 modelViewMatrix;
uniform sampler2D inTexSample;
uniform vec3 lightPos[32];
uniform vec3 lightColor[32];
uniform int lightNr;


uniform float alpha;

void main(void)
{
	vec3 Ia = vec3(1.0, 1.0, 0.0) * 0.2;
    vec3 Id = vec3(0.0);
	vec3 lightDirection;
	vec3 lightPosView;

	float dot_prod;
	float distfactor = 1.0;
	
	//vec3 tmpLightPos = vec3(20, 20, 10);
	//vec3 tmpLightColor = vec3(1.0, 1.0, 0.0);
	//const int tmp = lightNr;
	for(int i = 0; i < 2; i++) {
        lightPosView = vec3(modelViewMatrix * vec4(lightPos[i], 1.0));

        lightDirection = vec3(0.0);
        /*if (isDirectional[i]) {
            lightDirection = normalize(mat3(modelViewMatrix)*lightSourcesDirPosArr[i]);
        } else {*/
            lightDirection = normalize(lightPosView - viewPos);
			distfactor = pow(1./(length(lightPosView - viewPos)),0.1);
        //}
        dot_prod = max(dot(lightDirection, normalize(viewNorm)), 0.0);
        Id = Id + lightColor[i] * dot_prod * distfactor;
    }

  vec4 textureColor = texture2D(inTexSample, texCoord) * vec4(vec3(Id), 1.0);
  if (textureColor.a < 0.5) 
    discard;
  else
    gl_FragColor = vec4(textureColor.rgb, textureColor.a);

}