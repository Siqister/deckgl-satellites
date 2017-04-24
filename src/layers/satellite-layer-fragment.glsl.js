export default `\
#define SHADER_NAME satellite-layer-fragment-shader

#ifdef GL_ES
precision highp float;
#endif

varying vec4 vColor;
varying vec2 unitPosition;
varying float innerUnitRadius;

void main(void) {

  float distToCenter = length(unitPosition);

  if (distToCenter <= 1.0 && distToCenter >= innerUnitRadius) {
    gl_FragColor.r = vColor.r;
    gl_FragColor.g = vColor.g;
    gl_FragColor.b = vColor.b;
    gl_FragColor.a = 1.0 - distToCenter/1.0;
  } else {
    discard;
  }
}
`;