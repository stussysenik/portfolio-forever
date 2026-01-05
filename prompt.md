Design and architect a personal website system for a multi-disciplinary creative technologist who operates as an ever-expanding archive across filmmaking, lighting design, graphic design, music production, DJing, and experimental web tools. The site must function as a **curatorial time machine**—simultaneously a polished professional portfolio, a working laboratory for WebAssembly/WebGPU experiments, and a minimal blog for technical opinions.

### Core Design Philosophy

**"The Interface Disappears, The Work Remains"**  
Adopt the brutalist minimalism of ricardocabello.com but evolve it: system-native monospace fonts, true-black backgrounds, and intentional whitespace. all interactive elements should feel terminal-native: subtle ASCII glyphs (`→`, `◆`, `█`) as state indicators, hover effects that invert character brightness rather than changing color, and scroll interactions that reveal content line-by-line like a terminal print-out. No animations exceed 60ms. The design must feel like a 1970s mainframe terminal that learned to render WebGPU.

### Content Architecture (Quadripartite System)

Structure content into four distinct layers with separate data lifecycles:

**1. THE REAL THING (Primary Showcase)**  
Permanently pinned full-bleed demonstrations of *working* projects. Not screenshots—live embeds.  
- **Filmmaking**: Self-hosted MP4 via `<video>` with custom ASCII-styled controls (no browser chrome). Each film gets a `manifest.json` with metadata: aspect ratio, codec, lighting setup notes (JSON schema: `{lighting: {key: string, fill: string, motivation: string}, camera: {body: string, lens: string, focalLength: number}}`).  
- **Web Tools**: WASM modules loaded in isolation frames with feature-policy headers. Each tool has a `tool.yaml` defining input/output MIME types, memory budget (max 512MB), and whether it requires `SharedArrayBuffer`.  
- **Music/DJing**: Native Web Audio API players with ASCII waveform visualization (canvas-based, 32-band EQ display using `█` characters of varying opacity). Tracks served from `/static/audio` as 320kbps MP3 with `howler.js` for gapless loops.

**2. THE CV (Structured Data)**  
A machine-readable, schema.org-aligned professional timeline.  
- Single source: `/data/cv.jsonld` (JSON-LD format). Defines `@type: Person` with `knowsAbout` array listing each discipline weighted by proficiency (0.0-1.0).  
- Each CV entry contains `temporalCoverage` (ISO 8601 intervals), `location` (where work was created), `collaborator` (array of `@id` references), and `toolUsed` (array of software/hardware URIs).  
- This file is **never hand-edited**—you will build a CLI Node script (`npm run cv:add`) that prompts in terminal and validates against JSON Schema before git commit.

**3. BLOG & OPINIONS (Chronological Notes)**  
Not a traditional blog—atomic notes with bidirectional linking like a personal wiki.  
- Markdown files in `/content/notes/` with YAML frontmatter containing `tags: string[]`, `related: string[]` (relative file paths), and `draft: boolean`.  
- Filenames as slugs: `20240105-why-svelte-beats-react.md`. No nested folders—flat structure, sorted by date.  
- Build step: Node script parses all notes, builds a link graph, and generates `links.json` for the client to render "related notes" without server queries.  
- RSS/JSON Feed generation is non-negotiable—must output both `feed.xml` and `feed.json` at build time.

**4. LABORATORY (Sandboxed Experiments)**  
Future-looking, unstable, may break.  
- Each experiment is a **Git submodule** under `/labs/`. Example: `/labs/raymarch-wgsl/` contains pure WebGPU code, builds to `/static/labs/raymarch-wgsl/`.  
- Main site's `/routes/labs/[slug]/+page.svelte` is a thin loader that injects the experiment into an iframe with `sandbox="allow-scripts"` and a fallback message if WASM fails to load.  
- Experiments publish a `lab-manifest.toml` defining: `entryPoint`, `requiredFeatures: ["webgpu", "shared-array-buffer"]`, `fallbackImage` (PNG for browsers lacking support).  
- Labs are **never indexed** by search engines—`X-Robots-Tag: noindex` header mandatory.

### Technical Architecture (Boring But Fast)

**Frontend**: SvelteKit with `adapter-static` for primary routes, `adapter-node` for `/admin` and `/api` routes.  
- TypeScript strict mode enabled—no `any` types allowed.  
- CSS: Vanilla-extract (not Tailwind). Write type-safe styles in `.css.ts` files that compile to static CSS. This gives you utility-class ergonomics without runtime overhead or lock-in.

**Backend**: SQLite via `better-sqlite3` for search and content caching only.  
- Schema: single `search_index` FTS5 virtual table populated at build time from JSON/Markdown sources.  
- **No runtime DB writes**—SQLite is read-only cache. Source of truth remains Git.

**Content Management**: Build a **single-page admin interface** at `/admin` (password-protected via Vercel Edge Config).  
- It loads the raw JSON/YAML files via GitHub API, provides a Notion-like block editor (using `slate.js` or `prosemirror`), and commits changes back via a GitHub Action.  
- This is **not a CMS**—it's a Git commit UI. Every save creates a signed commit with conventional message format: `content: update cv entry for Project X`.

**Search**: Client-side Lunr.js index built at build time. No server search endpoint.

### Specific Interaction Ergonomics

- **Keyboard-First**: Every clickable element must be reachable via `Tab`. Press `?` to show keyboard shortcut overlay (`g` → go to, `e` → edit, `/` → search).  
- **Edit-in-Place**: On `/admin` route, double-click any text node to open inline editor (save on `Cmd+S`, discard on `Esc`). Changes are persisted to memory first, synced to GitHub on explicit "Publish" click.  
- **ASCII Feedback**: All state changes (loading, saving, error) appear in a fixed-bottom "terminal" bar using green monospace text. Example: `✓ Saved "cv.jsonld"` or `⚠ WebGPU not supported, falling back to canvas2D`.  
- **Performance Budget**: Each route's JavaScript payload must be <30KB gzipped. Labs are exempt but must show a warning if exceeding 500KB.

### Implementation Roadmap for LLM

**Phase 0 (Foundation)**:  
1. Scaffold SvelteKit + TypeScript + Vanilla-extract. Configure `adapter-static` + `adapter-node` dual output.  
2. Create `/data` directory with schemas for CV, Works, Notes. Write Zod validators for each.  
3. Build Node CLI script `npm run content:validate` that exits with code 1 if any JSON fails validation.  
4. Deploy to Vercel with GitHub integration. Set up Edge Config with `ADMIN_PASSWORD`.

**Phase 1 (Content Pipeline)**:  
5. Implement `/admin` route: load content files in browser, render them in a monospace-textarea editor with line numbers (like VSCode but simpler).  
6. Build GitHub Action: accepts POST with file content + commit message, validates via Zod, commits to repo.  
7. Wire admin UI to this action—show commit SHA in terminal bar on success.

**Phase 2 (Showcase)**:  
8. Create `/routes/+page.svelte`: loads `/data/works.json`, renders grid of "Real Thing" embeds. Each embed is a Svelte component that inspects `manifest.json` and renders appropriate player (video, wasm-loader, audio).  
9. Build `<AsciiVideo controls>` component: custom play/pause button using `[ > ]` glyphs, progress bar made of `=` characters, timestamp in `00:00:00` format.  
10. Implement `/cv` route: renders JSON-LD as human-readable timeline with microdata attributes for machine parsing.

**Phase 3 (Publishing)**:  
11. Build `/notes` route: loads all Markdown files, renders them with `marked` plus custom renderer for `[[wikilinks]]`.  
12. Implement bidirectional linking: build script scans all notes for `[[slug]]`, generates backlink metadata, injects into page via layout data.  
13. Generate `feed.xml` and `feed.json` at build time using `rss` npm package.

**Phase 4 (Laboratory)**:  
14. Create `/labs` route: reads `/labs/*/lab-manifest.toml`, renders index of experiments with support badges (WebGPU ✓, WASM ✓).  
15. Build `<ExperimentLoader>` component: reads manifest, feature-detects requirements, either injects iframe or shows fallback PNG + error message.  
16. Document the submodule workflow in README: how to add new lab, how to build, how to debug.

### Non-Negotiable Constraints

- **Zero Vendor Lock-In**: Every data file must be valid JSON/YAML/Markdown that can be parsed by standard tools. No proprietary UUIDs or foreign keys.  
- **Free Tier Compliance**: Must run on Vercel Hobby plan without exceeding limits. If a feature requires paid tier, implement a fallback or remove it.  
- **No Client-Side Analytics**: Use server logs only. No Google Analytics, no Plausible.  
- **Build Time <60s**: On Vercel Hobby, full build must complete within 60 seconds. Use `vite-plugin-static-copy` to avoid re-processing static assets.

### What You Must NOT Do

- Do not use any SaaS CMS (Sanity, Payload Cloud, etc.).  
- Do not use a traditional database (PostgreSQL, MySQL).  
- Do not implement user authentication (no login forms, no JWT). Password-protect `/admin` at edge layer only.  
- Do not add a JavaScript framework on top of SvelteKit (no React, Vue, Solid integration).  
- Do not use a component library (no shadcn, no Melt UI). Write every component from scratch.

### Success Criteria

The LLM has succeeded if:  
1. `npm run dev` starts a local server where you can navigate between Works, CV, Notes, and Labs without page reloads.  
2. Editing `/data/works.json` and refreshing shows updated content instantly (no build step).  
3. `/admin` route prompts for password; incorrect password returns 403 from Edge, not client-side JS.  
4. Adding a new `.md` file to `/content/notes/` automatically appears in `/notes` index after restart.  
5. A lab experiment requiring WebGPU shows graceful fallback on Safari.  
6. Total `npm install` time is under 90 seconds on a 2018 MacBook Air.