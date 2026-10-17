import {
  FULLSCREEN_VERT,
  createProgram,
  drawFullscreen,
  fullscreenTriangle,
  uniforms,
} from "@/lib/gl/program";
import type { GlScene } from "@/lib/gl/use-gl-surface";
import { DITHER_FRAG } from "@/components/gl/dither-shader";

/** Seconds from first frame to the fully resolved photograph. */
const RESOLVE_SECONDS = 1.6;

interface DitherSceneOptions {
  image: HTMLImageElement;
  host: HTMLElement;
}

/**
 * The portrait: a program, a triangle, the photo as a texture. Resolves
 * once on its first frame; hover is eased in JS. Like the cover, it draws
 * one clean frame when everything has settled and then skips.
 */
export function createDitherScene(
  gl: WebGLRenderingContext,
  _canvas: HTMLCanvasElement,
  { image, host }: DitherSceneOptions
): GlScene | null {
  const program = createProgram(gl, FULLSCREEN_VERT, DITHER_FRAG);
  if (!program) return null;
  const buffer = fullscreenTriangle(gl, program);
  const U = uniforms(gl, program, [
    "u_tex",
    "u_res",
    "u_resolve",
    "u_hover",
    "u_pointer",
    "u_cell",
    "u_time",
  ] as const);

  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.useProgram(program);
  gl.uniform1i(U.u_tex, 0);

  let dirty = true;
  let ready = false;
  let disposed = false;
  const upload = () => {
    if (disposed) return;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
    ready = true;
    dirty = true;
  };
  const pending = !(image.complete && image.naturalWidth > 0);
  if (pending) image.addEventListener("load", upload, { once: true });
  else upload();

  const pointer = { x: 0.5, y: 0.5 };
  const target = { x: 0.5, y: 0.5 };
  let hover = 0;
  let hoverTarget = 0;
  let started = -1;
  let resolve = 0;
  let cell = 3;

  const onEnter = () => {
    hoverTarget = 1;
  };
  const onLeave = () => {
    hoverTarget = 0;
  };
  const onMove = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    target.x = (e.clientX - r.left) / r.width;
    target.y = 1 - (e.clientY - r.top) / r.height;
  };
  host.addEventListener("pointerenter", onEnter);
  host.addEventListener("pointerleave", onLeave);
  host.addEventListener("pointermove", onMove, { passive: true });

  return {
    resize(w, h) {
      gl.useProgram(program);
      gl.uniform2f(U.u_res, w, h);
      /* ~3 CSS px per dot at the portrait's 280 px width, scaled with the buffer. */
      cell = Math.max(2, Math.round(w / 95));
      dirty = true;
    },

    frame(_dt, elapsed) {
      if (!ready) return false;

      if (started < 0) started = elapsed;
      const t = Math.min((elapsed - started) / RESOLVE_SECONDS, 1);
      resolve = 1 - Math.pow(1 - t, 3);

      hover += (hoverTarget - hover) * 0.08;
      pointer.x += (target.x - pointer.x) * 0.18;
      pointer.y += (target.y - pointer.y) * 0.18;

      const resting = t >= 1 && hover < 0.002;
      if (resting) {
        if (!dirty) return;
        dirty = false;
      } else {
        dirty = true;
      }

      gl.useProgram(program);
      gl.uniform1f(U.u_resolve, resolve);
      gl.uniform1f(U.u_hover, resting ? 0 : hover);
      gl.uniform2f(U.u_pointer, pointer.x, pointer.y);
      gl.uniform1f(U.u_cell, cell);
      gl.uniform1f(U.u_time, elapsed);
      drawFullscreen(gl);
    },

    dispose() {
      disposed = true;
      if (pending) image.removeEventListener("load", upload);
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointermove", onMove);
      if (texture) gl.deleteTexture(texture);
      if (buffer) gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    },
  };
}
