# /academia Page Design

## Context
Add an academic portfolio page inspired by [zachteed.github.io](https://zachteed.github.io/) — a minimal, single-page layout showcasing research paper re-implementations. Data is managed from `/admin` via Convex, consistent with the existing `/cv` system. Placed before `/terminal` in the nav.

## Route
`/academia` — client-rendered (`ssr: false, prerender: false`), fetches from Convex.

## Layout (Zach Teed style)
1. **Header**: Name, one-line research tagline (from cvProfile or separate field), email
2. **Research entries**: Reverse-chronological list, each entry:
   - Thumbnail image (left-aligned, ~120x80px)
   - Paper title (bold, linked to paper)
   - Authors line: "Original: [authors] | Re-implementation: Stüssy Senik"
   - Venue + year (e.g., "CVPR 2024")
   - Description (1-2 sentences)
   - Links row: [paper] [code] [demo] — only shown if URL exists
3. **Style**: Minimal, content-focused. Uses existing design tokens. No colored backgrounds. Monochrome with accent links.

## Convex Schema Addition
```ts
// In convex/schema.ts — new table
academicEntries: defineTable({
  title: v.string(),
  authors: v.string(),           // original paper authors
  venue: v.optional(v.string()), // e.g. "CVPR 2024"
  year: v.number(),
  description: v.optional(v.string()),
  thumbnailUrl: v.optional(v.string()),
  paperUrl: v.optional(v.string()),
  codeUrl: v.optional(v.string()),
  demoUrl: v.optional(v.string()),
  order: v.number(),
  visible: v.boolean(),
}).index("by_order", ["order"])
```

## Convex Functions
- `academia.ts` — queries: `getVisibleAcademia`, `getFullAcademia`
- `academia.ts` — mutations: `createEntry`, `updateEntry`, `deleteEntry`, `reorderEntries`, `toggleVisibility`
- Same `stripUndefined` helper pattern as other mutation files.

## Admin Page Addition
New "Academia" section in `/admin` between CV sections and Languages:
- Same card-based inline-edit UI as CV entries
- Fields: title, authors, venue, year, description, thumbnailUrl, paperUrl, codeUrl, demoUrl
- Reorder, hide/show, delete controls

## Navigation
In `+layout.svelte` mainNav array, add `{ href: "/academia", label: "academia" }` before the terminal entry.

## Files to create/modify
- **Create**: `src/routes/academia/+page.svelte`, `src/routes/academia/+page.ts`, `convex/academia.ts`
- **Modify**: `convex/schema.ts` (add table), `src/routes/admin/+page.svelte` (add section), `src/routes/+layout.svelte` (add nav item)

## Verification
- `/academia` loads and shows entries from Convex
- `/admin` can create/edit/hide/delete academic entries
- Changes in admin reflect on `/academia` in real-time
- Nav shows "academia" before "terminal"
- All other routes unaffected
