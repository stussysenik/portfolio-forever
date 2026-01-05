// Labs Data - Sandboxed WebGPU/WASM experiments
// Simulates parsed lab-manifest.toml files

export interface LabExperiment {
        slug: string;
        title: string;
        description: string;
        date: string; // ISO 8601
        status: 'stable' | 'beta' | 'experimental' | 'archived';
        requiredFeatures: ('webgpu' | 'webgl2' | 'wasm' | 'shared-array-buffer' | 'audio-worklet')[];
        entryPoint: string; // relative path to built experiment
        fallbackImage: string; // PNG for browsers lacking support
        sourceUrl?: string; // GitHub link
        tags: string[];
        memoryBudget: number; // MB
}

export const labs: LabExperiment[] = [
        {
                slug: 'raymarch-wgsl',
                title: 'WGSL Raymarcher',
                description: 'Real-time raymarched 3D scene entirely in WebGPU compute shaders. Includes SDF primitives, soft shadows, and ambient occlusion.',
                date: '2025-01-02',
                status: 'stable',
                requiredFeatures: ['webgpu'],
                entryPoint: '/static/labs/raymarch-wgsl/index.html',
                fallbackImage: '/static/labs/raymarch-wgsl/fallback.png',
                sourceUrl: 'https://github.com/username/raymarch-wgsl',
                tags: ['raymarching', 'webgpu', 'sdf', 'compute'],
                memoryBudget: 128,
        },
        {
                slug: 'particle-physics',
                title: 'GPU Particle System',
                description: '100,000+ particles with physics simulation running entirely on GPU compute. Includes attractor fields and collision detection.',
                date: '2024-12-15',
                status: 'stable',
                requiredFeatures: ['webgpu', 'shared-array-buffer'],
                entryPoint: '/static/labs/particle-physics/index.html',
                fallbackImage: '/static/labs/particle-physics/fallback.png',
                sourceUrl: 'https://github.com/username/particle-physics',
                tags: ['particles', 'physics', 'compute', 'simulation'],
                memoryBudget: 256,
        },
        {
                slug: 'wasm-fluid',
                title: 'WASM Fluid Simulation',
                description: 'Navier-Stokes fluid dynamics solver compiled from Rust to WebAssembly. Rendered with WebGL2 for maximum compatibility.',
                date: '2024-11-28',
                status: 'beta',
                requiredFeatures: ['wasm', 'webgl2'],
                entryPoint: '/static/labs/wasm-fluid/index.html',
                fallbackImage: '/static/labs/wasm-fluid/fallback.png',
                sourceUrl: 'https://github.com/username/wasm-fluid',
                tags: ['fluid', 'physics', 'wasm', 'rust'],
                memoryBudget: 384,
        },
        {
                slug: 'audio-visualizer',
                title: 'Audio Worklet Visualizer',
                description: 'Real-time FFT analysis using Audio Worklet with GPU-accelerated visualization. Feed it any audio source.',
                date: '2024-10-20',
                status: 'stable',
                requiredFeatures: ['audio-worklet', 'webgl2'],
                entryPoint: '/static/labs/audio-visualizer/index.html',
                fallbackImage: '/static/labs/audio-visualizer/fallback.png',
                tags: ['audio', 'fft', 'visualization', 'worklet'],
                memoryBudget: 64,
        },
        {
                slug: 'fractal-zoom',
                title: 'Mandelbrot Zoom',
                description: 'Infinite zoom into the Mandelbrot set with arbitrary precision arithmetic. Switch between GPU and CPU renderers.',
                date: '2024-09-10',
                status: 'experimental',
                requiredFeatures: ['webgpu'],
                entryPoint: '/static/labs/fractal-zoom/index.html',
                fallbackImage: '/static/labs/fractal-zoom/fallback.png',
                tags: ['fractal', 'math', 'precision', 'compute'],
                memoryBudget: 512,
        },
        {
                slug: 'ascii-render',
                title: 'ASCII 3D Renderer',
                description: 'Classic 3D objects rendered as ASCII art. Uses WebGL for actual rendering, then converts to text output.',
                date: '2024-08-01',
                status: 'archived',
                requiredFeatures: ['webgl2'],
                entryPoint: '/static/labs/ascii-render/index.html',
                fallbackImage: '/static/labs/ascii-render/fallback.png',
                sourceUrl: 'https://github.com/username/ascii-render',
                tags: ['ascii', '3d', 'webgl', 'retro'],
                memoryBudget: 32,
        },
];

// Feature detection helpers
export function checkFeature(feature: LabExperiment['requiredFeatures'][0]): boolean {
        if (typeof window === 'undefined') return false;

        switch (feature) {
                case 'webgpu':
                        return 'gpu' in navigator;
                case 'webgl2':
                        try {
                                const canvas = document.createElement('canvas');
                                return !!canvas.getContext('webgl2');
                        } catch {
                                return false;
                        }
                case 'wasm':
                        return typeof WebAssembly !== 'undefined';
                case 'shared-array-buffer':
                        return typeof SharedArrayBuffer !== 'undefined';
                case 'audio-worklet':
                        return 'AudioWorkletNode' in window;
                default:
                        return false;
        }
}

export function checkAllFeatures(features: LabExperiment['requiredFeatures']): {
        supported: boolean;
        missing: string[];
} {
        const missing: string[] = [];

        for (const feature of features) {
                if (!checkFeature(feature)) {
                        missing.push(feature);
                }
        }

        return {
                supported: missing.length === 0,
                missing,
        };
}

// Status badge helpers
export function getStatusLabel(status: LabExperiment['status']): string {
        switch (status) {
                case 'stable': return '◆ STABLE';
                case 'beta': return '◇ BETA';
                case 'experimental': return '○ EXPERIMENTAL';
                case 'archived': return '□ ARCHIVED';
        }
}

export function getStatusClass(status: LabExperiment['status']): string {
        switch (status) {
                case 'stable': return 'status-stable';
                case 'beta': return 'status-beta';
                case 'experimental': return 'status-experimental';
                case 'archived': return 'status-archived';
        }
}
