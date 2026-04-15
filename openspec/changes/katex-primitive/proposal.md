# Proposal: KaTeX as a First-Class Text Primitive

## Overview
Add KaTeX as a math primitive available **anywhere text flows** — works, blog, CV, hero case studies. Read-time only: authored as plain `$...$` / `$$...$$` strings in Convex, rendered to MathML + accessible text at view-time.

## Problem Statement
Portfolio targets CVPR / SIGGRAPH-adjacent readers. Every text surface today renders raw strings:

- `src/lib/sections/works/WorksCaseStudy.svelte:24-25` — `{project.description}` (used by works grid AND hero case studies)
- `src/routes/blog/[slug]/+page.svelte:82-87` — DOMPurify HTML body, no math
- `src/lib/sections/CvSection.svelte:92-93` — `{entry.description}` plain text

A research portfolio that cannot write `$\nabla \cdot \mathbf{E} = \rho/\varepsilon_0$` in a work description signals the wrong vocabulary. User framing: *"you could pull out KaTeX and write a section not necessarily in the blog but yeah just like text input."* Math is a primitive, not a blog feature.

## Proposed Solution

### 1. Add `katex` runtime dependency
`package.json` has zero math packages (verified). Add `katex` to `dependencies`. Import `katex/dist/katex.min.css` once in `src/app.css` so font-face declarations are global.

### 2. New primitive: `src/lib/components/Katex.svelte`
Single Svelte component wrapping `katex.render()`:

- `content` prop (string) **or** slot children
- `displayMode` boolean (`false` = inline, `true` = block)
- Calls `katex.render(content, el, { displayMode, throwOnError: false, output: 'mathml' })`
- SSR-safe: empty span on server, hydrate on `onMount`

### 3. Syntax convention (read-time parser, not Markdown)
- `$...$` → inline math
- `$$...$$` → block math
- `\$` → literal dollar

`src/lib/utils/parseMath.ts` splits a string into `{ type: 'text' | 'math', value, displayMode }` segments. Renderers iterate and emit `<Katex>` for math segments. **No remark, no rehype, no MDX** — only what KaTeX needs.

### 4. Wire the affected surfaces
- `WorksCaseStudy.svelte` — works grid *and* hero case study grid render here (verified). Replace `{project.description}` with parser + `<Katex>` loop.
- `blog/[slug]/+page.svelte` — pre-process `note.content`, render math islands.
- `CvSection.svelte` — replace `{entry.description}` with parser + `<Katex>` loop.

### 5. Theme + font compatibility
KaTeX ships KaTeX_Math / KaTeX_Main fonts via the imported CSS. Verify legibility against 5 themes (`minimal`, `studio`, `terminal`, `darkroom`, `accessible`) and 9 fonts (`inter`, `crimson`, `jetbrains`, `fira`, `space`, `rubik`, `ibm-plex`, `times`, `helvetica`). Color inherits via `currentColor`.

## Impact & Benefits
- Domain-correct vocabulary for CVPR / SIGGRAPH readership
- One primitive serves four surfaces — additive, zero data migration
- MathML + screen-reader text across every theme
- Math authored as plain strings in existing Convex fields

## Alternatives Considered
1. **MathJax** — heavier, slower first-render. Rejected.
2. **Pre-render in Convex** — couples data to rendering; breaks live-edit. Rejected.
3. **Blog-only KaTeX** — fails user framing. Rejected.
4. **remark + rehype-katex** — parser tree this codebase does not need. Rejected per scope.

## Success Criteria
- [ ] `katex` listed under `dependencies` in `package.json`
- [ ] `Katex.svelte` renders inline and block math with MathML output
- [ ] All four surfaces parse `$...$` and `$$...$$` correctly
- [ ] No layout shift across the 45 theme/font combinations
- [ ] Storybook story exists with inline + block + escape examples
