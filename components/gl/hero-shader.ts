/**
 * Hero shaders — a slow, flowing noise field in near-black with electric
 * lime filaments, and the relic: an iridescent fluid form raymarched in
 * the same pass, sitting in the field as the hero's one object.
 *
 * Two passes a frame:
 *
 *  1. FIELD_FRAG, a tiny ping-pong simulation (≈192×108, RGBA8). The
 *     pointer's motion is splatted in as velocity; every cell then advects
 *     along its own velocity and decays. The result is a trail that keeps
 *     moving after the cursor has gone, carried off by the current.
 *
 *  2. FRAG_SHADER, the picture. 2D simplex noise (Ashima/Gustavson) →
 *     4-octave fbm → two-pass domain warp for the field; lime only on a
 *     narrow ridge band, sampled per channel so disturbed regions split
 *     into a faint spectrum. Then, inside a bounding disc around
 *     `u_relic`, a sphere-distance-field displaced by layered noise is
 *     raymarched with parallel rays: a dark liquid body, thin-film
 *     iridescence that cycles with the view angle, a lime key light and a
 *     soft lime halo. It tilts toward the pointer (`u_tilt`) and sinks
 *     with the page curtain (`u_calm`).
 */

export const VERT_SHADER = /* glsl */ `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

export const FIELD_FRAG = /* glsl */ `
precision mediump float;

uniform sampler2D u_field;
uniform vec2  u_pointer;    // where the pointer is, in uv
uniform vec2  u_pointerVel; // how fast it moved, in uv per frame, scaled
uniform float u_aspect;     // width / height
uniform float u_dt;         // frames since last step, ~1 at 60 fps
uniform float u_time;

varying vec2 v_uv;

/* RGBA8 can't hold a signed value, so velocity lives around 0.5. */
vec2 decode(vec2 c) { return (c - 0.5) * 2.0; }
vec2 encode(vec2 v) { return v * 0.5 + 0.5; }

void main() {
  vec2 aspect = vec2(u_aspect, 1.0);
  vec2 vel = decode(texture2D(u_field, v_uv).rg);

  /* A slow underlying current, so even a still trail drifts. */
  vec2 drift = vec2(sin(v_uv.y * 6.0 + u_time * 0.35),
                    cos(v_uv.x * 5.0 + u_time * 0.25)) * 0.06;

  /* Semi-Lagrangian advection: fetch the value that flows into this cell. */
  vec2 back = v_uv - (vel + drift) * u_dt * 0.012 / aspect;
  vec4 src = texture2D(u_field, back);
  vec2 v = decode(src.rg);
  float d = src.b;

  /* Decay, with a dead zone below one byte step so trails vanish fully
     instead of parking at the smallest value the texture can hold. */
  v *= pow(0.965, u_dt);
  v = sign(v) * max(abs(v) - 0.004 * u_dt, 0.0);
  d = max(d * pow(0.955, u_dt) - 0.004 * u_dt, 0.0);

  /* Splat the pointer's motion in. */
  vec2 diff = (v_uv - u_pointer) * aspect;
  float g = exp(-dot(diff, diff) * 160.0);
  v += u_pointerVel * g;
  d += length(u_pointerVel) * g * 2.5;

  gl_FragColor = vec4(encode(clamp(v, -1.0, 1.0)), clamp(d, 0.0, 1.0), 1.0);
}
`;

export const FRAG_SHADER = /* glsl */ `
precision mediump float;

uniform vec2      u_res;
uniform float     u_time;
uniform vec2      u_pointer;
uniform float     u_disturb;   // 0 → calm, 1 → cursor actively moving
uniform float     u_calm;      // 0 → hero in view, 1 → fully under the curtain
uniform sampler2D u_field;     // the simulated trail: rg velocity, b density
uniform vec2      u_relic;     // the relic's centre, in screen uv
uniform float     u_relicSize; // its radius as a fraction of min(width, height)
uniform vec2      u_tilt;      // pointer-driven lean, radians
uniform float     u_quality;   // 1 → full march; lower on phones

const vec3 BG_0   = vec3(0.039, 0.039, 0.043); // #0A0A0B
const vec3 BG_2   = vec3(0.086, 0.086, 0.098); // #161619
const vec3 ACCENT = vec3(0.784, 0.941, 0.294); // #C8F04B

/* ── Ashima 2D simplex noise ─────────────────────────────────────── */
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                        + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                          dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x  = 2.0 * fract(p * C.www) - 1.0;
  vec3 h  = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

/* ── 4-octave fbm ────────────────────────────────────────────────── */
float fbm(vec2 p) {
  float total = 0.0;
  float amp   = 0.5;
  for (int i = 0; i < 4; i++) {
    total += snoise(p) * amp;
    p    *= 2.02;
    amp  *= 0.5;
  }
  return total;
}

/* The narrow band of field values that glows. */
float ridgeAt(float x) {
  return smoothstep(0.42, 0.50, x) * (1.0 - smoothstep(0.50, 0.62, x));
}

/* ── The relic ─────────────────────────────────────────────────────
 * Three slices of the 2D noise stand in for 3D noise: cheap, and the
 * seams never show on a surface that is itself moving. */
float noise3(vec3 p) {
  return snoise(p.xy + p.z * 0.71) * 0.55
       + snoise(p.yz * 1.3 - p.x * 0.5) * 0.30
       + snoise(p.zx * 0.9 + p.y * 0.4) * 0.15;
}

mat2 rot(float a) { float c = cos(a); float s = sin(a); return mat2(c, -s, s, c); }

float relicSDF(vec3 p) {
  p.xz = rot(u_time * 0.12 + u_tilt.x) * p.xz;
  p.yz = rot(u_tilt.y) * p.yz;
  float d = length(p) - 0.74;
  /* Low frequency only: it should read as liquid, not rock. */
  float swell = noise3(p * 1.35 + vec3(0.0, u_time * 0.18, 0.0));
  float skin  = noise3(p * 3.2 - vec3(u_time * 0.25));
  return d + swell * 0.16 + skin * 0.012;
}

vec3 relicNormal(vec3 p) {
  vec2 e = vec2(0.005, 0.0);
  return normalize(vec3(
    relicSDF(p + e.xyy) - relicSDF(p - e.xyy),
    relicSDF(p + e.yxy) - relicSDF(p - e.yxy),
    relicSDF(p + e.yyx) - relicSDF(p - e.yyx)));
}

/* Cheap per-pixel dither — kills banding across the dark gradient. */
float dither(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float unit = min(u_res.x, u_res.y);

  /* Aspect-corrected space so the field doesn't stretch on wide screens. */
  vec2 p = (gl_FragCoord.xy - 0.5 * u_res.xy) / unit;
  vec2 ptr = (u_pointer * u_res.xy - 0.5 * u_res.xy) / unit;

  float t = u_time * 0.06;

  /* Energy gathers under the cursor. */
  float d     = distance(p, ptr);
  float focus = exp(-d * 4.5);

  /* The trail the cursor left behind. */
  vec4 fld = texture2D(u_field, uv);
  vec2 flow = (fld.rg - 0.5) * 2.0;
  float wake = fld.b;

  /* ── The field ─────────────────────────────────────────────────── */
  vec2 pw = p + flow * 0.16;
  vec2 q = vec2(fbm(pw * 1.4 + vec2(0.0, t)),
                fbm(pw * 1.4 + vec2(5.2, 1.3 - t)));
  vec2 r = vec2(fbm(pw * 1.4 + (1.7 + focus * 0.9) * q + vec2(1.7 + t * 2.0, 9.2)),
                fbm(pw * 1.4 + (1.7 + focus * 0.9) * q + vec2(8.3 - t * 1.6, 2.8)));
  float f = fbm(pw * 1.4 + 1.3 * r);

  float shade = smoothstep(-0.6, 0.9, f);
  vec3 color  = mix(BG_0, BG_2, shade);

  float spread = 0.010 + wake * 0.03 + focus * u_disturb * 0.02;
  vec3 ridge = mix(vec3(ridgeAt(f)),
                   vec3(ridgeAt(f - spread), ridgeAt(f), ridgeAt(f + spread)),
                   0.55);
  float energy = (0.35 + focus * 0.15 + wake * 0.3) * (1.0 - u_calm * 0.75);
  color += ACCENT * ridge * energy;
  color += ACCENT * smoothstep(0.30, 0.70, f) * 0.035 * (1.0 - u_calm * 0.5);

  /* ── The relic ─────────────────────────────────────────────────── */
  vec2 rc = (u_relic - 0.5) * u_res.xy / unit;
  vec2 sp = (p - rc) / u_relicSize;
  float hit = 0.0;
  float nearest = 10.0;
  vec3 relic = vec3(0.0);

  if (dot(sp, sp) < 2.6) {
    vec3 ro = vec3(sp, -3.0);
    vec3 rd = vec3(0.0, 0.0, 1.0);
    float tt = 1.6;
    int steps = int(48.0 * u_quality);
    for (int i = 0; i < 48; i++) {
      if (i >= steps) break;
      vec3 pp = ro + rd * tt;
      float dd = relicSDF(pp);
      nearest = min(nearest, dd);
      if (dd < 0.004) { hit = 1.0; break; }
      tt += dd * 0.85;
      if (tt > 4.6) break;
    }
    if (hit > 0.5) {
      vec3 pp = ro + rd * tt;
      vec3 n = relicNormal(pp);
      vec3 v = -rd;
      float facing = max(dot(n, v), 0.0);
      float fres = pow(1.0 - facing, 2.5);
      vec3 key = normalize(vec3(-0.6, 0.8, -0.5));
      float diff = max(dot(n, key), 0.0);
      float spec = pow(max(dot(reflect(-key, n), v), 0.0), 56.0);
      /* Thin film: hue cycles with the view angle, drifting with time. */
      /* Kept to the cool half of the wheel plus lime — no hot reds. */
      vec3 film = 0.5 + 0.5 * cos(6.2831 * (facing * 1.2 + vec3(0.18, 0.38, 0.62)) + u_time * 0.25);
      film = mix(film, vec3(film.g, film.g, film.b), 0.6);
      vec3 body = mix(BG_0 * 0.8, BG_2 * 1.6, diff);
      relic = body + film * fres * 0.72 + ACCENT * spec * 0.9 + ACCENT * pow(fres, 3.0) * 0.4;
      /* Pressed by the wake: the surface flashes where a trail crosses it. */
      relic += ACCENT * wake * 0.25;
    }
  }
  float present = 1.0 - u_calm * 0.85;
  color = mix(color, relic, hit * present);
  /* Halo — a soft lime bloom just outside the silhouette. */
  color += ACCENT * exp(-max(nearest, 0.0) * 6.0) * 0.14 * (1.0 - hit) * present;

  /* Vignette — canvas melts into the page instead of showing a rectangle. */
  float vig = smoothstep(1.05, 0.25, length(uv - 0.5) * 1.6);
  color = mix(BG_0, color, vig);

  /* Under the curtain the whole field sinks toward the page. */
  color = mix(color, BG_0, u_calm * 0.45);

  color += (dither(gl_FragCoord.xy) - 0.5) * 0.012;

  gl_FragColor = vec4(color, 1.0);
}
`;
