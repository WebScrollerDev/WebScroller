precision highp float;

uniform sampler2D samp1;
uniform sampler2D samp2;

varying vec2 tex;

const float d = 1./16., e2 = .01,  dt2 = .00001;
void main(void) {
	vec4 tmp1 = texture2D(samp1, tex);
	vec4 tmp2 = texture2D(samp2, tex);
	
	/*for(float x = 0; x < 1; x += d) {
		for(float y = 0; y < 1; y += d) {
			vec
		}
	}*/
	
	//gl_FragColor = vec4(tmp2.x + tmp2.z, tmp2.y + tmp2.a, tmp2.z, tmp2.a);
	tmp1.x -= 0.001;
	tmp1.y -= 0.001;
	gl_FragColor = tmp1;
	/*vec3 r = texture2D(samp2, tex).xyz;
	vec3 r1  = texture2D(samp1, tex).xyz;
	vec3 f = vec3( 0. );
	for(float y = 0.; y < 1.; y += d ){
		for(float x = 0.; x < 1.; x += d ){
			vec3 v = texture2D(samp1, tex + vec2(x, y)).xyz - r1;
			float a = dot(v, v) + e2;
			f += v/(a*sqrt(a));
		}
	}
	r = 2.*r1 - r1 + f*dt2;
	gl_FragColor = vec4(r, 1. );*/
}