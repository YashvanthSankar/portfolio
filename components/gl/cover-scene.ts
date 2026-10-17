import {
  FULLSCREEN_VERT,
  createProgram,
  drawFullscreen,
  fullscreenTriangle,
  uniforms,
} from "@/lib/gl/program";
import type { GlScene } from "@/lib/gl/use-gl-surface";
import { COVER_FRAG } from "@/components/gl/cover-shader";

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

interface CoverSceneOptions {
  /** What to put on the sheet: the rasterised generative art or a screenshot. */
  source: TexImageSource;
  /** The element whose pointer events drive the ripple. */
  host: HTMLElement;
}

/**
 * One cover: a program, a triangle, a texture. Hover and scroll velocity
 * are eased in JS; the shader only reads uniforms. When nothing is moving
 * it draws one clean frame and then skips, so a resting cover costs no GPU.
 */
export function createCoverScene(
  gl: WebGLRenderingContext,
  _canvas: HTMLCanvasElement,
  { source, host }: CoverSceneOptions
): GlScene | null {
  const program = createProgram(gl, FULLSCREEN_VERT, COVER_FRAG);
  if (!program) return null;
  const buffer = fullscreenTriangle(gl, program);
  const U = uniforms(gl, program, [
    "u_tex",
    "u_pointer",
    "u_hover",
    "u_vel",
    "u_aspect",
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

  /* True while the last drawn frame is not the resting one. */
  let dirty = true;
  /* A screenshot may still be in flight; nothing is drawn until it lands. */
  let ready = false;
  let disposed = false;
  const upload = () => {
    if (disposed) return;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    /* Flip so v = 0 is the bottom, matching the fullscreen triangle's uv. */
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
    ready = true;
    dirty = true;
  };
  const pendingImage =
    source instanceof HTMLImageElement && !(source.complete && source.naturalWidth > 0)
      ? source
      : null;
  if (pendingImage) pendingImage.addEventListener("load", upload, { once: true });
  else upload();

  const pointer = { x: 0.5, y: 0.5 };
  const target = { x: 0.5, y: 0.5 };
  let hover = 0;
  let hoverTarget = 0;
  let vel = 0;
  let lastY = window.scrollY;
  let aspect = 1;

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
      aspect = w / h;
      dirty = true;
    },

    frame(dt, elapsed) {
      if (!ready) return false;

      /* Scroll velocity from the document itself — works with or without
         Lenis, and needs no coupling to the provider. ~2.5 px/ms reads as 1. */
      const y = window.scrollY;
      const instant = (y - lastY) / Math.max(dt, 1);
      lastY = y;
      vel += (clamp(instant / 2.5, -1, 1) - vel) * 0.12;

      hover += (hoverTarget - hover) * 0.08;
      pointer.x += (target.x - pointer.x) * 0.18;
      pointer.y += (target.y - pointer.y) * 0.18;

      const resting = hover < 0.002 && Math.abs(vel) < 0.002;
      if (resting) {
        if (!dirty) return;
        dirty = false; // draw the clean frame once, then sleep
      } else {
        dirty = true;
      }

      gl.useProgram(program);
      gl.uniform2f(U.u_pointer, pointer.x, pointer.y);
      gl.uniform1f(U.u_hover, resting ? 0 : hover);
      gl.uniform1f(U.u_vel, resting ? 0 : vel);
      gl.uniform1f(U.u_aspect, aspect);
      gl.uniform1f(U.u_time, elapsed);
      drawFullscreen(gl);
    },

    dispose() {
      disposed = true;
      pendingImage?.removeEventListener("load", upload);
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointermove", onMove);
      if (texture) gl.deleteTexture(texture);
      if (buffer) gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    },
  };
}
