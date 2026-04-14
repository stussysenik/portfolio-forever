---
created: 2026-03-xx
updated: 2026-04-11
category: vision
tags: [philosophy, operating-system, portfolio]
---

# Vision

## The Portfolio as an Operating System

This is the personal portfolio of Stüssy Senik (Mengxuan Zou) — a staff-level creative technologist
whose work spans systems engineering, interaction design, and generative art. The portfolio is not a
static document. It is a living platform, and the medium is the message: every design decision, every
interactive layer, every real-time data binding is itself a demonstration of craft.

The target audience is small but specific: creative directors and hiring leads at studios like
Pentagram, Apple, and baek+baek. They are sophisticated enough to read the code behind the surface.
The portfolio should reward that reading.


## Composable, Page-First Architecture

The platform is inspired by Cargo.site's page-as-unit model. Each of the 16 routes is a first-class
citizen — composable, independently configurable, and fully controllable from the admin without a
deploy. Pages are not templates filled with content; they are compositions of typed sections, each
with its own view mode, visibility, animation preset, and data source.

Routes: /, /works, /talks, /likes, /blog, /gifts, /cv, /terminal, /process, /gallery, /labs, /os,
/minor, /scratchpad, and nested blog slugs. Eleven of these embed live project previews.


## Data-Driven via Convex

The backend is Convex — a reactive, real-time database where every mutation is instantly reflected in
the UI without a page reload. There is no build-time content pipeline. Every element that can be
admin-controlled is: section visibility, view mode, navigation order, accent colors, animation
presets, site-wide feature flags, and more. The admin is the source of truth; the frontend is a
projection of its state.

This is intentional. It means the portfolio can be reconfigured for a specific audience, for a
specific meeting, in under 30 seconds — without touching code.


## Themes and Visual Registers

Four layered themes give the portfolio a distinct visual register for different contexts:

- **minimal** — the default. Clean, high-contrast, editorial.
- **studio** — warmer, slightly textured, for creative presentations.
- **darkroom** — low-light, photography-first, for gallery and process work.
- **accessible** — WCAG AAA, maximum contrast, no decorative motion.

All themes use the OKLCH color space for perceptual uniformity across hue and lightness. Theme
switching is live, keyboard-accessible (T), and persisted.


## Rich Interaction Layer

Beyond static content, the portfolio contains:

- A terminal at /terminal with 30 commands and a virtual filesystem — the same interface used to
  build parts of the platform, now surfaced as navigable work.
- A Lua pixel engine for generative canvas effects — particles, electron fields, wanderer systems —
  composable per page from the admin.
- A command palette (/) with fuzzy search over routes, commands, and content.
- Fluid typography scaling from 320px to 3840px via CSS clamp() — tested at mobile, iPad, desktop,
  and 6K.
- Font switching across 5 typefaces (F), all loaded via Google Fonts with variable weight support.


## Design Audience

The primary user of the admin is Stüssy Senik. The system is designed for one power user who moves
fast, hates friction, and expects every control to do exactly what it says. Future collaborator
support is planned but not yet scoped. Every admin interaction saves immediately — no save buttons,
no confirmation dialogs for standard edits, no state drift between what's displayed and what's
stored.

The portfolio is never finished. It is always in a known, deployable state.
