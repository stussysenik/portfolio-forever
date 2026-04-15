# Design Document: Carbon as Sixth Theme

## Architecture Overview

Carbon plugs into the existing data-driven theme registry as one more row. No new components, no new switching logic, no new persistence path. The flow is identical to the five themes already shipping.

```
Convex `themes` (now 6 rows)
  → api.themes.getAll
  → Admin ThemeSwitcher (unchanged, registry-iterating)
  → setAttribute("data-theme", "carbon")
  → src/app.css `[data-theme="carbon"]` block resolves Carbon → project tokens
  → ThemeController WCAG AAA validator (unchanged)
```

## Token Mapping

Bridge between IBM Carbon Design System v11 and the existing project token system. Every Carbon token below maps to the same project CSS custom property used by all five existing themes — no new variables introduced, no existing variables renamed.

### Color (Carbon White / Gray 10 light variant)

| Carbon v11 token       | Project token              | Example value |
|------------------------|----------------------------|---------------|
| `$background`          | `--color-bg`               | `#ffffff`     |
| `$layer-01`            | `--color-bg-alt`           | `#f4f4f4`     |
| `$layer-02`            | `--color-surface`          | `#ffffff`     |
| `$layer-03`            | `--color-surface-raised`   | `#f4f4f4`     |
| `$text-primary`        | `--color-text`             | `#161616`     |
| `$text-secondary`      | `--color-text-secondary`   | `#525252`     |
| `$text-helper`         | `--color-text-muted`       | `#6f6f6f`     |
| `$text-placeholder`    | `--color-text-subtle`      | `#a8a8a8`     |
| `$link-primary`        | `--color-accent`           | `#0f62fe`     |
| `$link-primary-hover`  | `--color-accent-hover`     | `#0043ce`     |
| `$highlight`           | `--color-accent-subtle`    | `#edf5ff`     |
| `$support-success`     | `--color-success`          | `#24a148`     |
| `$support-warning`     | `--color-warning`          | `#f1c21b`     |
| `$support-error`       | `--color-danger`           | `#da1e28`     |
| `$border-subtle-01`    | `--border-color-subtle`    | `#e0e0e0`     |
| `$border-strong-01`    | `--border-color`           | `#8d8d8d`     |
| `$border-inverse`      | `--border-color-strong`    | `#161616`     |

### Spacing (Carbon 8px grid → existing space ramp)

| Carbon v11 token | Project token   | Resolved (1rem base) |
|------------------|-----------------|----------------------|
| `$spacing-01`    | `--space-3xs`   | 0.125rem (2px)       |
| `$spacing-02`    | `--space-2xs`   | 0.25rem (4px)        |
| `$spacing-03`    | `--space-xs`    | 0.5rem (8px)         |
| `$spacing-04`    | `--space-sm`    | 0.75rem (12px)       |
| `$spacing-05`    | `--space-md`    | 1rem (16px)          |
| `$spacing-06`    | `--space-lg`    | 1.5rem (24px)        |
| `$spacing-07`    | `--space-xl`    | 2rem (32px)          |
| `$spacing-08`    | `--space-2xl`   | 2.5rem (40px)        |
| `$spacing-09`    | `--space-3xl`   | 3rem (48px)          |
| `$spacing-10`    | `--space-4xl`   | 4rem (64px)          |
| `$spacing-11`    | `--space-5xl`   | 5rem (80px)          |
| `$spacing-12`    | `--space-6xl`   | 6rem (96px)          |

Carbon's 8px grid is preserved as the *visual* rhythm; the existing fluid token names are reused as the *technical* container. Project consumers do not change.

### Typography

| Carbon v11 token         | Project token        | Resolved |
|--------------------------|----------------------|----------|
| `$font-family-sans`      | `--font-sans`        | `'IBM Plex Sans', system-ui, sans-serif` |
| `$font-family-mono`      | `--font-mono`        | `'IBM Plex Mono', ui-monospace, monospace` |
| `$body-compact-01`       | `--font-size-sm`     | (existing fluid clamp) |
| `$body-01`               | `--font-size-base`   | (existing fluid clamp) |
| `$heading-03`            | `--font-size-lg`     | (existing fluid clamp) |
| `$heading-04`            | `--font-size-xl`     | (existing fluid clamp) |
| `$productive-heading-06` | `--font-size-2xl`    | (existing fluid clamp) |
| `$expressive-heading-06` | `--font-size-3xl`    | (existing fluid clamp) |

### Motion

| Carbon v11 token              | Project token |
|-------------------------------|---------------|
| `$duration-fast-01` (70ms)    | (referenced, consumed via existing transitions) |
| `$duration-fast-02` (110ms)   | (referenced, consumed via existing transitions) |
| `$duration-moderate-01` (150ms) | (referenced, consumed via existing transitions) |
| `$easing-productive`          | (referenced, consumed via existing transitions) |
| `$easing-expressive`          | (referenced, consumed via existing transitions) |

Motion tokens are documented for reference but introduce no new project variables. Existing transition timings remain authoritative; Carbon's curves can be wired up later if a global motion ramp lands.

## Convex Seed Shape

`themes.seedBuiltIn` gains one element. Idempotent guard (`existing.length > 0`) is preserved, so production data is unaffected. For environments already seeded, the change tasks include a follow-up `themes.upsert` to inject Carbon.

```ts
{
  themeId: "carbon",
  label: "Carbon",
  type: "light" as const,
  isBuiltIn: true,
  isDefault: false,
  colors: { /* see token mapping */ },
  fonts: { sans: "ibm-plex-sans", mono: "ibm-plex-mono" },
}
```

## Why This Is Additive

1. No edit to any of the five existing `[data-theme="..."]` blocks
2. No rename of any project CSS custom property
3. No new theme-related component, store, or persistence layer
4. No change to the WCAG AAA contrast validator
5. The Convex schema remains identical — only data is added
6. A future revert means deleting one CSS block and one seed entry

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Carbon's blue clashes with existing accent | Scoped to `[data-theme="carbon"]` only |
| `IBM Plex Sans` adds font weight | Single family added to existing `@import`, `display=swap` already on |
| Seed only runs on empty tables | Tasks include explicit `themes.upsert` for already-seeded deployments |
| Visual regression on existing themes | Tasks include screenshot diff against `main` for all five existing themes |
