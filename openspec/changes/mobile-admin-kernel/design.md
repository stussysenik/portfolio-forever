# Design: Mobile Admin Kernel — Portfolio OS

## Architecture Overview

This change restructures the **Presentation Layer** only. No new Convex tables, no new mutations, no schema changes. The existing data layer already supports every operation needed — the gap is purely in how controls are organized and surfaced on mobile.

```
┌─────────────────────────────────────────────────────────┐
│ Presentation Layer (Svelte) — CHANGED                   │
│                                                         │
│  AdminShell.svelte                                      │
│  ├── PageBar (refactored from mobile-pills)             │
│  ├── SectionCompartmentList (NEW — replaces flat list)   │
│  │   ├── SectionCompartment (NEW — accordion item)       │
│  │   │   ├── BookmarkTabs (NEW — CONTENT|STYLE|LAYOUT)   │
│  │   │   ├── ContentBookmark (NEW — embeds existing     │
│  │   │   │   admin components per section type)          │
│  │   │   ├── StyleBookmark (NEW — groups typography,     │
│  │   │   │   color, animation controls)                  │
│  │   │   └── LayoutBookmark (NEW — spacing, visibility,  │
│  │   │       ordering, box model)                        │
│  │   └── ... (one per section on current page)           │
│  └── PreviewDrawer (NEW — BottomSheet + iframe)          │
│                                                         │
│  Reused Primitives (UNCHANGED):                         │
│  AdminToggle, AdminSlider, AdminChipGroup,              │
│  BottomSheet, BoxModelDiagram, EntryTable,              │
│  ColorStrip, TypographyControls                         │
├─────────────────────────────────────────────────────────┤
│ State Layer — MINIMAL CHANGES                           │
│  Local: expandedSection, activeBookmark, previewOpen     │
│  Context: unchanged (client, api)                       │
├─────────────────────────────────────────────────────────┤
│ Data Layer (Convex) — UNCHANGED                         │
│  All 12 content types already have full CRUD mutations   │
│  heroConfig has upsert mutation                          │
│  pages has section config/spacing/theme mutations        │
│  section-editors.ts has complete mutation registry        │
└─────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
AdminShell.svelte (grid layout)
│
├── [mobile < 768px]
│   ├── TopBar (44px, existing)
│   ├── PageBar (refactored mobile-pills)
│   │   └── page pills with heading treatment
│   ├── SectionCompartmentList
│   │   ├── SectionCompartment[0] (hero)
│   │   │   ├── collapsed: icon + "HERO" + badges
│   │   │   └── expanded:
│   │   │       ├── BookmarkTabs: CONTENT | STYLE | LAYOUT
│   │   │       ├── [CONTENT]: HeroCaseStudyAdmin + cvProfile fields
│   │   │       ├── [STYLE]: TypographyControls + animation toggles
│   │   │       └── [LAYOUT]: spacing presets + box model + visibility
│   │   ├── SectionCompartment[1] (works-grid)
│   │   │   ├── collapsed: icon + "WORKS GRID" + "12 entries" badge
│   │   │   └── expanded:
│   │   │       ├── BookmarkTabs: CONTENT | STYLE | LAYOUT
│   │   │       ├── [CONTENT]: WorksAdmin (compacted)
│   │   │       ├── [STYLE]: TypographyControls + accent
│   │   │       └── [LAYOUT]: spacing + view mode + visibility
│   │   └── ...
│   └── PreviewDrawer (BottomSheet, pull-up)
│
├── [tablet 768-1023px]
│   ├── TopBar (spans full width)
│   ├── Sidebar (PageSidebar, 220px)
│   └── Builder (SectionCompartmentList)
│
└── [desktop >= 1024px]
    ├── TopBar (spans full width)
    ├── Sidebar (PageSidebar, 220px)
    ├── Builder (SectionCompartmentList)
    └── Preview (live iframe, existing)
```

## Control Hierarchy — The Russian Doll

Controls live at three nesting levels. The admin must make this hierarchy explicit:

```
GLOBAL (siteConfig + featureFlags)          ← affects ALL pages
  └── PAGE (themeOverrides + meta)          ← affects one page
       └── SECTION (config + typography)    ← affects one section
            └── ENTRY (fields)              ← affects one item
```

### Where each level lives in the admin:

**Global controls** — A dedicated `GLOBAL` compartment pinned at the top of every page's compartment list. Contains:
- Feature flags with visual match indicators (see below)
- Site mode (one-page / multi-page / reader / disabled)
- Nav mode, parallax speed, hero visual
- These affect everything. They're always accessible regardless of which page you're on.

**Page controls** — In the PageBar area. Accent color, page visibility, meta (title, description, ogImage). These are the page's own settings.

**Section controls** — Inside each section compartment's STYLE and LAYOUT bookmarks.

**Entry controls** — Inside each section compartment's CONTENT bookmark.

### Feature Flags — Visual Match

Feature flags must show what they control visually. Current flags and their visual effect:

```
┌──────────────────────────────────────┐
│ ─── GLOBAL ──────────────────── ▲   │
│                                      │
│ ─── FEATURE FLAGS ─────────────────  │
│                                      │
│  ● WIP BANNER         [====]  ON    │  ← "WEBSITE IS UNDER MAINTENANCE"
│  ○ PIXEL ENGINE        [    ]  OFF   │  ← particle animations
│  ○ ASCII DONUT         [    ]  OFF   │  ← spinning ASCII art
│  ● PARALLAX            [====]  ON    │  ← scroll parallax effect
│  ○ TERMINAL MATRIX     [    ]  OFF   │  ← matrix rain background
│  ● VIEW TRANSITIONS    [====]  ON    │  ← page transition animations
│  ○ ELEVATOR            [    ]  OFF   │  ← elevator scroll effect
│  ● OS DESKTOP          [====]  ON    │  ← OS-style window chrome
│  ○ SOCIAL LINKS        [    ]  OFF   │  ← social link bar
│  ● COMMAND PALETTE     [====]  ON    │  ← cmd+k palette
│                                      │
│ ─── SITE MODE ─────────────────────  │
│  [MULTI-PAGE] [ONE-PAGE] [READER]    │
│                                      │
│ ─── NAVIGATION ────────────────────  │
│  NAV MODE   [PILLS] [TABS] [MINIMAL]│
│  PARALLAX   ═══════●═══ 0.5         │
│                                      │
└──────────────────────────────────────┘
```

Each flag has: name (self-documenting), toggle, and ON/OFF state. The toggle IS the visual — green dot = active on your live site right now. You flip it, Convex syncs, the effect appears/disappears on your live portfolio instantly.

On `/main` (the live site), animations controlled by these flags toggle in real-time. The admin is the control room — flip a switch, see the effect.

## ASCII Mockups — Every Compartment State

### Full Mobile View (414px) — All Collapsed

```
┌──────────────────────────────────────┐  ← 414px
│ ☰  portfolio.senik.fyi    ⚙  Aa  ◯  │  44px topbar
├──────────────────────────────────────┤
│ [HOME] [WORKS] [CV] [BLOG] [RE:MIX] │  44px pagebar
├──────────────────────────────────────┤
│                                      │
│ ⚙ GLOBAL                    10  ▼   │  global compartment
│──────────────────────────────────────│
│ ◉ HERO                     ● 3  ▼   │  section compartment
│──────────────────────────────────────│
│ ▦ WORKS GRID                ● 12 ▼  │
│──────────────────────────────────────│
│ ¶ BLOG FEED                 ● 5  ▼  │
│──────────────────────────────────────│
│ ≡ TIMELINE                  ● 8  ▼  │
│──────────────────────────────────────│
│ ▣ GALLERY                   ● 20 ▼  │
│──────────────────────────────────────│
│                                      │
│            ──────────                │  preview handle
└──────────────────────────────────────┘
```

### Hero Expanded — CONTENT Bookmark

```
┌──────────────────────────────────────┐
│ ☰  portfolio.senik.fyi    ⚙  Aa  ◯  │
├──────────────────────────────────────┤
│ [HOME] [WORKS] [CV] [BLOG] [RE:MIX] │
├──────────────────────────────────────┤
│ ⚙ GLOBAL                    10  ▼   │
│──────────────────────────────────────│
│ ◉ HERO                     ● 3  ▲   │  ← expanded
│                                      │
│  [CONTENT]  STYLE   LAYOUT          │  ← bookmark tabs
│                                      │
│ ─── PROFILE ─────────────────────── │
│                                      │
│  NAME                                │
│  ┌──────────────────────────────┐    │
│  │ Mengxuan "Senik" Zou         │    │
│  └──────────────────────────────┘    │
│                                      │
│  TAGLINE                             │
│  ┌──────────────────────────────┐    │
│  │ Engineer building things     │    │
│  └──────────────────────────────┘    │
│                                      │
│  BIO                                 │
│  ┌──────────────────────────────┐    │
│  │ Staff engineer focused on    │    │
│  │ design systems and...        │    │
│  └──────────────────────────────┘    │
│                                      │
│  LOCATION                            │
│  ┌──────────────────────────────┐    │
│  │ Prague, CZ                   │    │
│  └──────────────────────────────┘    │
│                                      │
│ ─── CASE STUDIES ────────────────── │
│                                      │
│  [+ ADD]                             │
│                                      │
│  ┌────────────────────────── ● ─┐   │
│  │ Portfolio Redesign            │   │
│  │ ROLE: Lead  SHIP: 2wk        │   │
│  │ PROBLEM: Slow load times     │   │
│  │ RESULT: 65% faster           │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌────────────────────────── ○ ─┐   │
│  │ Data Migration                │   │
│  │ ROLE: Solo  SHIP: 1mo        │   │
│  └──────────────────────────────┘   │
│                                      │
│──────────────────────────────────────│
│ ▦ WORKS GRID                ● 12 ▼  │  ← collapsed
│──────────────────────────────────────│
│            ──────────                │
└──────────────────────────────────────┘
```

### Hero Expanded — STYLE Bookmark

```
┌──────────────────────────────────────┐
│ ◉ HERO                     ● 3  ▲   │
│                                      │
│   CONTENT  [STYLE]  LAYOUT          │
│                                      │
│ ─── TYPOGRAPHY ──────────────────── │
│                                      │
│  SIZE      ═══●══════════  3.5rem   │
│  WEIGHT    [100][400][700][900]      │
│  TRACKING  ═●════════════  0.00em   │
│  LEADING   ════●═════════  1.20     │
│  WRAP      [WRAP][NOWRAP][BALANCE]   │
│                                      │
│ ─── COLOR ───────────────────────── │
│                                      │
│  ACCENT    ■ ■ ■ ■ ■ [#2563EB]     │
│                                      │
│ ─── ANIMATION ───────────────────── │
│                                      │
│  ASCII DONUT       [====]  ON       │
│  ASCII WAVE        [    ]  OFF      │
│  PIXEL ART         [    ]  OFF      │
│  VELOCITY          [    ]  OFF      │
│                                      │
│ ─── PARTICLES ───────────────────── │
│                                      │
│  [NONE] [ELECTRONS] [WANDERERS]     │
│                                      │
└──────────────────────────────────────┘
```

### Hero Expanded — LAYOUT Bookmark

```
┌──────────────────────────────────────┐
│ ◉ HERO                     ● 3  ▲   │
│                                      │
│   CONTENT   STYLE  [LAYOUT]         │
│                                      │
│ ─── VISIBILITY ──────────────────── │
│                                      │
│  VISIBLE           [====]  ON       │
│                                      │
│ ─── SPACING ─────────────────────── │
│                                      │
│  BEFORE  [NONE][SM][MD][LG][XL]     │
│  AFTER   [NONE][SM][MD][LG][XL]     │
│                                      │
│  ┌─── margin ──────────────────┐    │
│  │         16                   │    │
│  │  ┌─── padding ──────────┐   │    │
│  │  │        12             │   │    │
│  │ 0│  0 ┌─ content ─┐ 0   │0  │    │
│  │  │    └────────────┘     │   │    │
│  │  │        12             │   │    │
│  │  └──────────────────────┘   │    │
│  │         16                   │    │
│  └──────────────────────────────┘   │
│                                      │
│ ─── POSITION ────────────────────── │
│                                      │
│  [▲ MOVE UP]  [▼ MOVE DOWN]        │
│  [✕ REMOVE SECTION]                 │
│                                      │
└──────────────────────────────────────┘
```

### Works Grid Expanded — CONTENT Bookmark

```
┌──────────────────────────────────────┐
│ ▦ WORKS GRID                ● 12 ▲  │
│                                      │
│  [CONTENT]  STYLE   LAYOUT          │
│                                      │
│ ─── ENTRIES ─────────────────────── │
│                                      │
│  [+ ADD WORK]                        │
│                                      │
│  TITLE             CAT    YEAR      │
│ ─────────────────────────────────── │
│  ● Portfolio OS     web    2025     │
│ ─────────────────────────────────── │
│  ● CLI Dashboard    cli    2024     │
│ ─────────────────────────────────── │
│  ○ Old Project      misc   2023     │  ← hidden (dim)
│ ─────────────────────────────────── │
│  ● Shader Lab       gpu    2024     │
│ ─────────────────────────────────── │
│  ... (scrollable)                    │
│                                      │
└──────────────────────────────────────┘
```

### Global Compartment Expanded

```
┌──────────────────────────────────────┐
│ ⚙ GLOBAL                        ▲   │
│                                      │
│ ─── FEATURE FLAGS ────────── 7/10 ─ │
│                                      │
│  ● WIP BANNER         [====]  ON    │
│  ○ PIXEL ENGINE        [    ]  OFF   │
│  ○ ASCII DONUT         [    ]  OFF   │
│  ● PARALLAX            [====]  ON    │
│  ○ TERMINAL MATRIX     [    ]  OFF   │
│  ● VIEW TRANSITIONS    [====]  ON    │
│  ○ ELEVATOR            [    ]  OFF   │
│  ● OS DESKTOP          [====]  ON    │
│  ○ SOCIAL LINKS        [    ]  OFF   │
│  ● COMMAND PALETTE     [====]  ON    │
│                                      │
│ ─── SITE MODE ─────────────────────  │
│                                      │
│  [MULTI-PAGE]  ONE-PAGE   READER     │
│                                      │
│ ─── NAVIGATION ────────────────────  │
│                                      │
│  NAV MODE  [PILLS]  TABS   MINIMAL  │
│  PARALLAX  ═══════●════════  0.5    │
│  HERO VIS  [DEFAULT] [ALT]          │
│                                      │
└──────────────────────────────────────┘
```

### Preview Drawer Open (overlays compartments)

```
┌──────────────────────────────────────┐
│ ☰  portfolio.senik.fyi    ⚙  Aa  ◯  │  ← still visible
├──────────────────────────────────────┤
│ [HOME] [WORKS] [CV] [BLOG] [RE:MIX] │  ← still visible
├━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┤
│  ╭──────────╮                        │
│  │  ──────  │  ← grab handle        │
│  ╰──────────╯                        │
│  PREVIEW                      DONE  │
├──────────────────────────────────────┤
│ ┌──────────────────────────────────┐ │
│ │                                  │ │
│ │   ┌─────────────────────────┐    │ │
│ │   │  MENGXUAN "SENIK" ZOU   │    │ │
│ │   │                         │    │ │
│ │   │  Engineer building...   │    │ │
│ │   │                         │    │ │
│ │   │  ┌─ Portfolio ─┐        │    │ │
│ │   │  │ 65% faster  │        │    │ │
│ │   │  └─────────────┘        │    │ │
│ │   │                         │    │ │
│ │   └─────────────────────────┘    │ │
│ │          (live iframe)           │ │
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

## Key Design Decisions

### 1. Compartment = Section, Not Page

Each section within a page gets its own compartment. This maps 1:1 to the `pages[].sections[]` array in Convex. When you're on the Home page which has `[hero, works-grid, blog-feed]`, you see three compartments.

**Why not per-page?** Because different sections have different controls. A hero section has typography and ASCII toggles. A works-grid has view mode and entry CRUD. Collapsing by section gives you the right controls at the right level.

### 2. Three Bookmarks, Not More

CONTENT, STYLE, LAYOUT map cleanly to the three concerns of any section:
- **What it says** (CONTENT) — data entries, text fields
- **How it looks** (STYLE) — typography, color, animation
- **Where it sits** (LAYOUT) — spacing, ordering, visibility

This is exhaustive. Every admin control fits into one of these three. No fourth tab needed.

### 3. Existing Components Embedded, Not Rewritten

The existing admin components (WorksAdmin, BlogAdmin, CvAdmin, etc.) are already well-built with inline editing, visibility toggles, reorder, and CRUD. Rather than rebuilding them, the Content bookmark simply renders the appropriate component inside the compartment panel.

The "compacting" required:
- Remove standalone headers (the compartment provides context)
- Constrain max-width to panel width
- Ensure touch targets are >=44px (most already comply)

### 4. Preview as Drawer, Not Mode

The preview is a BottomSheet that slides up on demand. It doesn't replace the editing interface — it overlays it temporarily.

**Implementation:** An `<iframe>` pointing to the site's origin (`window.location.origin`, which resolves to `http://localhost:5173` in dev and the production domain in prod). Because all data flows through Convex real-time subscriptions, the iframe automatically reflects any change made in the admin controls above.

**Why iframe, not component render?** The site uses its own layout, CSS, and routing. Rendering it as a component inside the admin would require deduplicating all styles and handling routing conflicts. An iframe is a clean boundary.

### 5. Strict CSS Dividers — The Category System

Visual organization follows a rigid pattern:

```
┌─────────────────────────────────┐
│ SECTION COMPARTMENT HEADER      │  ← 1px bottom border
├─────────────────────────────────┤
│ [CONTENT] [STYLE] [LAYOUT]     │  ← bookmark tab bar
├─────────────────────────────────┤
│                                 │
│ ─── GROUP LABEL ──────────────  │  ← .admin-label--2xs + 1px top border
│   Control 1                     │
│   Control 2                     │
│                                 │
│ ─── GROUP LABEL ──────────────  │  ← .admin-label--2xs + 1px top border
│   Control 3                     │
│   Control 4                     │
│                                 │
│ ─── GROUP LABEL ──────────────  │  ← .admin-label--2xs + 1px top border
│   Control 5                     │
│                                 │
└─────────────────────────────────┘
│                                 │  ← 1px border between compartments
┌─────────────────────────────────┐
│ NEXT SECTION COMPARTMENT        │
└─────────────────────────────────┘
```

Every group has:
- A label: `.admin-label--2xs` (7px, monospace, uppercase, letter-spacing 0.08em, subtle color)
- A top border: `1px solid var(--border-color-subtle)`
- Padding: `var(--admin-space-3, 12px)` above and below

This is non-negotiable. No floating controls. No unlabeled groups. The dividers create the "built by things" structural clarity.

### 6. Auto-Discovery via section-editors.ts

The Content bookmark doesn't hardcode which component to render per section. It reads from the existing `sectionEditors` registry:

```typescript
// Existing registry pattern
const editor = sectionEditors[section.sectionType];
// editor.columns → what fields to show
// editor.mutations → CRUD endpoints
// editor.defaultConfig → fallback values
```

For section types with dedicated admin components (works-grid → WorksAdmin, cv → CvAdmin, etc.), the Content bookmark renders that component. For types without a dedicated component, it falls back to the generic EntryTable with the registry's column/mutation definitions.

## Responsive Behavior

### Mobile (< 768px) — Primary Target

```
┌────────────────────────┐
│ TopBar (44px)           │
├────────────────────────┤
│ HOME  WORKS  CV  BLOG  │ ← PageBar (horizontal scroll pills)
├────────────────────────┤
│ ◉ HERO    ● 3  ▼      │ ← compartment collapsed
├────────────────────────┤
│ ▦ WORKS GRID  ● 12  ▼ │ ← compartment collapsed
├────────────────────────┤
│ ¶ BLOG FEED   ● 5   ▼ │ ← compartment collapsed
├────────────────────────┤
│         ...             │
├────────────────────────┤
│ ──── grab handle ────  │ ← PreviewDrawer (collapsed)
└────────────────────────┘
```

Expanded compartment:

```
┌────────────────────────┐
│ TopBar                  │
├────────────────────────┤
│ HOME  WORKS  CV  BLOG  │
├────────────────────────┤
│ ◉ HERO    ● 3  ▲      │ ← expanded
│ CONTENT | STYLE | LAYOUT│
│ ─── PROFILE ─────────  │
│ Name: [Mengxuan...]     │
│ Tagline: [Engineer...]  │
│ Bio: [Building...]      │
│ ─── CASE STUDIES ─────  │
│ + Add                   │
│ ┌─ #1 Redesign ─ ●  ┐  │
│ │  Role: Lead        │  │
│ │  Ship: 2wk         │  │
│ └────────────────────┘  │
│ ┌─ #2 Migration ─ ●  ┐  │
│ │  Role: Solo        │  │
│ └────────────────────┘  │
├────────────────────────┤
│ ▦ WORKS GRID  ● 12  ▼ │ ← still collapsed
├────────────────────────┤
│ ──── grab handle ────  │
└────────────────────────┘
```

### Tablet (768-1023px)

Same compartment system in the builder area. Sidebar provides page navigation. No preview pane (use PreviewDrawer).

### Desktop (>= 1024px)

Compartment system in builder area. Sidebar for pages. Live preview pane on right (existing behavior preserved). PreviewDrawer not needed but still available.

## New Components

### SectionCompartment.svelte
**Props:** `section`, `pageId`, `sectionIndex`, `expanded`, `onToggle`
**Behavior:** Renders collapsed header or expanded body with bookmark tabs
**CSS:** `1px solid var(--border-color-subtle)` bottom border, `var(--admin-space-3)` padding

### BookmarkTabs.svelte
**Props:** `active` ('content' | 'style' | 'layout'), `onChange`
**Behavior:** Renders AdminChipGroup with three options in exclusive mode
**CSS:** Flush with compartment edges, `var(--admin-space-2)` vertical padding

### ContentBookmark.svelte
**Props:** `section`, `pageId`, `sectionIndex`
**Behavior:** Reads section-editors.ts registry, renders appropriate admin component or generic EntryTable
**CSS:** Groups separated by labeled dividers

### StyleBookmark.svelte
**Props:** `section`, `pageId`, `sectionIndex`, `heroConfig?`
**Behavior:** Renders typography controls, color controls, animation toggles based on section type
**CSS:** Groups: TYPOGRAPHY, COLOR, ANIMATION — each with divider + label

### LayoutBookmark.svelte
**Props:** `section`, `pageId`, `sectionIndex`
**Behavior:** Renders visibility toggle, spacing presets, box model, section ordering
**CSS:** Groups: VISIBILITY, SPACING, POSITION — each with divider + label

### PreviewDrawer.svelte
**Props:** `open`, `onClose`, `siteUrl`
**Behavior:** BottomSheet with iframe to live site. Grab handle to open/close.
**CSS:** Extends BottomSheet pattern. Max-height 70vh. iframe is 100% width/height.

### PageBar.svelte
**Props:** `pages`, `activePage`, `onSelect`
**Behavior:** Refactored from mobile-pills. Adds prominent current page heading.
**CSS:** Current page name as `.admin-label--sm` weight 700. Pills use existing `.pill` pattern.

## Performance Considerations

- **Accordion lazy rendering:** Only the expanded compartment renders its bookmark content. Collapsed compartments render only the header row. This keeps the DOM lightweight.
- **Iframe preview:** The iframe loads only when the PreviewDrawer is opened. It is not mounted when collapsed.
- **Existing Convex subscriptions:** Content admin components already manage their own subscriptions. No additional subscription overhead from embedding them in compartments.
- **Touch performance:** All transitions are 120ms ease on `transform` or `opacity` — GPU-compositable properties. No layout-triggering animations.

## Accessibility

- Compartment headers: `role="button"`, `aria-expanded`, keyboard Enter/Space to toggle
- Bookmark tabs: `role="tablist"` with `role="tab"` items, arrow key navigation
- Preview drawer: Focus trap when open, Escape to close
- All controls: existing admin primitives already meet 44px touch targets and include ARIA labels
- Divider labels: `aria-hidden="true"` (decorative, content is accessible via controls)

## Testing Strategy

- Visual regression: Screenshot tests at 414px (iPhone), 768px (iPad), 1024px (desktop)
- Interaction tests: Compartment expand/collapse, bookmark switching, preview drawer open/close
- Content editing: Verify CRUD operations work from within compartment (not just standalone views)
- Real-device testing: iPhone Safari, Android Chrome — touch targets, scroll behavior, bottom sheet gesture

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Existing admin components break when embedded in compartments | Components already accept props, not global state. Embedding is composition, not modification. |
| iframe preview has CORS issues | Same origin (localhost:5173 or production domain). No cross-origin. |
| Accordion scroll position jumps when compartments expand | Use `scrollIntoView({ behavior: 'smooth', block: 'nearest' })` on expand. |
| Content editors overflow compartment width | Add `max-width: 100%; overflow-x: hidden` to compartment body. Existing components use flex/grid that respects container. |
| EntryTable too wide for 414px | EntryTable already has responsive column hiding. Add horizontal scroll as fallback. |
