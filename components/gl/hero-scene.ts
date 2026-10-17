import { createPingPong, type PingPong } from "@/lib/gl/fbo";
import {
  FULLSCREEN_VERT,
  createProgram,
  drawFullscreen,
  fullscreenTriangle,
  uniforms,
} from "@/lib/gl/program";
import type { GlScene } from "@/lib/gl/use-gl-surface";
import { FIELD_FRAG, FRAG_SHADER, VERT_SHADER } from "@/components/gl/hero-shader";

/** Wordmark texture resolution. Power-of-two keeps WebGL 1 happy. */
const TEX_W = 2048;
const TEX_H = 512;

/** Width of the trail simulation; its height follows the viewport's aspect. */
const FIELD_W = 192;

const WORDMARK = "YASHVANTH";

/** Renders the wordmark to an offscreen canvas for use as a luminance mask. */
function drawWordmark(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = TEX_W;
  c.height = TEX_H;
  const ctx = c.getContext("2d");
  if (!ctx) return c;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, TEX_W, TEX_H);

  /* Fit the word to the texture width with a small margin. */
  const family =
    getComputedStyle(document.body).getPropertyValue("font-family") ||
    "system-ui, sans-serif";
  let size = 400;
  ctx.font = `600 ${size}px ${family}`;
  const target = TEX_W * 0.94;
  const measured = ctx.measureText(WORDMARK).width;
  size = Math.floor(size * (target / measured));

  ctx.font = `600 ${size}px ${family}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  ctx.letterSpacing = "-0.03em";
  ctx.fillText(WORDMARK, TEX_W / 2, TEX_H / 2);

  return c;
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/**
 * The hero field: two programs, one triangle, two textures. Owns the
 * pointer tracking and the trail simulation; the context, clock and
 * run/pause decisions belong to `useGlSurface`.
 *
 * `getCalm` reads how far the page curtain has risen (0→1); the field
 * dims with it and the pointer stops splatting once it is covered.
 */
export function createHeroScene(
  gl: WebGLRenderingContext,
  canvas: HTMLCanvasElement,
  coarse: boolean,
  getCalm: () => number
): GlScene | null {
  const main = createProgram(gl, VERT_SHADER, FRAG_SHADER);
  const sim = createProgram(gl, FULLSCREEN_VERT, FIELD_FRAG);
  if (!main || !sim) {
    if (main) gl.deleteProgram(main);
    if (sim) gl.deleteProgram(sim);
    return null;
  }

  /* One triangle serves both programs: the buffer stays bound, so the
     second program only needs its own attribute pointer. */
  const buffer = fullscreenTriangle(gl, main);
  {
    const loc = gl.getAttribLocation(sim, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  }

  const U = uniforms(gl, main, [
    "u_res",
    "u_time",
    "u_pointer",
    "u_disturb",
    "u_calm",
    "u_text",
    "u_textScale",
    "u_textOffset",
    "u_textGain",
    "u_field",
  ] as const);
  const S = uniforms(gl, sim, [
    "u_field",
    "u_pointer",
    "u_pointerVel",
    "u_aspect",
    "u_dt",
    "u_time",
  ] as const);

  /* Texture units are fixed for the scene's life: 0 wordmark, 1 trail. */
  gl.useProgram(main);
  gl.uniform1i(U.u_text, 0);
  gl.uniform1i(U.u_field, 1);
  /* Zero makes the shader skip the texture entirely — see below. */
  gl.uniform1f(U.u_textGain, coarse ? 0 : 0.7);
  gl.useProgram(sim);
  gl.uniform1i(S.u_field, 1);

  /* Wordmark texture — pointer devices only.
   *
   * The imprint exists to be shredded by the cursor. A touch screen has
   * no cursor, so all it can ever be there is a second, static copy of
   * the name; and a portrait hero has no empty column to move it into,
   * so it lands under the headline whatever we do. Skipping it also
   * spares a phone the 2048x512 rasterise and a 4MB texture upload. */
  let texture: WebGLTexture | null = null;
  if (!coarse) {
    texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, drawWordmark());
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  let field: PingPong | null = null;
  let fieldH = 0;
  let aspect = 1;

  /* Pointer is lerped in JS; the shader just reads the uniform. */
  const pointer = { x: 0.5, y: 0.5 };
  const target = { x: 0.5, y: 0.5 };
  /* Instantaneous pointer velocity, in uv per frame, for the splat. */
  const vel = { x: 0, y: 0 };
  let last = { x: 0.5, y: 0.5, t: 0 };

  /* How hard the cursor is currently tearing the wordmark apart.
     Ramps up while the pointer moves, decays when it rests. */
  let disturb = 0;
  let disturbTarget = 0;
  let lastMove = 0;

  const onPointerMove = (e: PointerEvent) => {
    const x = e.clientX / window.innerWidth;
    const y = 1 - e.clientY / window.innerHeight;
    const now = performance.now();
    const dt = Math.max(now - last.t, 8);
    /* uv per ms, scaled so a brisk sweep lands around ±0.7. */
    vel.x = clamp(((x - last.x) / dt) * 40, -1, 1);
    vel.y = clamp(((y - last.y) / dt) * 40, -1, 1);
    last = { x, y, t: now };
    target.x = x;
    target.y = y;
    disturbTarget = 1;
    lastMove = now;
  };
  if (!coarse) window.addEventListener("pointermove", onPointerMove, { passive: true });

  return {
    resize(w, h) {
      aspect = w / h;
      gl.useProgram(main);
      gl.uniform2f(U.u_res, w, h);

      /* Fit the wordmark to a share of the viewport width, preserving its
         own aspect so the letters never stretch.
       *
       * Placement matters as much as size. The headline runs down the
       * left column, so the wordmark is anchored into the empty
       * lower-right quadrant and allowed to bleed off the right edge —
       * centred, it lands squarely across "Sankar." and reads as a
       * duplicated headline instead of scenery behind one. Far enough
       * right to clear the role line where it wraps to two lines on a
       * ~1024px window, which is the tightest case that still shows it. */
      if (!coarse) {
        const texAspect = TEX_W / TEX_H;
        const scaleX = 1 / 0.46;
        const scaleY = (scaleX * texAspect) / aspect;
        gl.uniform2f(U.u_textScale, scaleX, scaleY);
        gl.uniform2f(U.u_textOffset, 0.33, -0.215);
      }

      /* The trail field follows the viewport's shape so a splat is round. */
      const fh = Math.max(32, Math.round(FIELD_W / aspect));
      if (!field || fieldH !== fh) {
        field?.dispose();
        field = createPingPong(gl, FIELD_W, fh);
        fieldH = fh;
        /* Building the targets rebinds TEXTURE_2D on whatever unit was
           active — put the wordmark back where the shader expects it. */
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
      }
    },

    frame(dt, elapsed) {
      const now = performance.now();
      const frames = Math.min(dt / 16.67, 2);
      const calm = getCalm();

      if (coarse) {
        /* No cursor to follow — slow autonomous drift keeps it alive, and
           its motion feeds the trail the way a real pointer's would. */
        const t = elapsed * 0.1;
        const nx = 0.5 + Math.sin(t * 1.3) * 0.28;
        const ny = 0.5 + Math.cos(t) * 0.24;
        vel.x = clamp((nx - target.x) * 6, -1, 1);
        vel.y = clamp((ny - target.y) * 6, -1, 1);
        target.x = nx;
        target.y = ny;
        disturbTarget = 0.35;
      } else {
        /* Cursor at rest — let the letters knit back together. */
        if (now - lastMove > 260) disturbTarget = 0;
        if (now - lastMove > 60) {
          vel.x *= 0.75;
          vel.y *= 0.75;
        }
      }

      pointer.x += (target.x - pointer.x) * 0.06;
      pointer.y += (target.y - pointer.y) * 0.06;
      disturb += (disturbTarget * (1 - calm) - disturb) * 0.055;

      /* Pass 1: step the trail. */
      if (field) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, field.write.framebuffer);
        gl.viewport(0, 0, field.write.width, field.write.height);
        gl.useProgram(sim);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, field.read.texture);
        gl.uniform2f(S.u_pointer, target.x, target.y);
        gl.uniform2f(S.u_pointerVel, vel.x * (1 - calm), vel.y * (1 - calm));
        gl.uniform1f(S.u_aspect, aspect);
        gl.uniform1f(S.u_dt, frames);
        gl.uniform1f(S.u_time, elapsed);
        drawFullscreen(gl);
        field.swap();

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.bindTexture(gl.TEXTURE_2D, field.read.texture);
      }

      /* Pass 2: the picture. */
      gl.useProgram(main);
      gl.uniform1f(U.u_time, elapsed);
      gl.uniform2f(U.u_pointer, pointer.x, pointer.y);
      gl.uniform1f(U.u_disturb, disturb);
      gl.uniform1f(U.u_calm, calm);
      drawFullscreen(gl);
    },

    dispose() {
      window.removeEventListener("pointermove", onPointerMove);
      field?.dispose();
      field = null;
      if (buffer) gl.deleteBuffer(buffer);
      if (texture) gl.deleteTexture(texture);
      gl.deleteProgram(main);
      gl.deleteProgram(sim);
    },
  };
}
