# TECHSTACK

Authoritative reference for the stack this repository runs on. Grounded in
`package.json` at the time of writing. Update in lockstep with dependency
changes — this file is the entry point for new agents and contributors and
should match what is actually installed.

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

**Icon system** — Admin surfaces (`src/lib/admin/**`, `src/routes/admin/**`)
import every icon through `$lib/admin/admin-icons`, which re-exports curated
lucide icons via `~icons/lucide/*`. Direct `~icons/lucide/*` imports outside
the manifest are rejected by `src/lib/admin/admin-icon-discipline.test.ts`.

## Backend & Data

| Layer        | Tool                              | Version   |
|--------------|-----------------------------------|-----------|
| Backend      | Convex                            | ^1.34.1   |
| Schema       | 26-table Convex schema (see `convex/schema.ts`) | – |
| Validation   | Zod                               | ^4.3.6    |
| Auth         | Clerk (GitHub OAuth for admin)    | ^6.3.3    |
| Runtime JS   | fengari-web (Lua-in-JS for scripting) | ^0.1.4 |

Convex functions live in `convex/**`. Public queries/mutations are generated
into `convex/_generated/api.ts`. Schema changes go through the
`convex-migration-helper` skill when data is live.

## Tooling

| Tool              | Version    | Purpose                        |
|-------------------|------------|--------------------------------|
| TypeScript        | ^5.9.3     | Type system                    |
| svelte-check      | ^4.3.4     | Type + a11y linter             |
| esbuild           | ^0.28.0    | Transitive via Vite            |
| Bun               | latest     | Package manager + script runner |

`bun run check` is the type + a11y gate. `bun run build` produces the static
SvelteKit output. `bun install` respects `bun.lockb`.

## Testing

| Tool                   | Version    | Purpose                         |
|------------------------|------------|---------------------------------|
| Vitest                 | ^4.1.2     | Unit tests (`src/**/*.test.ts`) |
| Playwright             | ^1.57.0    | E2E + responsive tests          |
| @playwright/test       | ^1.57.0    | Playwright runner               |
| @axe-core/playwright   | ^4.11.0    | Accessibility checks            |
| axe-core               | ^4.11.1    | Core a11y engine                |
| Storybook              | ^10.3.3    | Component workshop              |
| @storybook/addon-a11y  | ^10.3.3    | Storybook a11y addon            |
| @storybook/svelte-vite | ^10.3.3    | Svelte + Vite integration       |
| Chromatic              | ^16.0.0    | Visual regression               |

Test layout:
- `tests/e2e/` — Playwright functional specs
- `tests/responsive/` — Playwright viewport sweeps (390 / 768 / 1024 / 1440)
- `tests/accessibility/` — axe-based a11y audits
- `tests/visual/` — screenshot baselines
- `src/**/*.test.ts` — vitest unit + discipline checks

## Deployment

| Tool                         | Version  | Purpose                    |
|------------------------------|----------|----------------------------|
| @sveltejs/adapter-static     | ^3.0.10  | Static output adapter      |
| @sveltejs/adapter-auto       | ^7.0.0   | Fallback dev adapter       |
| Vercel (hosting)             | –        | Static site + Fluid Compute |
| portless (local dev)         | –        | Local tunnelling via `portless portfolio vite dev` |

Build command: `vite build`. Output: static SvelteKit assets deployed to
Vercel. Env vars live in Vercel and are pulled locally via `vercel env pull`.

## Observability & Analytics

| Tool                | Version    | Purpose            |
|---------------------|------------|--------------------|
| @sentry/sveltekit   | ^10.46.0   | Error tracking     |
| posthog-js          | ^1.364.1   | Product analytics  |

## Content & Typography

- Typography: loaded via `@fontsource` equivalents pinned in the app CSS —
  Inter, Rubik, Helvetica, Crimson, Times, IBM Plex, JetBrains Mono,
  Fira Code, Space Mono.
- Math rendering: `katex` wrapped in `src/lib/components/Katex.svelte` via
  the `parseMath` utility for inline + block math.
- Media: Mux Player handles HLS/DASH previews for `works` entries.

## AI & Integration

- Claude-code agent skills live under `~/.claude` (Swift, design, Vercel, convex).
- OpenSpec (`openspec/`) holds the spec + change proposal workflow used by
  this repository. Run `openspec list` for in-flight changes.
- Portfolio OS command palette (`src/lib/command-os/`) ships an NLP prompt
  that the desktop admin uses as a power-user input. Mobile uses the native
  `PAGES · SECTIONS · PREVIEW` dock instead.

## Admin Surfaces

- `src/lib/admin/` — admin components, primitives, bookmarks, controls.
- `src/routes/admin/` — admin route with Clerk GitHub gate.
- `src/lib/admin/tokens/admin-tokens.css` — layout + spacing tokens.
- `src/lib/admin/tokens/admin-shell-tokens.css` — surface + theme-inheriting
  tokens under `.admin-shell[data-admin]`. Light-mode-first; dark mode
  cascades from `data-theme="darkroom"` / `carbon` / `terminal`.

## Version Summary

As of this branch:

- SvelteKit 2.49.1 · Svelte 5.45.6 (runes) · Vite 7.2.6
- Convex 1.34.1 · Clerk 6.3.3 · Zod 4.3.6
- Sentry 10.46.0 · PostHog 1.364.1
- Playwright 1.57.0 · Vitest 4.1.2 · Storybook 10.3.3
- unplugin-icons 23.0.1 + @iconify-json/lucide 1.2.102 (added by
  `redesign-admin-shell` change)
- Vercel adapter-static 3.0.10 · Bun (latest) as package manager
