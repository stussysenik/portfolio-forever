# Tasks: Align Openspec With Repo Reality

## Phase 1: Inventory

- [x] Count checkbox state across every `openspec/changes/*/tasks.md`
- [x] Classify each change as completed, mixed, stale, or strategic backlog
- [x] Identify at least one concrete stale-spec example where code already exists

## Phase 2: Tooling Truth

- [x] Verify current Storybook framework and scripts from `package.json` and `.storybook/`
- [x] Verify responsive test-suite directories currently exist
- [x] Verify command-palette implementation surface currently exists
- [x] Verify installed state-management/tooling reality for `nanostores`, `ts-pattern`, `xstate`, and `remeda`

## Phase 3: Vision Alignment

- [x] Record the highest-value gaps for the portfolio vision
- [x] Produce a recommended execution order that favors shell quality, mobile responsiveness, admin coherence, and tooling truth

## Phase 4: Validation

- [x] `bun run check`
- [x] Run `bun run build-storybook` and record whether it actually works in the current repo state

## Validation Notes

- [x] `bun run check` passes with 0 errors and 1 hint (`src/pages/photos/index.astro` unused import)
- [x] `bun run build-storybook` currently fails because Storybook detects a SvelteKit project while `.storybook/main.ts` uses `@storybook/svelte-vite`; `@storybook/addon-essentials` is also referenced but not installed
