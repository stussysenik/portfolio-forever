<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->

<!-- clojure-layer-start -->
## Clojure Abstraction Layer

This project has a **co-existing Clojure layer** that wraps around the Svelte 5 + Convex application, providing Lisp expressiveness while producing the same JS output.

### Architecture

```
┌──────────────────────────────────────────────┐
│           Svelte 5 Components (.svelte)       │
├──────────────────────────────────────────────┤
│     Clojure Abstraction Layer (Squint CLJS)   │
│  ┌─────────┐ ┌──────────┐ ┌──────────────┐   │
│  │  data    │ │  utils   │ │   stores     │   │
│  │content  │ │contrast  │ │  controls    │   │
│  │cv       │ │scroll-ph │ │  site-mode   │   │
│  │labs     │ │depth-filt│ │  toast       │   │
│  │layout   │ │social-lk │ │  staged-flags│   │
│  └─────────┘ └──────────┘ └──────────────┘   │
│  ┌────────────┐ ┌────────────────┐            │
│  │  terminal  │ │  command-os    │            │
│  │  commands  │ │  cache/parser  │            │
│  │  filesystem│ │  registry      │            │
│  │  github    │ │  schema        │            │
│  └────────────┘ └────────────────┘            │
│  ┌──────────┐ ┌───────────┐ ┌──────────┐     │
│  │ sections │ │   admin   │ │  convex   │     │
│  │registry  │ │ constants │ │  client   │     │
│  │  index   │ │           │ │           │     │
│  └──────────┘ └───────────┘ └──────────┘     │
├──────────────────────────────────────────────┤
│          Convex Backend (JS API)              │
└──────────────────────────────────────────────┘
```

### Source Structure

- **Clojure sources**: `clj/src/portfolio/**/*.cljs` — Squint CLJS files
- **Compiled JS output**: `clj/out/portfolio/**/*.js` — ESM modules consumed by Svelte
- **Build config**: `squint.edn` — Squint compilation config (source/output paths, exports)
- **Vite plugin**: `vite-plugin-squint.ts` — Compiles .cljs on change, provides HMR

### How It Works

1. Write Clojure (`.cljs`) in `clj/src/portfolio/`
2. Squint compiles to readable ESM JS in `clj/out/`
3. Svelte components import from `clj/out/` as normal JS modules
4. Vite plugin provides hot recompilation on `.cljs` changes

### Key Principles

- **Minimal JS footprint**: Squint produces lean ESM that tree-shakes well
- **Svelte store interop**: Store wrappers consume/produce Svelte writable/derived stores
- **Convex interop**: `portfolio.convex.client` wraps the same ConvexClient that Svelte uses
- **Immutable data by default**: Clojure's persistent data structures compile to efficient JS
- **Both layers alive**: The original `.ts` files remain; Clojure wraps alongside them

### Importing From Svelte

```svelte
<script>
// Import from the compiled Clojure output
import { skills, sortEntries, getHighlight } from '../../clj/out/portfolio/data/content';
import { getContrastColor } from '../../clj/out/portfolio/utils/contrast';
import { filterByDepth } from '../../clj/out/portfolio/utils/depth_filter';
</script>
```

### Compiling

```bash
# One-time compile
npx squint compile --config squint.edn

# Dev mode: Vite plugin watches and recompiles automatically
bun run dev
```
<!-- clojure-layer-end -->
