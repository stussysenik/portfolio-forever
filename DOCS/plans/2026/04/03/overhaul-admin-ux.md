---
created: 2026-04-11
category: plan
tags: [admin, ux, ui]
---

# Overhaul Admin UX

## Overview
Refine the admin UI across 8 interconnected areas: Home's special sidebar status, breakpoint controls, top bar overflow, flags organization, component consistency, change tracking, reset-to-defaults, and history navigation.

## 8 Areas to Address
1. **Home Card Header** — Pinned mini card at top of sidebar with house icon, route, "root page" subtitle. Not draggable.
2. **Breakpoint Bar Redesign** — 3 quick presets (390, 768, 1440) + custom px input + H/V orientation icons + W×H dimensions + dashed viewport borders
3. **Top Bar Priority Collapse** — Theme/font collapse behind "..." overflow chip on narrow screens
4. **Flags Paginated Categories** — Flags grouped into Visual/Layout/System with step bar navigation
5. **Component Standardization** — All chip groups become 2px-radius rectangles
6. **Change Tracking** — Per-control "last changed" badge or "default" badge
7. **Reset to Defaults** — Dashed ↺ reset button per control, visible only when value differs
8. **History Popover** — See last 5 changes with oldValue → newValue and restore buttons