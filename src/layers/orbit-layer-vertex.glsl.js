export default `\

#define SHADER_NAME orbit-layer-vertex-shader

attribute vec3 positions;
attribute vec4 instancePositions;
attribute vec4 instanceColors;

uniform float opacity;
uniform float renderPickingBuffer;


`