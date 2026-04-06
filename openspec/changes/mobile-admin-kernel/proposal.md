# Proposal: Mobile Admin Kernel — Portfolio OS

## Overview
Transform `/admin` into a mobile-first Portfolio OS kernel — an iA Writer + Things-inspired interface where every database parameter, config variable, and content entry is accessible as a quick-access control from your phone. The admin becomes a self-contained meta-website builder with Convex real-time sync, eliminating the need to switch to desktop for any portfolio operation.

## Problem Statement
The admin UI has grown organically and exhibits critical mobile gaps:

1. **No content editing on mobile** — The preview pane (where LiveContent double-tap editing lives) is only visible at >=1024px. On phones, you can configure sections but cannot edit actual content (name, taglines, blog posts, works entries, CV data).
2. **No live preview on mobile** — Mobile layout shows only the builder area. There is zero visual feedback for changes made on a phone.
3. **Scattered controls** — Typography, content, layout, and style controls are split across InlineSectionConfig, HeroCaseStudyAdmin, EntryTable, and the preview-side LiveContent blocks with no unified access pattern.
4. **Lost aura** — The admin has accumulated features without a unifying organizational principle. It lacks the minimal, intentional feel of "built by things."
5. **Not batteries-included** — You cannot create a new work entry, edit a CV highlight, or toggle a blog post's visibility from your phone at a conference. The admin is a desktop tool pretending to be responsive.
6. **No parameter discoverability** — heroConfig has 11 fields, pages have themeOverrides, sections have config objects, entries have 5-20 fields each — but there's no way to discover and access all modifiers from one organized surface.

## Design Philosophy

**Soul:** Virgil Abloh's systems thinking — construction visibility, the architecture IS the interface, complexity made intentional through structure.

**DNA:** iA Writer (content IS the interface, no chrome, just data and fields) + Things by Cultured Code (perfect hierarchy, progressive disclosure, headings ARE navigation).

**Principle:** The admin is the kernel of a Portfolio OS. Every register (database field) is readable and writable. The interface is a structured view of the database itself — organized by page > section > concern (content, style, layout).

## Proposed Solution

### Three-Layer Mobile Architecture

#### Layer 1: Page Bar (pinned top, always visible)
- Current page name as a prominent heading — you always know where you are
- Horizontal scroll pills for page switching (extends existing mobile-pills)
- Page-level indicators: accent color dot, section count, visibility status
- **44px touch target**, monospace, uppercase — consistent with existing admin tokens

#### Layer 2: Section Compartments (scrollable body)
**First compartment: GLOBAL (always present, every page)**
A pinned `GLOBAL` compartment at the top of every page's compartment list. Contains:
- Feature flags with visual match (toggle = instant effect on live site via Convex). WIP BANNER, PIXEL ENGINE, ASCII DONUT, PARALLAX, TERMINAL MATRIX, VIEW TRANSITIONS, ELEVATOR, OS DESKTOP, SOCIAL LINKS, COMMAND PALETTE — each with a self-documenting name and ON/OFF toggle.
- Site mode (multi-page / one-page / reader / disabled)
- Nav mode, parallax speed, hero visual

These are the OS-level registers — global modifiers that affect the entire portfolio across all pages.

**Remaining compartments: one per section on current page**
Each section renders as a **collapsible compartment** — like a Things project heading.

**Collapsed state** (single row):
- Section type icon + label (from registry)
- Status indicators: visibility dot, entry count badge, accent color dot
- Chevron for expand/collapse
- CSS divider line between compartments (1px solid border-color-subtle)

**Expanded state** reveals **tabbed bookmarks** (like iA Writer's focus modes):

| Bookmark | Controls | Source |
|----------|----------|--------|
| **CONTENT** | Inline CRUD for section's dataTable entries. Create, edit fields, delete, toggle visibility, reorder. Auto-discovered from section-editors.ts registry. | EntryTable pattern |
| **STYLE** | Typography (size, weight, tracking, leading, wrap), accent color, animation toggles, theme overrides | TypographyControls, ColorStrip, AdminToggle |
| **LAYOUT** | Section ordering, spacing presets (none/sm/md/lg/xl), box model diagram, visibility toggle, direction | InlineSectionConfig, BoxModelDiagram |

**Accordion behavior:** Only one compartment open at a time. Opening one collapses the previous. This prevents scroll overwhelm on a 414px screen.

**Bookmark tab bar:** Horizontal pills within expanded compartment — `CONTENT | STYLE | LAYOUT` — using existing AdminChipGroup primitive with exclusive mode.

#### Layer 3: Preview Drawer (pull-up from bottom)
- Persistent bottom handle bar: thin 36px-wide grab handle centered
- Pull up to reveal live site preview (iframe to actual site URL, Convex-synced)
- Max height 70vh — leaves page bar visible for context
- Swipe down to dismiss
- Uses existing BottomSheet primitive pattern (16px top radius, 120ms slide animation)
- Not always visible — summoned on demand to check work

### Content Bookmark — The Core Innovation

The Content bookmark is the heart of the mobile kernel. For each section type, it auto-renders the appropriate editor:

| Section Type | Content Editor | Fields |
|---|---|---|
| **hero** | HeroCaseStudyAdmin (existing) + cvProfile fields (NEW) | name, taglines, bio, case studies |
| **works-grid** | WorksAdmin (existing, compacted) | title, url, category, year, tools, preview |
| **blog-feed** | BlogAdmin (existing, compacted) | title, slug, excerpt, tags, publishedAt |
| **cv** | CvAdmin (existing, compacted) | entries by type, profile, languages, sections |
| **timeline** | TalksAdmin (existing, compacted) | title, type, year, links, category |
| **gallery** | GalleryAdmin (existing, compacted) | title, thumbnail, category, year |
| **academia** | AcademiaAdmin (existing, compacted) | title, authors, venue, year, URLs |
| **likes** | LikesAdmin (existing, compacted) | categories with items arrays |
| **minor** | MinorAdmin (existing, compacted) | category, text, year, note |
| **labs** | LabsAdmin (existing, compacted) | title, status, description, tags |
| **gifts** | GiftsAdmin (existing, compacted) | title, manifesto, callToAction, email |

**"Compacted"** means: the existing admin components are rendered inside the bookmark panel rather than a separate page. They already use EntryTable + inline editing patterns. The key change is embedding them in the compartment accordion rather than displaying them as standalone views.

### Style Bookmark — All Visual Modifiers

Every CSS-affecting parameter surfaced as a control:

**Typography group** (divider line above):
- Font Size — AdminSlider (range per section type)
- Font Weight — AdminChipGroup (100-900 in steps)
- Letter Spacing — AdminSlider (-0.1 to 0.3em)
- Line Height — AdminSlider (0.8 to 2.5)
- Text Wrap — AdminChipGroup (wrap | nowrap | balance | pretty)

**Color group** (divider line above):
- Accent Color — ColorStrip or inline picker (20px swatch)
- Theme Override — AdminChipGroup (inherit | custom)

**Animation group** (divider line above, hero only):
- ASCII Donut — AdminToggle
- ASCII Wave — AdminToggle
- Pixel Art — AdminToggle
- Velocity — AdminToggle
- Particles — AdminChipGroup (none | electrons | wanderers | cards)

### Layout Bookmark — Structural Controls

**Visibility** (divider line above):
- Section Visible — AdminToggle (green)

**Spacing** (divider line above):
- Spacing Before — AdminChipGroup presets (none | sm | md | lg | xl) + AdminSlider for custom
- Spacing After — same pattern
- Box Model Diagram — existing BoxModelDiagram for precise padding/margin

**Section Order** (divider line above):
- Position in page — move up/down buttons
- Remove section — delete with confirmation

### CSS Organization — Strict Dividers

Every control group is separated by a `1px solid var(--border-color-subtle)` horizontal divider with `var(--admin-space-3, 12px)` padding above and below. Groups are labeled with `.admin-label--2xs` (7px, uppercase, monospace, subtle color). This creates the strict categorical organization — you always know which group a control belongs to.

**Compartment dividers:** `1px solid var(--border-color-subtle)` between each collapsed section heading.

**Bookmark content dividers:** Each control group within a bookmark is visually separated. No floating controls. Everything belongs to a labeled group.

## Impact & Benefits

- **Mobile-first**: Full portfolio management from a phone — conference-ready
- **Batteries-included**: Every content type, every config parameter, every visual modifier accessible
- **Real-time**: Convex subscriptions make every change instant across all pages
- **Organized**: iA Writer clarity — strict visual hierarchy with CSS dividers and labeled groups
- **Minimal maintenance**: Leverages existing admin primitives (AdminSlider, AdminToggle, AdminChipGroup, EntryTable, BottomSheet, BoxModelDiagram) — ~80% of controls already built
- **Discoverable**: Section compartment > bookmark tab > labeled group > control — four-level hierarchy that's always navigable

## Dependencies

- Existing admin primitives (AdminToggle, AdminSlider, AdminChipGroup, BottomSheet, etc.)
- Existing section-editors.ts registry for auto-discovery of content editors
- Existing Convex mutations for all 12 content types (all have full CRUD)
- Existing admin token system (--admin-space-*, --admin-text-*, --admin-blue, --admin-green)
- `overhaul-admin-ux` change (Home card, flags pagination, change tracking) — complementary, not blocking

## Alternatives Considered

1. **Split-pane flip (preview toggle)** — Rejected: creates two modes, breaks flow. You're either editing or previewing, never both conceptually.
2. **Card-per-section dashboard with inline previews** — Rejected: too heavy on mobile. Rendering each section component in compact mode is complex and adds rendering cost.
3. **Separate mobile app** — Rejected: unnecessary complexity. The web admin with proper responsive design is sufficient.

## Success Criteria

- [ ] All 12 content types are fully editable (CRUD) from a 414px viewport
- [ ] Every heroConfig field (11 fields) is accessible from the hero compartment's Style bookmark
- [ ] Every section's typography, spacing, and visibility controls are accessible from their compartment
- [ ] Page switching is instant and the current page is always visible in the page bar
- [ ] Preview drawer shows live site that updates in real-time via Convex when controls change
- [ ] Compartment accordion behavior: only one section expanded at a time
- [ ] All control groups separated by CSS divider lines with labeled headings
- [ ] All touch targets meet 44px minimum
- [ ] Transitions use consistent 120ms ease timing
- [ ] Zero new Convex tables or mutations required — all existing infrastructure reused
