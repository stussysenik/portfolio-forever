# Design: Overhaul Admin UX

## Architecture Overview

This change touches three layers: **Presentation** (Svelte components), **State** (admin context + local state), and **Data** (Convex mutations + new tables).

```
┌─────────────────────────────────────────────────────┐
│ Presentation Layer (Svelte)                         │
│  PageSidebar ─ Home card + flags pagination         │
│  PreviewPane ─ Breakpoint bar + H/V + dashed border │
│  AdminShell  ─ Priority collapse topbar             │
│  PagePanel   ─ ChangeBadge + ResetButton per group  │
│  Primitives  ─ AdminChipGroup (standardized)        │
│               ─ HistoryPopover (new)                │
│               ─ ResetButton (new)                   │
│               ─ ChangeBadge (new)                   │
├─────────────────────────────────────────────────────┤
│ State Layer                                         │
│  Local: flagCategory, orientation, viewportHeight   │
│  Context: unchanged (client, api)                   │
├─────────────────────────────────────────────────────┤
│ Data Layer (Convex)                                 │
│  adminHistory table ─ change log                    │
│  hero.ts      ─ write history on mutation           │
│  siteConfig.ts ─ write history on mutation          │
│  sectionRegistry.ts ─ write history on mutation     │
└─────────────────────────────────────────────────────┘
```

## Key Design Decisions

### Home Card vs Page Row
Home is the root page. It gets a card treatment that is visually distinct from the draggable page list. The card is rendered ABOVE the "PAGES" label and separated by a thin border. This makes it stationary and easy to find.

### Breakpoint Presets: 3 vs 6
Current 6 presets (320, 390, 768, 1024, 1440, 1920) clutter the bar. Analysis: 390 (mobile), 768 (tablet), 1440 (laptop) are the most commonly checked. Others are accessible via custom input. This cuts bar width by ~50%.

### Flags Grouping
10 flags categorized by domain:
- **Visual** (4): pixel-engine, ascii-donut, parallax, terminal-matrix — affects rendering
- **Layout** (3): view-transitions, wip-banner, elevator — affects page structure
- **System** (3): os-desktop, social-links, command-palette — affects global features

### History Storage
New `adminHistory` table with composite index on `(table, field)` for efficient per-control queries. Schema:
```
adminHistory: defineTable({
  table: v.string(),        // "hero", "siteConfig", "sectionRegistry"
  field: v.string(),        // "size", "weight", "parallax"
  oldValue: v.any(),
  newValue: v.any(),
  timestamp: v.number(),    // Date.now()
}).index("by_table_field", ["table", "field"])
```

Query pattern: `getRecent({ table, field, limit: 5 })` returns last 5 changes for a specific control.

### Reset Defaults
Defaults stored as a const map in `src/lib/admin/constants.ts`:
```typescript
export const DEFAULTS = {
  hero: { size: '2rem', leading: 1.2, tracking: '0em', weight: 400, wrap: 'wrap' },
  siteConfig: { mode: 'multi-page', parallax: 0.5 },
  flags: { 'pixel-engine': false, ... }
} as const;
```

### Component Token Consistency
All chip groups MUST use `AdminChipGroup` primitive. Any inline chip markup found during audit gets replaced. The primitive already supports:
- `mode: 'exclusive' | 'multi'`
- `color: 'blue' | 'green'`
- `layout: 'row' | 'grid'`
- `size: 'sm' | 'md'`
- `equalWidth: boolean`

Border-radius is hardcoded at 2px in the primitive — no per-instance override needed.

## Cross-Cutting Concerns

### Responsive Behavior
- Top bar collapse: CSS `@media (max-width: 1023px)` hides theme/font, shows overflow chip
- Flags step bar: Fits within existing sidebar width (220px)
- Breakpoint bar: Wraps gracefully at narrow preview pane widths

### Performance
- History queries are indexed and limited to 5 rows — negligible cost
- Badge timestamps use relative time formatting (client-side, no extra queries)
- Flag category pagination is pure local state — no Convex round-trips

### Accessibility
- All new buttons/chips meet 44px touch target minimum
- Step bar uses proper ARIA: role="tablist", aria-selected
- History popover uses role="dialog" with focus trap
- Reset buttons have descriptive aria-labels

## Dependencies & Sequencing
1. **Schema + adminHistory table** — must deploy first (other changes depend on it)
2. **Primitives** (ChangeBadge, ResetButton, HistoryPopover) — independent, can parallelize
3. **Component standardization** — audit + replace inline chips
4. **Sidebar changes** (Home card + flags) — can parallelize
5. **PreviewPane + AdminShell** — can parallelize
6. **Wire history tracking** into mutations — depends on schema + primitives
7. **Test audit** — after all UI changes land
