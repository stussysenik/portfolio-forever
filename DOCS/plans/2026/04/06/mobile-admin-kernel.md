---
created: 2026-04-11
category: plan
tags: [admin, mobile-first, portfolio-os]
---

# Mobile Admin Kernel — Portfolio OS

## Overview
Transform `/admin` into a mobile-first Portfolio OS kernel — iA Writer + Things-inspired interface where every database parameter is accessible from phone.

## Problem
1. No content editing on mobile — preview pane only visible >=1024px
2. No live preview on mobile
3. Scattered controls — typography, content, layout split across components
4. Not batteries-included — can't create entries from phone

## Three-Layer Architecture

### Layer 1: Page Bar (pinned top)
- Current page name as heading
- Horizontal scroll pills for page switching
- Page-level indicators: accent color dot, section count, visibility

### Layer 2: Section Compartments (scrollable body)
**GLOBAL compartment** (always present):
- Feature flags (WIP BANNER, PIXEL ENGINE, ASCII DONUT, etc.)
- Site mode, nav mode, parallax speed, hero visual

**Per-section compartments** (collapsible):
- CONTENT bookmark — inline CRUD for entries
- STYLE bookmark — typography, accent color, animation
- LAYOUT bookmark — ordering, spacing, visibility

### Layer 3: Preview Drawer (pull-up from bottom)
- Pull up to reveal live site preview (iframe)
- Max 70vh height
- Swipe down to dismiss

## CSS Organization
- Every control group separated by 1px divider
- Labeled with `.admin-label--2xs` (7px, uppercase, monospace)
- Strict categorical organization