# Proposal: Backfill Responsive Suites and Storybook Stories

## Overview
Close the three genuinely missing gaps in the existing stress-testing infrastructure: populate the empty `tests/responsive/tablet/` and `tests/responsive/desktop/` Playwright suites, and add Storybook stories for four already-shipped components that have none.

## Problem Statement
The grounding audit on 2026-04-15 (`DOCS/plans/2026/04/15/portfolio-os-grounding.md`, Delta 2 + Decisions Log D2) found that `add-stress-testing` is *infra-complete, content-partial*. The framework is delivered, but three concrete gaps remain:

1. **Tablet responsive suite is empty.** `playwright.config.ts:137-143` declares the `responsive-tablet` project pointing at `tests/responsive/tablet/*.spec.ts` with the iPad Mini device profile, but the directory contains zero spec files.
2. **Desktop responsive suite is empty.** `playwright.config.ts:144-150` declares `responsive-desktop` against `tests/responsive/desktop/*.spec.ts` with the Desktop HiDPI profile, also empty.
3. **Storybook is a ghost town.** `.storybook/main.ts` is configured for `@storybook/svelte-vite` with the a11y addon, but only one story file exists at `src/lib/components/Toast.stories.ts`. Four already-shipped, theme-critical components have no stories: `ThemeSwitcher`, `FontSwitcher`, `Elevator`, and `AsciiDonut`.

Everything else originally scoped under `add-stress-testing` — mobile responsive, theme/font E2E, accessibility (axe-core), visual regression, keyboard shortcuts — is delivered (`tests/e2e/theme-and-fonts.spec.ts`, `tests/accessibility/homepage.spec.ts`, the `visual-regression` and `responsive-mobile` projects, etc.). Do not re-plan any of it.

## Proposed Solution

### 1. Tablet responsive suite (`tests/responsive/tablet/`)
Add Playwright specs that exercise the same surfaces the mobile suite already covers, but at iPad Mini breakpoints:
- Layout integrity on `/`, `/works`, `/cv`, `/admin`
- Theme switching across the five themes (`minimal`, `studio`, `terminal`, `darkroom`, `accessible`)
- Critical flows: hero rendering, works grid, admin compartment opening

### 2. Desktop responsive suite (`tests/responsive/desktop/`)
Equivalent specs at the Desktop HiDPI viewport — same routes, same themes, same critical flows — to verify no layout regressions at large breakpoints.

### 3. Storybook backfill
Author one `.stories.ts` file per component, matching the format of `src/lib/components/Toast.stories.ts`:
- `src/lib/components/ThemeSwitcher.stories.ts` — one story per theme + a default
- `src/lib/components/FontSwitcher.stories.ts` — one story per font family
- `src/lib/components/Elevator.stories.ts` — default + interaction states
- `src/lib/sections/AsciiDonut.stories.ts` (or wherever it lives) — default render

Stories must work with the existing `@storybook/addon-a11y` so axe runs in the Storybook UI.

## Impact & Benefits
- **Coverage parity.** Tablet and desktop join mobile in the responsive matrix; regressions at any of the three breakpoint tiers fail CI.
- **Component isolation.** ThemeSwitcher, FontSwitcher, Elevator, and AsciiDonut become inspectable in Storybook with a11y feedback, which closes the visual-isolation gap noted in the audit.
- **Honest tracking.** `add-stress-testing` stops reporting 0/12 against reality.

## Dependencies
- `playwright.config.ts` (project declarations already exist at `:137-150`, no config edits needed)
- `.storybook/main.ts` (already configured)
- `src/lib/components/Toast.stories.ts` (format reference)
- All four target components already exist and ship today

## Alternatives Considered
1. **Rewrite `add-stress-testing/tasks.md` in place.** Rejected: the change is large and partly historical; a focused new change is cleaner and matches Decision D2.
2. **Include CommandPalette stories.** Rejected: the component does not exist yet and is owned by a separate, future change.
3. **Add overlap-detector tests.** Rejected: optional in D2, out of scope here.

## Success Criteria
- [ ] `tests/responsive/tablet/` contains specs that exercise theme switching, layout, and critical flows at the iPad Mini viewport
- [ ] `tests/responsive/desktop/` contains equivalent specs at the Desktop HiDPI viewport
- [ ] Stories exist for `ThemeSwitcher`, `FontSwitcher`, `Elevator`, `AsciiDonut`
- [ ] `bun run storybook` boots and renders all four new components with no a11y violations
- [ ] `bunx playwright test --project=responsive-tablet` and `--project=responsive-desktop` both pass
