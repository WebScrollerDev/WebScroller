precision mediump float;
uniform vec3 inColor;
void main(void)
{
    gl_FragColor = vec4(inColor, 1.0);
}