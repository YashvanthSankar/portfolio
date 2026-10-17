/**
 * The little bit of raw-WebGL boilerplate every scene needs: compile, link,
 * look up uniforms, and the one oversized triangle that covers the viewport
 * without a quad or an index buffer.
 */

export function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  src: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Shader compile failed:", gl.getShaderInfoLog(shader));
    }
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/** Links a program and frees the shaders — they are not needed after link. */
export function createProgram(
  gl: WebGLRenderingContext,
  vert: string,
  frag: string
): WebGLProgram | null {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vert);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, frag);
  if (!vs || !fs) {
    if (vs) gl.deleteShader(vs);
    if (fs) gl.deleteShader(fs);
    return null;
  }
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Program link failed:", gl.getProgramInfoLog(program));
    }
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

/** `uniforms(gl, p, ["u_time", "u_res"])` → `{ u_time: loc, u_res: loc }`. */
export function uniforms<T extends string>(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  names: readonly T[]
): Record<T, WebGLUniformLocation | null> {
  const out = {} as Record<T, WebGLUniformLocation | null>;
  for (const name of names) out[name] = gl.getUniformLocation(program, name);
  return out;
}

/** Vertex stage for every fullscreen pass. `v_uv` runs 0→1 across the canvas. */
export const FULLSCREEN_VERT = /* glsl */ `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

/**
 * Uploads the fullscreen triangle and wires it to `a_pos`. One buffer per
 * context is enough — every program in a scene can share it as long as
 * they all call their attribute `a_pos`.
 */
export function fullscreenTriangle(
  gl: WebGLRenderingContext,
  program: WebGLProgram
): WebGLBuffer | null {
  const buffer = gl.createBuffer();
  if (!buffer) return null;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(program, "a_pos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  return buffer;
}

export function drawFullscreen(gl: WebGLRenderingContext) {
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}
