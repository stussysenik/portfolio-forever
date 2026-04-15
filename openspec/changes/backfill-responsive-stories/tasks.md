# Tasks: Backfill Responsive Suites and Storybook Stories

Closes the three gaps from `DOCS/plans/2026/04/15/portfolio-os-grounding.md` Decision D2: tablet suite, desktop suite, Storybook backfill for four shipped components.

---

## Phase 1: Tablet Responsive Suite

### Task 1.1: Verify project declaration (`playwright.config.ts`)
- [ ] Confirm `responsive-tablet` at `playwright.config.ts:137-143` points at `tests/responsive/tablet/*.spec.ts` with `devices["iPad Mini"]`
- [ ] Confirm `tests/responsive/tablet/` exists and is empty

### Task 1.2: Tablet layout spec — `tests/responsive/tablet/layout.spec.ts` (new)
- [ ] Visit `/`, `/works`, `/cv`, `/admin` at iPad Mini viewport
- [ ] Assert no horizontal scroll, hero renders, primary nav visible
- [ ] Snapshot critical containers via `toHaveScreenshot`

### Task 1.3: Tablet theme-switching spec — `tests/responsive/tablet/theme-switching.spec.ts` (new)
- [ ] Cycle `minimal`, `studio`, `terminal`, `darkroom`, `accessible` via `'T'` key
- [ ] Assert `[data-theme]` attribute and `--color-bg` resolve per theme
- [ ] Mirror assertion style from `tests/e2e/theme-and-fonts.spec.ts`

### Task 1.4: Tablet critical-flow spec — `tests/responsive/tablet/critical-flows.spec.ts` (new)
- [ ] Hero renders with optional ASCII donut/wave when `heroConfig.showDonut` is on
- [ ] Works grid renders entries from `api.works.getVisibleWorks`
- [ ] Admin `SectionCompartment` accordion opens at tablet width

---

## Phase 2: Desktop Responsive Suite

### Task 2.1: Verify project declaration (`playwright.config.ts`)
- [ ] Confirm `responsive-desktop` at `playwright.config.ts:144-150` points at `tests/responsive/desktop/*.spec.ts` with `devices["Desktop HiDPI"]`
- [ ] Confirm `tests/responsive/desktop/` exists and is empty

### Task 2.2: Desktop layout spec — `tests/responsive/desktop/layout.spec.ts` (new)
- [ ] Visit `/`, `/works`, `/cv`, `/admin` at Desktop HiDPI viewport
- [ ] Assert layout fills container, no overflow at 1920+ widths
- [ ] Snapshot critical containers

### Task 2.3: Desktop theme-switching spec — `tests/responsive/desktop/theme-switching.spec.ts` (new)
- [ ] Cycle the five themes via `'T'` key
- [ ] Assert `[data-theme]` and `--color-bg` resolve per theme

### Task 2.4: Desktop critical-flow spec — `tests/responsive/desktop/critical-flows.spec.ts` (new)
- [ ] Hero diptych/editorial/stacked layout modes render at desktop
- [ ] Works grid renders multi-column at HiDPI
- [ ] Admin `BookmarkTabs` Content/Style/Layout switching works at desktop

---

## Phase 3: Storybook Backfill

### Task 3.1: ThemeSwitcher stories — `src/lib/components/ThemeSwitcher.stories.ts` (new)
- [ ] Match format of `src/lib/components/Toast.stories.ts`
- [ ] `Default` plus one story per theme: `Minimal`, `Studio`, `Terminal`, `Darkroom`, `Accessible`
- [ ] `addon-a11y` reports zero violations

### Task 3.2: FontSwitcher stories — `src/lib/components/FontSwitcher.stories.ts` (new)
- [ ] `Default` plus one story per font family declared in `src/lib/components/FontSwitcher.svelte`
- [ ] `addon-a11y` reports zero violations

### Task 3.3: Elevator stories — `src/lib/components/Elevator.stories.ts` (new)
- [ ] `Default` plus interaction-state stories where applicable
- [ ] `addon-a11y` reports zero violations

### Task 3.4: AsciiDonut stories — co-locate next to `AsciiDonut.svelte` (e.g. `src/lib/components/AsciiDonut.stories.ts`)
- [ ] `Default` story renders the static donut
- [ ] `addon-a11y` reports zero violations
- [ ] Do NOT add CommandPalette stories — out of scope

---

## Phase 4: Verification

- [ ] `bunx playwright test --project=responsive-tablet` passes locally
- [ ] `bunx playwright test --project=responsive-desktop` passes locally
- [ ] `bun run storybook` boots; all four new component pages render with zero a11y violations

---

**Total Tasks**: 14 | **Completed**: 0/14 | **Scope**: tablet, desktop, four stories — nothing more
