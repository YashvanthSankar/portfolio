/**
 * Hero background shaders — a slow, flowing noise field in near-black with
 * electric-lime filaments, and the wordmark woven into the flow.
 *
 * Two passes a frame:
 *
 *  1. FIELD_FRAG, a tiny ping-pong simulation (≈192×108, RGBA8). The
 *     pointer's motion is splatted in as velocity; every cell then advects
 *     along its own velocity and decays. The result is a trail that keeps
 *     moving after the cursor has gone, carried off by the current.
 *
 *  2. FRAG_SHADER, the picture. 2D simplex noise (Ashima/Gustavson) →
 *     4-octave fbm → two-pass domain warp. Lime is injected only on a
 *     narrow band of the final field value, so it reads as glowing ridges
 *     in darkness rather than a green wash. The ridge is sampled three
 *     times at a small offset, one per channel, so disturbed regions
 *     split into a faint spectrum like light through a prism.
 *
 * The wordmark is a luminance texture sampled through the *same* warp
 * field, so it sits inside the current rather than on top of it. Near
 * the pointer the warp amplitude spikes, which shreds the letterforms
 * into the flow and lets them re-form as the cursor moves away. The
 * simulated trail does the same wherever it passes.
 *
 * `u_calm` runs 0→1 as the page curtain rises over the hero: the lime
 * dims and the field sinks toward the page colour, so the handover to
 * the next section is a fade rather than a cut.
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
uniform float     u_disturb;    // 0 → calm, 1 → cursor actively shredding
uniform float     u_calm;       // 0 → hero in view, 1 → fully under the curtain
uniform sampler2D u_text;
uniform vec2      u_textScale;  // aspect fit for the wordmark texture
uniform vec2      u_textOffset; // where its centre sits, in screen uv
uniform float     u_textGain;   // 0 → no imprint at all (touch devices)
uniform sampler2D u_field;      // the simulated trail: rg velocity, b density

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

/* Cheap per-pixel dither — kills banding across the dark gradient. */
float dither(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res.xy;

  /* Aspect-corrected space so the field doesn't stretch on wide screens. */
  vec2 p = (gl_FragCoord.xy - 0.5 * u_res.xy) / min(u_res.x, u_res.y);
  vec2 ptr = (u_pointer * u_res.xy - 0.5 * u_res.xy) / min(u_res.x, u_res.y);

  float t = u_time * 0.06;

  /* Energy gathers under the cursor. */
  float d     = distance(p, ptr);
  float focus = exp(-d * 4.5);

  /* The trail the cursor left behind. */
  vec4 fld = texture2D(u_field, uv);
  vec2 flow = (fld.rg - 0.5) * 2.0;
  float wake = fld.b;

  /* ── The imprint ───────────────────────────────────────────────────
   * The wordmark is never drawn. It's a relief map: the letterforms are
   * pressed into the field, and their slopes bend the flow around them.
   * What you read is the wave deforming, not type sitting on top.
   * ────────────────────────────────────────────────────────────────── */
  vec2 tuv = (uv - 0.5 - u_textOffset) * u_textScale + 0.5;
  bool inText = u_textGain > 0.0 &&
                tuv.x > 0.0 && tuv.x < 1.0 && tuv.y > 0.0 && tuv.y < 1.0;

  float relief = 0.0;
  vec2  slope  = vec2(0.0);
  if (inText) {
    vec2 texel = vec2(3.0 / 2048.0, 3.0 / 512.0);
    /* Gain holds it well under the type in front of it — this is scenery
       behind a headline, not a second headline. */
    relief = texture2D(u_text, tuv).r * u_textGain;
    /* Central differences → the surface normal of the stamped edge. */
    slope = vec2(
      texture2D(u_text, tuv + vec2(texel.x, 0.0)).r -
      texture2D(u_text, tuv - vec2(texel.x, 0.0)).r,
      texture2D(u_text, tuv + vec2(0.0, texel.y)).r -
      texture2D(u_text, tuv - vec2(0.0, texel.y)).r
    ) * u_textGain;
  }

  /* Cursor and wake both smear the stamp — the deeper the disturbance,
     the more the flow tears the letterforms apart before they settle. */
  float tear  = focus * u_disturb + wake;
  float smear = 1.0 + focus * u_disturb * 7.0 + wake * 5.0;

  /* Flow is deflected by the imprint's slopes, so streamlines pile up
     against the strokes exactly like liquid over a pressed surface; the
     wake's own velocity bends it too. */
  vec2 pw = p - slope * 0.13 * smear + flow * 0.16;

  /* Two-pass domain warp. */
  vec2 q = vec2(fbm(pw * 1.4 + vec2(0.0, t)),
                fbm(pw * 1.4 + vec2(5.2, 1.3 - t)));
  vec2 r = vec2(fbm(pw * 1.4 + (1.7 + focus * 0.9) * q + vec2(1.7 + t * 2.0, 9.2)),
                fbm(pw * 1.4 + (1.7 + focus * 0.9) * q + vec2(8.3 - t * 1.6, 2.8)));
  float f = fbm(pw * 1.4 + 1.3 * r);

  /* Press the name down into the surface. Because the lime ridges are
     iso-contours of the field, lowering it inside the strokes drags
     every contour into the shape of the letters. */
  float depth = relief * max(0.44 - tear * 0.36, 0.0);
  f -= depth;

  /* Base: near-black lifting toward the raised surface tone. */
  float shade = smoothstep(-0.6, 0.9, f);
  vec3 color  = mix(BG_0, BG_2, shade);

  /* ── Lime ridges, with a little dispersion ───────────────────────
   * Each channel reads the ridge at a slightly different field value.
   * At rest the three almost coincide; where the field is disturbed the
   * spread widens and the ridge splits into a faint spectrum. */
  float spread = 0.010 + wake * 0.03 + focus * u_disturb * 0.02;
  vec3 ridge = mix(vec3(ridgeAt(f)),
                   vec3(ridgeAt(f - spread), ridgeAt(f), ridgeAt(f + spread)),
                   0.55);
  float energy = (0.35 + focus * 0.15 + wake * 0.3) * (1.0 - u_calm * 0.75);
  color += ACCENT * ridge * energy;

  /* Rim light on the stamped edge — the bevel catching the light is what
     makes it read as depth rather than a silhouette. */
  float bevel = length(slope);
  float lit = max(0.0, dot(normalize(slope + vec2(1e-5)), normalize(vec2(-0.6, 0.8))));
  color += ACCENT * bevel * (0.05 + lit * 0.17) * (1.0 - min(tear, 1.0) * 0.85);

  /* Interior sits marginally darker than its surroundings, the way a
     recess holds shadow. */
  color = mix(color, BG_0, relief * 0.14);

  /* A faint wide bloom around the ridges so they read as glowing. */
  color += ACCENT * smoothstep(0.30, 0.70, f) * 0.035 * (1.0 - u_calm * 0.5);

  /* Vignette — canvas melts into the page instead of showing a rectangle. */
  float vig = smoothstep(1.05, 0.25, length(uv - 0.5) * 1.6);
  color = mix(BG_0, color, vig);

  /* Under the curtain the whole field sinks toward the page. */
  color = mix(color, BG_0, u_calm * 0.45);

  color += (dither(gl_FragCoord.xy) - 0.5) * 0.012;

  gl_FragColor = vec4(color, 1.0);
}
`;
