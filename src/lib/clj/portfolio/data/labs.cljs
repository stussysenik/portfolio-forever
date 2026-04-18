(ns portfolio.data.labs
  "Labs data — sandboxed WebGPU/WASM experiments.
   Ported from src/lib/data/labs.ts")

(def labs
  [{:slug "raymarch-wgsl" :title "WGSL Raymarcher"
    :description "Real-time raymarched 3D scene entirely in WebGPU compute shaders. Includes SDF primitives, soft shadows, and ambient occlusion."
    :date "2025-01-02" :status "stable"
    :required-features ["webgpu"]
    :entry-point "/static/labs/raymarch-wgsl/index.html"
    :fallback-image "/static/labs/raymarch-wgsl/fallback.png"
    :source-url "https://github.com/username/raymarch-wgsl"
    :tags ["raymarching" "webgpu" "sdf" "compute"] :memory-budget 128}
   {:slug "particle-physics" :title "GPU Particle System"
    :description "100,000+ particles with physics simulation running entirely on GPU compute. Includes attractor fields and collision detection."
    :date "2024-12-15" :status "stable"
    :required-features ["webgpu" "shared-array-buffer"]
    :entry-point "/static/labs/particle-physics/index.html"
    :fallback-image "/static/labs/particle-physics/fallback.png"
    :source-url "https://github.com/username/particle-physics"
    :tags ["particles" "physics" "compute" "simulation"] :memory-budget 256}
   {:slug "wasm-fluid" :title "WASM Fluid Simulation"
    :description "Navier-Stokes fluid dynamics solver compiled from Rust to WebAssembly. Rendered with WebGL2 for maximum compatibility."
    :date "2024-11-28" :status "beta"
    :required-features ["wasm" "webgl2"]
    :entry-point "/static/labs/wasm-fluid/index.html"
    :fallback-image "/static/labs/wasm-fluid/fallback.png"
    :source-url "https://github.com/username/wasm-fluid"
    :tags ["fluid" "physics" "wasm" "rust"] :memory-budget 384}
   {:slug "audio-visualizer" :title "Audio Worklet Visualizer"
    :description "Real-time FFT analysis using Audio Worklet with GPU-accelerated visualization. Feed it any audio source."
    :date "2024-10-20" :status "stable"
    :required-features ["audio-worklet" "webgl2"]
    :entry-point "/static/labs/audio-visualizer/index.html"
    :fallback-image "/static/labs/audio-visualizer/fallback.png"
    :tags ["audio" "fft" "visualization" "worklet"] :memory-budget 64}
   {:slug "fractal-zoom" :title "Mandelbrot Zoom"
    :description "Infinite zoom into the Mandelbrot set with arbitrary precision arithmetic. Switch between GPU and CPU renderers."
    :date "2024-09-10" :status "experimental"
    :required-features ["webgpu"]
    :entry-point "/static/labs/fractal-zoom/index.html"
    :fallback-image "/static/labs/fractal-zoom/fallback.png"
    :tags ["fractal" "math" "precision" "compute"] :memory-budget 512}
   {:slug "ascii-render" :title "ASCII 3D Renderer"
    :description "Classic 3D objects rendered as ASCII art. Uses WebGL for actual rendering, then converts to text output."
    :date "2024-08-01" :status "archived"
    :required-features ["webgl2"]
    :entry-point "/static/labs/ascii-render/index.html"
    :fallback-image "/static/labs/ascii-render/fallback.png"
    :source-url "https://github.com/username/ascii-render"
    :tags ["ascii" "3d" "webgl" "retro"] :memory-budget 32}])

(defn check-feature [feature]
  (cond
    (= feature "webgpu") (and (exists? js/navigator) (contains? js/navigator "gpu"))
    (= feature "webgl2") (try (let [canvas (.createElement js/document "canvas")]
                                 (not (nil? (.getContext canvas "webgl2"))))
                               (catch js/Error _ false))
    (= feature "wasm") (not (nil? (aget js/globalThis "WebAssembly")))
    (= feature "shared-array-buffer") (not (nil? (aget js/globalThis "SharedArrayBuffer")))
    (= feature "audio-worklet") (not (nil? (aget js/window "AudioWorkletNode")))
    :else false))

(defn check-all-features [features]
  (let [missing (filterv #(not (check-feature %)) features)]
    {:supported (empty? missing)
     :missing (into-array missing)}))

(def status-labels
  {"stable" "◆ STABLE"
   "beta" "◇ BETA"
   "experimental" "○ EXPERIMENTAL"
   "archived" "□ ARCHIVED"})

(def status-classes
  {"stable" "status-stable"
   "beta" "status-beta"
   "experimental" "status-experimental"
   "archived" "status-archived"})

(defn get-status-label [status]
  (get status-labels status status))

(defn get-status-class [status]
  (get status-classes status status))