/**
 * Portrait dither. The photo arrives as an ordered-dither print in the
 * page's own two tones — ink on near-black, with a thread of lime where
 * a pixel sits right on the threshold — and resolves into the photograph
 * as the section enters. Under the pointer it un-resolves again in a
 * soft disc, so the effect can be replayed by hand.
 */
export const DITHER_FRAG = /* glsl */ `
precision mediump float;

uniform sampler2D u_tex;
uniform vec2  u_res;     // drawing-buffer size
uniform float u_resolve; // 0 → dithered, 1 → the photograph
uniform float u_hover;   // 0 → at rest, 1 → pointer over the portrait
uniform vec2  u_pointer; // pointer over the portrait, in uv
uniform float u_cell;    // dither cell size in buffer pixels
uniform float u_time;

varying vec2 v_uv;

const vec3 BG_0   = vec3(0.039, 0.039, 0.043); // #0A0A0B
const vec3 INK    = vec3(0.957, 0.957, 0.949); // #F4F4F2
const vec3 ACCENT = vec3(0.784, 0.941, 0.294); // #C8F04B

/* 8×8 Bayer threshold without bit operations (GLSL ES 1.0 has none). */
float bayer2(vec2 a) { a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a) { return bayer4(0.5 * a) * 0.25 + bayer2(a); }

void main() {
  vec3 photo = texture2D(u_tex, v_uv).rgb;
  float lum = dot(photo, vec3(0.299, 0.587, 0.114));
  vec3 grey = vec3(lum);

  /* The print: one threshold per cell, a touch of lime on the knife edge. */
  vec2 cell = floor(gl_FragCoord.xy / u_cell);
  float threshold = bayer8(cell);
  float on = step(threshold, lum);
  float edge = 1.0 - smoothstep(0.0, 0.05, abs(lum - threshold));
  vec3 print = mix(BG_0, INK, on);
  print = mix(print, ACCENT, edge * 0.6);

  /* The pointer un-resolves a soft, slowly breathing disc. */
  vec2 aspect = vec2(u_res.x / u_res.y, 1.0);
  float d = length((v_uv - u_pointer) * aspect);
  float disc = u_hover * exp(-d * (3.0 + sin(u_time * 2.5) * 0.4));
  float resolve = clamp(u_resolve - disc, 0.0, 1.0);

  /* The photograph sits grey until hovered, as it did in CSS. */
  vec3 picture = mix(grey, photo, u_hover);

  gl_FragColor = vec4(mix(print, picture, resolve), 1.0);
}
`;
