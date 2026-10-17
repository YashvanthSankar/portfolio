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

/** Width of the trail simulation; its height follows the viewport's aspect. */
const FIELD_W = 192;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/**
 * The hero field and its relic: two programs, one triangle, one trail
 * texture. Owns the pointer tracking and the trail simulation; the
 * context, clock and run/pause decisions belong to `useGlSurface`.
 *
 * `getCalm` reads how far the page curtain has risen (0→1); the field
 * dims with it, the relic sinks, and the pointer stops splatting once
 * the hero is covered.
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
    "u_field",
    "u_relic",
    "u_relicSize",
    "u_tilt",
    "u_quality",
  ] as const);
  const S = uniforms(gl, sim, [
    "u_field",
    "u_pointer",
    "u_pointerVel",
    "u_aspect",
    "u_dt",
    "u_time",
  ] as const);

  /* The trail texture lives on unit 1 for both programs. */
  gl.useProgram(main);
  gl.uniform1i(U.u_field, 1);
  /* Phones march fewer steps; the silhouette softens a touch, the cost halves. */
  gl.uniform1f(U.u_quality, coarse ? 0.6 : 1.0);
  gl.useProgram(sim);
  gl.uniform1i(S.u_field, 1);

  let field: PingPong | null = null;
  let fieldH = 0;
  let aspect = 1;

  /* Pointer is lerped in JS; the shader just reads the uniform. */
  const pointer = { x: 0.5, y: 0.5 };
  const target = { x: 0.5, y: 0.5 };
  /* Instantaneous pointer velocity, in uv per frame, for the splat. */
  const vel = { x: 0, y: 0 };
  let last = { x: 0.5, y: 0.5, t: 0 };
  /* The relic leans toward the pointer. */
  const tilt = { x: 0, y: 0 };

  /* How hard the cursor is currently disturbing the field.
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

      /* Placement. The headline runs down the left; the relic sits in the
         right half, large, and bleeds a little off the edge on narrow
         desktops. Portrait screens get it smaller, up behind the title. */
      const portrait = aspect < 0.9;
      gl.uniform2f(U.u_relic, portrait ? 0.74 : 0.8, portrait ? 0.74 : 0.52);
      gl.uniform1f(U.u_relicSize, portrait ? 0.44 : 0.4);

      /* The trail field follows the viewport's shape so a splat is round. */
      const fh = Math.max(32, Math.round(FIELD_W / aspect));
      if (!field || fieldH !== fh) {
        field?.dispose();
        field = createPingPong(gl, FIELD_W, fh);
        fieldH = fh;
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
        if (now - lastMove > 260) disturbTarget = 0;
        if (now - lastMove > 60) {
          vel.x *= 0.75;
          vel.y *= 0.75;
        }
      }

      pointer.x += (target.x - pointer.x) * 0.06;
      pointer.y += (target.y - pointer.y) * 0.06;
      disturb += (disturbTarget * (1 - calm) - disturb) * 0.055;
      tilt.x += ((pointer.x - 0.5) * 0.7 - tilt.x) * 0.04;
      tilt.y += ((0.5 - pointer.y) * 0.5 - tilt.y) * 0.04;

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
      gl.uniform2f(U.u_tilt, tilt.x, tilt.y);
      drawFullscreen(gl);
    },

    dispose() {
      window.removeEventListener("pointermove", onPointerMove);
      field?.dispose();
      field = null;
      if (buffer) gl.deleteBuffer(buffer);
      gl.deleteProgram(main);
      gl.deleteProgram(sim);
    },
  };
}
