# TECHSTACK

Authoritative reference for the stack this repository runs on. Grounded in `package.json` at the time of writing. Update in lockstep with dependency changes — this file is the entry point for new agents and contributors and should match what is actually installed.

## The Paradigm: Svelte 5 + Clojure (Squint) + Vite

This portfolio uses a unique "Expressive Lisp, Reactive UI" pattern:
- **Logic & Data (Clojure)**: All business logic, static data, complex mapping, and state manipulation is written in ClojureScript (`.cljs`) within `src/lib/clj/`.
- **Compiler (Squint)**: We use `squint-cljs` to compile Clojure directly to modern, tree-shakeable ESM JavaScript (`.mjs`). This means zero runtime overhead compared to standard ClojureScript.
- **UI & Reactivity (Svelte 5)**: Svelte 5 (with Runes) consumes the generated `.mjs` modules just like standard TypeScript/JavaScript. Svelte handles all DOM manipulation, animations, and reactivity.
- **Backend (Convex)**: Convex is used for real-time dynamic data (when available), but the architecture defaults gracefully to the Clojure static data layer as the primary upstream truth.

This architecture gives us the expressive power and immutability of Lisp for data/logic, combined with the unparalleled performance and developer experience of Svelte for UI.

## Frontend

| Layer       | Tool                               | Version   |
|-------------|------------------------------------|-----------|
| Framework   | SvelteKit                          | ^2.49.1   |
| Compiler    | Svelte (runes mode, Svelte 5)      | ^5.45.6   |
| Vite plugin | @sveltejs/vite-plugin-svelte       | ^6.2.1    |
| Bundler     | Vite                               | ^7.2.6    |
| Icons       | unplugin-icons + @iconify-json/lucide | ^23.0.1 / ^1.2.102 |
| UI builders | @melt-ui/svelte                    | ^0.86.6   |
| Media       | @mux/mux-player                    | ^3.11.7   |
| Math        | katex                              | ^0.16.45  |
| Auth SDK    | @clerk/clerk-js                    | ^6.3.3    |

## Backend & Data (Clojure & Convex)

| Layer        | Tool                              | Version   |
|--------------|-----------------------------------|-----------|
| Clojure      | squint-cljs                       | ^0.11.187 |
| Backend      | Convex                            | ^1.34.1   |
| Validation   | Zod                               | ^4.3.6    |
| Auth         | Clerk (GitHub OAuth for admin)    | ^6.3.3    |

The core static data (CV, works, likes, process, gifts, academia) lives in `src/lib/clj/portfolio/data/content.cljs`. The Vite plugin `vite-plugin-squint` automatically recompiles `.cljs` files to `.mjs` during development.

## Tooling & Build

| Tool              | Version    | Purpose                        |
|-------------------|------------|--------------------------------|
| TypeScript        | ^5.9.3     | Type system (bridging)         |
| svelte-check      | ^4.3.4     | Type + a11y linter             |
| Bun               | latest     | Package manager + runner       |

To compile the Clojure sources manually, run `bun run clj:compile`.

## Testing

| Tool                   | Version    | Purpose                         |
|------------------------|------------|---------------------------------|
| Vitest                 | ^4.1.2     | Unit tests (`src/**/*.test.ts`) |
| Playwright             | ^1.57.0    | E2E + responsive tests          |
| @axe-core/playwright   | ^4.11.0    | Accessibility checks            |
| Chromatic              | ^16.0.0    | Visual regression               |

## Deployment

| Tool                         | Version  | Purpose                    |
|------------------------------|----------|----------------------------|
| @sveltejs/adapter-static     | ^3.0.10  | Static output adapter      |
| Vercel (hosting)             | –        | Static site + Fluid Compute|

**Deployment Process**:
1. Vite builds the application.
2. The `vite-plugin-squint` hook or `clj:compile` script ensures all Clojure `.cljs` files are compiled to `.mjs` before Vite bundles them.
3. SvelteKit Adapter Static exports a fully prerendered static site.
4. Output is deployed to Vercel. 
(No dynamic server is needed at runtime unless using live Convex features; static Clojure data acts as the fallback/primary source).
