# Proposal: Works Page Full Editability (MVP "First Page" Slice)

## Overview
Make the `/works` page the first surface where every text field AND every color field is editable from `/admin`, with changes reflected live via the existing Convex subscription. This is the MVP "first page fully editable" slice resolved as Open Question 4 in `DOCS/plans/2026/04/15/portfolio-os-grounding.md`.

**Purely additive, backwards compatible.** No fields are renamed, removed, or restructured. Three new optional fields are added; the existing `styleOverrides.accentColor` is reinterpreted (in the renderer only) as the stripe color.

## Problem Statement
Per the §4 "Works-table readiness for MVP" audit, the `worksEntries` table at `convex/schema.ts:76-105` already covers date (`year`, `month`), name (`title`), and link (`url`), and `styleOverrides` already exists with `accentColor`, `badgeStyle`, `impactMetrics`. But three user-facing affordances are missing:

1. **Custom link text** — the link currently always renders the raw `url`. Users want to display a friendly label (e.g. "Visit demo →") without losing the underlying URL.
2. **HTTP highlight color** — no field controls the color of the http/url accent on a card.
3. **Secondary highlight color** — no second accent slot for tags, hover states, or category chips.

Without these three fields, the works page cannot claim "every text and every color is editable from admin."

## Proposed Solution
Three new optional fields, **additive only**, no renames:

### 1. Schema additions (`convex/schema.ts:76-105`)
- `linkLabel?: string` — top-level on `worksEntries`, sibling to `title` and `url`. Stores the user-specified custom link text.
- `styleOverrides.httpColor?: string` — nested inside the existing `styleOverrides` object. Drives the http/url highlight.
- `styleOverrides.secondaryHighlight?: string` — nested inside `styleOverrides`. Drives the secondary accent (tags, chips, hover states).

Existing `styleOverrides.accentColor` is **reinterpreted as the stripe color** in `WorksSection.svelte` — no rename, no migration. Old documents continue to validate; the renderer simply reads the existing field with new semantic intent.

### 2. Mutation validators (`convex/works.ts`)
Add the three optional fields to both `createEntry` (lines 22-48) and `updateEntry` (lines 50-77) arg validators. `stripUndefined` already handles partial patches.

### 3. Admin UI (`src/lib/admin/WorksAdmin.svelte`)
- Inline editable field for `linkLabel` using the existing chip/tool-tag pattern at lines 239-248 (matches `viewport`, `cam`, `videoPreview`, `muxPlaybackId`).
- Color pickers for `httpColor` and `secondaryHighlight` using the same control language as the existing `accentColor` slot (or a minimal `<input type="color">` chip if no picker exists yet).

### 4. Render surface (`src/lib/sections/WorksSection.svelte`)
- `linkLabel` replaces the URL text on the project link element when present (fallback: existing `url`).
- `httpColor` is applied as a CSS custom property to the http/url accent.
- `secondaryHighlight` is applied as a CSS custom property to the secondary accent element.
- Existing `styleOverrides.accentColor` is read as the stripe color.

## Impact & Benefits
- **Closes the MVP "first page editable" loop** — every text and every color on `/works` becomes mutable from `/admin` without a code deploy.
- **Zero migration risk** — purely additive optional fields, no existing data is touched.
- **Sets the pattern** — the same additive-fields + admin-chip + CSS-var-on-render flow becomes the template for the next page.

## Dependencies
- Existing Convex subscription at `WorksSection.svelte:105-114` (already realtime).
- Existing admin chip pattern at `WorksAdmin.svelte:239-248`.
- `stripUndefined` helper in `convex/helpers.ts` (already used by `updateEntry`).

## Alternatives Considered
1. **Rename `accentColor` → `stripeColor`** — rejected. Requires a migration and breaks backwards compatibility for zero functional gain.
2. **Add a fourth color field** — rejected. The user spec named exactly three new affordances; over-scoping creates noise.
3. **Move colors to a separate `worksStyles` table** — rejected. Premature normalization; `styleOverrides` is already the right home.

## Success Criteria
- [ ] Every text field on a works card is editable from `/admin`
- [ ] Every color field on a works card is editable from `/admin`
- [ ] Edits propagate live via Convex subscription with no reload
- [ ] Existing works documents continue to render unchanged (backwards compat)
- [ ] No existing field is renamed, removed, or restructured
