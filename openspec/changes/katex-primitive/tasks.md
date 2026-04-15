# Tasks: KaTeX as a First-Class Text Primitive

## Phase 1: Dependency + Stylesheet

### Task 1.1: Add `katex` runtime dependency
**File**: `package.json`
- [ ] Add `"katex": "^0.16.x"` to `dependencies`
- [ ] Run `bun install` and confirm lockfile updates

### Task 1.2: Import KaTeX stylesheet globally
**File**: `src/app.css`
- [ ] Add `@import 'katex/dist/katex.min.css';` after the Google Fonts import on line 7
- [ ] Verify KaTeX_Math / KaTeX_Main font-face declarations resolve via the bundler

---

## Phase 2: Primitive Component

### Task 2.1: Create `Katex.svelte`
**File**: `src/lib/components/Katex.svelte`
- [ ] Props: `content?: string`, `displayMode?: boolean = false`; slot fallback when `content` is omitted
- [ ] `onMount` calls `katex.render(source, el, { displayMode, throwOnError: false, output: 'mathml' })`
- [ ] SSR-safe: empty span on server, hydrate on mount
- [ ] Inherit color via `currentColor` so theme tokens drive math color

### Task 2.2: Create `parseMath.ts` utility
**File**: `src/lib/utils/parseMath.ts`
- [ ] Function `parseMath(input: string): Array<{ type: 'text' | 'math', value: string, displayMode: boolean }>`
- [ ] Recognize `$$...$$` (block) before `$...$` (inline); honor `\$` escape
- [ ] Vitest cases: pure text, inline only, block only, mixed, escaped dollar, unmatched delimiter

---

## Phase 3: Wire Existing Text Surfaces

### Task 3.1: Works + hero case study descriptions
**File**: `src/lib/sections/works/WorksCaseStudy.svelte`
- [ ] Import `Katex` and `parseMath`
- [ ] Replace `{project.description}` at lines 24-25 with parser-driven loop emitting `<Katex>` for math segments
- [ ] Confirm both call sites (works grid + hero case study grid) render correctly

### Task 3.2: Blog post body
**File**: `src/routes/blog/[slug]/+page.svelte`
- [ ] After `DOMPurify.sanitize` on line 83, walk the result and render math islands via `<Katex>`
- [ ] Preserve existing `:global` prose styling for `h2`, `p`, `code`, etc. (lines 181-256)
- [ ] Verify no XSS regression — KaTeX outputs MathML

### Task 3.3: CV entry descriptions
**File**: `src/lib/sections/CvSection.svelte`
- [ ] Import `Katex` and `parseMath`
- [ ] Replace `{entry.description}` at line 93 with parser-driven loop
- [ ] Verify `.cv-entry-description` styling at line 255 still applies

---

## Phase 4: Theme + Font Validation

### Task 4.1: Visual check across all themes
- [ ] Inline + block math legible in: `minimal`, `studio`, `terminal`, `darkroom`, `accessible`
- [ ] Math color follows `--color-text` via `currentColor`

### Task 4.2: Font compatibility
- [ ] Math glyphs (KaTeX_Math) coexist visually with all 9 body fonts: `inter`, `crimson`, `jetbrains`, `fira`, `space`, `rubik`, `ibm-plex`, `times`, `helvetica`
- [ ] No vertical alignment regression on inline math inside any of the 9 fonts

---

## Phase 5: Storybook + Accessibility

### Task 5.1: Storybook story for `Katex.svelte`
**File**: `src/lib/components/Katex.stories.ts`
- [ ] Inline example: `$E = mc^2$`
- [ ] Block example: `$$\nabla \cdot \mathbf{E} = \rho/\varepsilon_0$$`
- [ ] Mixed inline + text example; escaped dollar example
- [ ] All 5 themes selectable via the existing Storybook theme decorator

### Task 5.2: Accessibility verification
- [ ] MathML output present in DOM (verify via DevTools)
- [ ] Screen reader announces math (test with VoiceOver on macOS)
- [ ] axe-core run against a page containing a `<Katex>` block reports no new violations

---

## Task Summary

**Total Tasks**: 12
**Completed**: 0/12
