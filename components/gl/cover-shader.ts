/**
 * Project-cover distortion. The cover is a texture on a sheet: the pointer
 * sends ripples across it, scrolling bends it (the middle lags the edges,
 * like a page being dragged) and smears its colour channels along the
 * direction of travel. At rest it is a verbatim copy of the DOM cover.
 */
export const COVER_FRAG = /* glsl */ `
precision mediump float;

uniform sampler2D u_tex;
uniform vec2  u_pointer; // pointer over the cover, in uv
uniform float u_hover;   // 0 → at rest, 1 → pointer over the cover
uniform float u_vel;     // scroll velocity, signed, roughly -1..1
uniform float u_aspect;  // cover width / height
uniform float u_time;

varying vec2 v_uv;

void main() {
  /* A small inset so a displaced sample never reaches the clamped edge. */
  vec2 uv = (v_uv - 0.5) * 0.96 + 0.5;
  vec2 aspect = vec2(u_aspect, 1.0);

  /* Rings spreading from the pointer, fading with distance. */
  vec2 d = (uv - u_pointer) * aspect;
  float dist = length(d);
  float wave = sin(dist * 26.0 - u_time * 5.0) * exp(-dist * 4.5);
  uv += (normalize(d + 1e-4) * wave * 0.012 * u_hover) / aspect;

  /* Scroll bends the sheet. */
  float bulge = (0.5 - abs(v_uv.x - 0.5)) * 2.0;
  uv.y -= u_vel * 0.05 * bulge;

  /* Chromatic split along the direction of travel. */
  float split = u_vel * 0.015 + u_hover * 0.003;
  float r = texture2D(u_tex, uv + vec2(0.0, split)).r;
  float g = texture2D(u_tex, uv).g;
  float b = texture2D(u_tex, uv - vec2(0.0, split)).b;

  gl_FragColor = vec4(r, g, b, 1.0);
}
`;
