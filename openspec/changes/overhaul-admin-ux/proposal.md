# Proposal: Overhaul Admin UX

## Overview
Refine the admin UI across 8 interconnected areas: Home's special sidebar status, breakpoint controls, top bar overflow, flags organization, component consistency, change tracking, reset-to-defaults, and history navigation.

## Problem Statement
The admin UI has grown organically and exhibits:
1. **Home page parity** — Home has no special treatment despite being the root page; it's draggable and looks identical to other pages
2. **Breakpoint limitations** — 6 hardcoded presets with no custom input, no orientation toggle, no dimension display
3. **Top bar overflow** — Theme/font dropdowns crowd the top bar on screens <1024px
4. **Flags sprawl** — 10 flags in a flat 2-column grid take too much space with no categorization
5. **Inconsistent components** — Chip groups use mixed border-radius (pills, rounds, rectangles) across different controls
6. **No change awareness** — Admin has no visibility into when config values were last modified or by whom
7. **No reset capability** — Modified values cannot be quickly reverted to defaults
8. **No change history** — No way to see what changed, when, or restore previous values

## Proposed Solution
A cohesive admin UX pass that addresses all 8 concerns, validated through pixel-perfect visual mockups.

### 1. Home Card Header
Pinned mini card at top of sidebar with house icon, route, and "root page" subtitle. Cannot be dragged.

### 2. Breakpoint Bar Redesign
3 quick presets (390, 768, 1440) + custom px input + H/V orientation icons + always-visible W×H dimensions + dashed viewport borders.

### 3. Top Bar Priority Collapse
Progressive disclosure: theme/font collapse behind "..." overflow chip on narrow screens. Gear + config toggle always visible.

### 4. Flags Paginated Categories
Flags grouped into Visual/Layout/System with step bar navigation, arrow nav, and page dots.

### 5. Component Standardization
All chip groups become 2px-radius rectangles using `AdminChipGroup` primitive consistently.

### 6. Change Tracking
Per-control "last changed" badge (blue) or "default" badge (green). Stored as `lastModified` timestamps in Convex.

### 7. Reset to Defaults
Dashed `↺ reset` button per control, visible only when value differs from default.

### 8. History Popover
Click timestamp badge to see last 5 changes with `oldValue → newValue` and restore buttons. New `adminHistory` Convex table.

## Impact & Benefits
- **Efficiency**: Faster admin workflows with better organized controls
- **Awareness**: Change tracking prevents "who changed what?" confusion
- **Confidence**: Reset + history enable fearless experimentation
- **Consistency**: Unified chip components reduce cognitive load
- **Responsive**: Priority collapse makes admin usable on tablets

## Risks
- History table can grow unbounded — will need TTL or max-rows pruning
- Step nav for flags adds navigation complexity — mitigated by persistent step bar
- Breaking test selectors if chip markup changes — need test audit pass
