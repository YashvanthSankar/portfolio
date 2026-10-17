/**
 * Render targets. RGBA8 only — it is the one format WebGL 1 guarantees a
 * complete framebuffer for, with no extension to probe. Anything that
 * needs signed or fractional values (a velocity field, say) encodes them
 * around 0.5 and decodes on read.
 */

export interface Fbo {
  framebuffer: WebGLFramebuffer;
  texture: WebGLTexture;
  width: number;
  height: number;
}

export function createFbo(
  gl: WebGLRenderingContext,
  width: number,
  height: number
): Fbo | null {
  const texture = gl.createTexture();
  const framebuffer = gl.createFramebuffer();
  if (!texture || !framebuffer) return null;

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

  /* Start from a known state — "no disturbance" is mid-grey once decoded. */
  gl.clearColor(0.5, 0.5, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindTexture(gl.TEXTURE_2D, null);

  if (!ok) {
    gl.deleteTexture(texture);
    gl.deleteFramebuffer(framebuffer);
    return null;
  }
  return { framebuffer, texture, width, height };
}

export function deleteFbo(gl: WebGLRenderingContext, fbo: Fbo) {
  gl.deleteTexture(fbo.texture);
  gl.deleteFramebuffer(fbo.framebuffer);
}

export interface PingPong {
  /** The target holding last frame's result — sample from this. */
  read: Fbo;
  /** The target to draw this frame into. */
  write: Fbo;
  swap(): void;
  dispose(): void;
}

/** Two targets that trade places each frame, for simulations that feed on themselves. */
export function createPingPong(
  gl: WebGLRenderingContext,
  width: number,
  height: number
): PingPong | null {
  const a = createFbo(gl, width, height);
  const b = createFbo(gl, width, height);
  if (!a || !b) {
    if (a) deleteFbo(gl, a);
    if (b) deleteFbo(gl, b);
    return null;
  }
  const pair: PingPong = {
    read: a,
    write: b,
    swap() {
      const t = pair.read;
      pair.read = pair.write;
      pair.write = t;
    },
    dispose() {
      deleteFbo(gl, a);
      deleteFbo(gl, b);
    },
  };
  return pair;
}
