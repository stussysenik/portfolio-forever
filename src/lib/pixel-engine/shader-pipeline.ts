// WebGL post-processing: CRT scanlines, holographic shimmer, chromatic aberration, bloom
// Single-pass fragment shader compositing all effects

const VERTEX_SRC = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const FRAGMENT_SRC = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_texture;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_crt;
uniform float u_chromatic;
uniform float u_bloom;
uniform float u_holographic;

void main() {
  vec2 uv = v_uv;

  // CRT barrel distortion (subtle)
  if (u_crt > 0.0) {
    vec2 center = uv - 0.5;
    float dist = dot(center, center);
    uv = uv + center * dist * 0.02 * u_crt;
  }

  // Chromatic aberration (1-2px RGB split)
  float offset = u_chromatic / u_resolution.x;
  float r = texture2D(u_texture, uv + vec2(offset, 0.0)).r;
  float g = texture2D(u_texture, uv).g;
  float b = texture2D(u_texture, uv - vec2(offset, 0.0)).b;
  float a = texture2D(u_texture, uv).a;
  vec4 color = vec4(r, g, b, a);

  // CRT scanlines
  if (u_crt > 0.0) {
    float scanline = sin(uv.y * u_resolution.y * 1.5) * 0.04 * u_crt;
    color.rgb -= scanline;
  }

  // Holographic shimmer (rainbow shift near mouse)
  if (u_holographic > 0.0) {
    float mouseDist = distance(uv, u_mouse / u_resolution);
    if (mouseDist < 0.15) {
      float hue = fract(u_time * 0.3 + uv.x * 2.0 + uv.y);
      vec3 rainbow = 0.5 + 0.5 * cos(6.28318 * (hue + vec3(0.0, 0.33, 0.67)));
      float intensity = (1.0 - mouseDist / 0.15) * u_holographic * 0.3 * a;
      color.rgb = mix(color.rgb, rainbow, intensity);
    }
  }

  // Bloom (bright pixel glow)
  if (u_bloom > 0.0) {
    float px = 1.0 / u_resolution.x;
    float py = 1.0 / u_resolution.y;
    vec4 sum = vec4(0.0);
    for (float x = -2.0; x <= 2.0; x += 1.0) {
      for (float y = -2.0; y <= 2.0; y += 1.0) {
        sum += texture2D(u_texture, uv + vec2(x * px, y * py));
      }
    }
    sum /= 25.0;
    float brightness = dot(sum.rgb, vec3(0.299, 0.587, 0.114));
    color.rgb += sum.rgb * brightness * u_bloom * 0.5;
  }

  gl_FragColor = color;
}`;

export interface ShaderParams {
	crt: number;        // 0-1
	chromatic: number;  // 0-3 (pixels)
	bloom: number;      // 0-1
	holographic: number; // 0-1
}

const DEFAULT_PARAMS: ShaderParams = {
	crt: 0.6,
	chromatic: 1.5,
	bloom: 0.4,
	holographic: 0.8,
};

export class ShaderPipeline {
	private gl: WebGLRenderingContext | null = null;
	private program: WebGLProgram | null = null;
	private texture: WebGLTexture | null = null;
	private canvas: HTMLCanvasElement;
	private uniforms: Record<string, WebGLUniformLocation | null> = {};
	private startTime = performance.now();
	params: ShaderParams;

	constructor(canvas: HTMLCanvasElement, params?: Partial<ShaderParams>) {
		this.canvas = canvas;
		this.params = { ...DEFAULT_PARAMS, ...params };
		this.init();
	}

	private init() {
		const gl = this.canvas.getContext("webgl", { premultipliedAlpha: false, alpha: true });
		if (!gl) {
			console.warn("WebGL not available for shader pipeline");
			return;
		}
		this.gl = gl;

		// Compile shaders
		const vs = this.compile(gl.VERTEX_SHADER, VERTEX_SRC);
		const fs = this.compile(gl.FRAGMENT_SHADER, FRAGMENT_SRC);
		if (!vs || !fs) return;

		const program = gl.createProgram()!;
		gl.attachShader(program, vs);
		gl.attachShader(program, fs);
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.warn("Shader link error:", gl.getProgramInfoLog(program));
			return;
		}
		this.program = program;

		// Fullscreen quad
		const buf = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buf);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

		const posLoc = gl.getAttribLocation(program, "a_position");
		gl.enableVertexAttribArray(posLoc);
		gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

		// Texture
		this.texture = gl.createTexture();

		// Cache uniforms
		gl.useProgram(program);
		for (const name of ["u_texture", "u_time", "u_resolution", "u_mouse", "u_crt", "u_chromatic", "u_bloom", "u_holographic"]) {
			this.uniforms[name] = gl.getUniformLocation(program, name);
		}
	}

	private compile(type: number, src: string): WebGLShader | null {
		const gl = this.gl!;
		const shader = gl.createShader(type)!;
		gl.shaderSource(shader, src);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.warn("Shader compile error:", gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
			return null;
		}
		return shader;
	}

	render(sourceCanvas: HTMLCanvasElement, mouseX: number, mouseY: number) {
		const gl = this.gl;
		if (!gl || !this.program || !this.texture) return;

		// Resize to match
		if (this.canvas.width !== sourceCanvas.width || this.canvas.height !== sourceCanvas.height) {
			this.canvas.width = sourceCanvas.width;
			this.canvas.height = sourceCanvas.height;
			gl.viewport(0, 0, this.canvas.width, this.canvas.height);
		}

		gl.useProgram(this.program);

		// Upload sprite canvas as texture
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceCanvas);

		// Set uniforms
		const t = (performance.now() - this.startTime) / 1000;
		gl.uniform1i(this.uniforms.u_texture, 0);
		gl.uniform1f(this.uniforms.u_time, t);
		gl.uniform2f(this.uniforms.u_resolution, this.canvas.width, this.canvas.height);
		gl.uniform2f(this.uniforms.u_mouse, mouseX, mouseY);
		gl.uniform1f(this.uniforms.u_crt, this.params.crt);
		gl.uniform1f(this.uniforms.u_chromatic, this.params.chromatic);
		gl.uniform1f(this.uniforms.u_bloom, this.params.bloom);
		gl.uniform1f(this.uniforms.u_holographic, this.params.holographic);

		// Clear and draw
		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}

	destroy() {
		if (this.gl && this.program) {
			this.gl.deleteProgram(this.program);
		}
		this.gl = null;
		this.program = null;
	}
}
