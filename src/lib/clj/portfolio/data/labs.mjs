import * as squint_core from 'squint-cljs/core.js';
var labs = [({"description": "Real-time raymarched 3D scene entirely in WebGPU compute shaders. Includes SDF primitives, soft shadows, and ambient occlusion.", "tags": ["raymarching", "webgpu", "sdf", "compute"], "date": "2025-01-02", "slug": "raymarch-wgsl", "fallback-image": "/static/labs/raymarch-wgsl/fallback.png", "title": "WGSL Raymarcher", "source-url": "https://github.com/username/raymarch-wgsl", "memory-budget": 128, "entry-point": "/static/labs/raymarch-wgsl/index.html", "status": "stable", "required-features": ["webgpu"]}), ({"description": "100,000+ particles with physics simulation running entirely on GPU compute. Includes attractor fields and collision detection.", "tags": ["particles", "physics", "compute", "simulation"], "date": "2024-12-15", "slug": "particle-physics", "fallback-image": "/static/labs/particle-physics/fallback.png", "title": "GPU Particle System", "source-url": "https://github.com/username/particle-physics", "memory-budget": 256, "entry-point": "/static/labs/particle-physics/index.html", "status": "stable", "required-features": ["webgpu", "shared-array-buffer"]}), ({"description": "Navier-Stokes fluid dynamics solver compiled from Rust to WebAssembly. Rendered with WebGL2 for maximum compatibility.", "tags": ["fluid", "physics", "wasm", "rust"], "date": "2024-11-28", "slug": "wasm-fluid", "fallback-image": "/static/labs/wasm-fluid/fallback.png", "title": "WASM Fluid Simulation", "source-url": "https://github.com/username/wasm-fluid", "memory-budget": 384, "entry-point": "/static/labs/wasm-fluid/index.html", "status": "beta", "required-features": ["wasm", "webgl2"]}), ({"description": "Real-time FFT analysis using Audio Worklet with GPU-accelerated visualization. Feed it any audio source.", "tags": ["audio", "fft", "visualization", "worklet"], "date": "2024-10-20", "slug": "audio-visualizer", "fallback-image": "/static/labs/audio-visualizer/fallback.png", "title": "Audio Worklet Visualizer", "memory-budget": 64, "entry-point": "/static/labs/audio-visualizer/index.html", "status": "stable", "required-features": ["audio-worklet", "webgl2"]}), ({"description": "Infinite zoom into the Mandelbrot set with arbitrary precision arithmetic. Switch between GPU and CPU renderers.", "tags": ["fractal", "math", "precision", "compute"], "date": "2024-09-10", "slug": "fractal-zoom", "fallback-image": "/static/labs/fractal-zoom/fallback.png", "title": "Mandelbrot Zoom", "memory-budget": 512, "entry-point": "/static/labs/fractal-zoom/index.html", "status": "experimental", "required-features": ["webgpu"]}), ({"description": "Classic 3D objects rendered as ASCII art. Uses WebGL for actual rendering, then converts to text output.", "tags": ["ascii", "3d", "webgl", "retro"], "date": "2024-08-01", "slug": "ascii-render", "fallback-image": "/static/labs/ascii-render/fallback.png", "title": "ASCII 3D Renderer", "source-url": "https://github.com/username/ascii-render", "memory-budget": 32, "entry-point": "/static/labs/ascii-render/index.html", "status": "archived", "required-features": ["webgl2"]})];
var check_feature = function (feature) {
if ((feature === "webgpu")) {
return ((typeof navigator !== 'undefined') && squint_core.contains_QMARK_(navigator, "gpu"))} else {
if ((feature === "webgl2")) {
return (() => {
try{
const canvas1 = document.createElement("canvas");
return !(canvas1.getContext("webgl2") == null);
}
catch(_2){
return false;
}

})()} else {
if ((feature === "wasm")) {
return !(globalThis["WebAssembly"] == null)} else {
if ((feature === "shared-array-buffer")) {
return !(globalThis["SharedArrayBuffer"] == null)} else {
if ((feature === "audio-worklet")) {
return !(window["AudioWorkletNode"] == null)} else {
if ("else") {
return false} else {
return null}}}}}};

};
var check_all_features = function (features) {
const missing1 = squint_core.filterv((function (_PERCENT_1) {
return squint_core.not(check_feature(_PERCENT_1));

}), features);
return ({"supported": squint_core.empty_QMARK_(missing1), "missing": squint_core.into_array(missing1)});

};
var status_labels = ({"stable": "◆ STABLE", "beta": "◇ BETA", "experimental": "○ EXPERIMENTAL", "archived": "□ ARCHIVED"});
var status_classes = ({"stable": "status-stable", "beta": "status-beta", "experimental": "status-experimental", "archived": "status-archived"});
var get_status_label = function (status) {
return squint_core.get(status_labels, status, status);

};
var get_status_class = function (status) {
return squint_core.get(status_classes, status, status);

};

export { labs, check_feature, check_all_features, status_labels, status_classes, get_status_label, get_status_class }
