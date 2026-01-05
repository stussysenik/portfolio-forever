// Notes Data - Atomic notes with bidirectional linking
// Simulates parsed Markdown frontmatter from /content/notes/

export interface Note {
        slug: string;
        title: string;
        date: string; // ISO 8601
        tags: string[];
        related: string[]; // slugs of related notes
        draft: boolean;
        excerpt: string;
        content: string; // Markdown content
        backlinks?: string[]; // computed at build time
}

// Sample notes simulating what would be parsed from Markdown files
export const notes: Note[] = [
        {
                slug: '20250105-webgpu-vs-webgl',
                title: 'WebGPU vs WebGL: A Practical Comparison',
                date: '2025-01-05',
                tags: ['webgpu', 'webgl', 'graphics', 'performance'],
                related: ['20241220-raymarching-basics', '20241115-compute-shaders'],
                draft: false,
                excerpt: 'After six months of WebGPU in production, here are my honest thoughts on when to use each API.',
                content: `## The TL;DR

WebGPU isn't a replacement for WebGL—it's a fundamentally different paradigm. If you're doing straightforward 3D rendering with Three.js, **stay with WebGL**. If you need compute shaders or are building custom renderers, WebGPU is worth the learning curve.

## Rendering Pipeline Differences

The biggest mental shift is understanding [[compute-shaders|compute shaders]] as first-class citizens. In WebGL, everything was shoehorned through the fragment shader. Now you have explicit control.

\`\`\`wgsl
@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
    // Direct GPU compute without the rendering dance
}
\`\`\`

## Browser Support Reality

As of January 2025:
- Chrome: Full support
- Firefox: Behind flag, but functional
- Safari: Still catching up (iOS 18+ only)

See [[safari-webgpu-workarounds]] for fallback strategies.`,
        },
        {
                slug: '20241220-raymarching-basics',
                title: 'Raymarching from Scratch in WGSL',
                date: '2024-12-20',
                tags: ['raymarching', 'wgsl', 'shaders', 'tutorial'],
                related: ['20250105-webgpu-vs-webgl'],
                draft: false,
                excerpt: 'Building a raymarcher entirely in WebGPU compute shaders. No Three.js, no abstractions.',
                content: `## Why Raymarching?

Raymarching lets you render objects that are defined mathematically—spheres, boxes, fractals—without any polygon meshes. It's the foundation of most demoscene productions and many modern visual effects.

## The Algorithm

For each pixel:
1. Cast a ray from the camera
2. Step along the ray until you hit something
3. Color based on what you hit

The magic is in the **signed distance function (SDF)**:

\`\`\`wgsl
fn sdSphere(p: vec3<f32>, r: f32) -> f32 {
    return length(p) - r;
}
\`\`\`

This tells you: "How far is point P from the surface of a sphere of radius R?"

## See also

- [[compute-shaders|Compute shaders fundamentals]]
- [[sdf-operations|SDF boolean operations]]`,
        },
        {
                slug: '20241115-compute-shaders',
                title: 'Introduction to Compute Shaders',
                date: '2024-11-15',
                tags: ['webgpu', 'compute', 'gpgpu', 'tutorial'],
                related: ['20241220-raymarching-basics', '20250105-webgpu-vs-webgl'],
                draft: false,
                excerpt: 'Compute shaders unlock the full power of the GPU for non-graphics workloads.',
                content: `## What Are Compute Shaders?

While vertex and fragment shaders are tied to the rendering pipeline, compute shaders run arbitrary computations on the GPU. Think physics simulations, particle systems, or image processing—all without drawing a single triangle.

## Key Concepts

### Workgroups
The GPU organizes compute work into groups of threads that execute together:

\`\`\`wgsl
@compute @workgroup_size(16, 16, 1)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
    // Each thread knows its position in the grid
}
\`\`\`

### Storage Buffers
Unlike textures, storage buffers give you read-write access from compute shaders:

\`\`\`wgsl
@group(0) @binding(0) var<storage, read_write> data: array<f32>;
\`\`\`

## Use Cases

- Particle simulations (100k+ particles at 60fps)
- Physics (cloth, fluids, softbody)
- Image processing (blur, edge detection)
- Audio visualization (FFT on GPU)`,
        },
        {
                slug: '20241030-svelte-vs-react-2024',
                title: 'Why I Switched from React to SvelteKit in 2024',
                date: '2024-10-30',
                tags: ['svelte', 'react', 'framework', 'opinion'],
                related: [],
                draft: false,
                excerpt: 'After 8 years of React, I moved my portfolio to SvelteKit. Here is what surprised me.',
                content: `## The Breaking Point

React Server Components broke my brain. Not because they're bad—but because the mental model kept shifting. Every project felt like learning a new framework.

SvelteKit's pitch is simple: **compile-time reactivity, no virtual DOM, less JavaScript shipped to the client**.

## What I Love

1. **Reactivity is automatic**. No useState hooks, no dependency arrays.
2. **File-based routing that makes sense**. +page.svelte, +layout.svelte, +page.server.ts.
3. **Actual SSR/SSG without configuration hell**.

## What I Miss

- The React ecosystem (though svelte-query, motion libraries are catching up)
- Some mental patterns from 8 years of React muscle memory

## Verdict

For content-heavy sites and portfolios? SvelteKit is unbeatable. For large team applications with complex state? React still has stronger patterns.`,
        },
        {
                slug: '20240915-ascii-aesthetics',
                title: 'The Return of ASCII Aesthetics in Web Design',
                date: '2024-09-15',
                tags: ['design', 'brutalism', 'ascii', 'aesthetics'],
                related: [],
                draft: false,
                excerpt: 'Why the most futuristic interfaces look like 1970s terminals.',
                content: `## The Paradox

The cutting edge of web design in 2024 often looks like 1974. Brutalist sites, monospace fonts, ASCII art, terminal-inspired UIs.

## Why It Works

1. **Constraint breeds creativity**. Limiting yourself to fixed-width characters forces precision.
2. **Performance by default**. System fonts, minimal CSS, no asset downloads.
3. **Timelessness**. While gradient-mesh designs will look dated in 2 years, well-executed brutalism has permanence.

## Examples

- ricardocabello.com (the inspiration)
- poolside.fm
- mmm.page

## My Rules

- Maximum 60ms animations
- Monospace fonts only
- ASCII glyphs (→, ◆, █) for state indicators
- True black (#000) backgrounds`,
        },
];

// Build the links graph (simulating build step output)
export function buildLinksGraph(allNotes: Note[]): Map<string, string[]> {
        const graph = new Map<string, string[]>();

        for (const note of allNotes) {
                // Forward links (from related field)
                graph.set(note.slug, note.related || []);

                // Build backlinks
                for (const relatedSlug of note.related || []) {
                        const existing = graph.get(relatedSlug) || [];
                        if (!existing.includes(note.slug)) {
                                graph.set(relatedSlug, [...existing, note.slug]);
                        }
                }
        }

        return graph;
}

// Get related notes with backlinks computed
export function getNotesWithBacklinks(allNotes: Note[]): Note[] {
        const graph = buildLinksGraph(allNotes);

        return allNotes.map(note => ({
                ...note,
                backlinks: Array.from(new Set([
                        ...(note.related || []),
                        ...(graph.get(note.slug) || []),
                ])).filter(slug => slug !== note.slug),
        }));
}

export const notesWithBacklinks = getNotesWithBacklinks(notes);
