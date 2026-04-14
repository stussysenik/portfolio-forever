---
created: 2026-04-11
category: plan
tags: [admin, content-hub, convex]
---

# Portfolio Data-Driven Overhaul

## Overview
Make the entire portfolio data-driven and editable from /admin — remove hardcoded sections, fix broken blog, add ASCII art toggles, generalize typography controls, and render CV from Convex data.

## Problem Statement
The portfolio has several gaps preventing full admin-driven content management:
1. **Hardcoded content** — Hero case studies ("Attendu", "Claude Code Elixir") are hardcoded in HeroSection.svelte
2. **Dead CMS code** — Sanity CMS client files remain despite full Convex migration
3. **Static CV** — CvSection embeds PDF instead of rendering from Convex
4. **Hero-only typography** — Controls only work for hero section
5. **Missing ASCII art** — AsciiDonut exists but isn't rendered
6. **Navigation hardcoded** — Header name comes from static import

## Phases
- **Phase 1**: Labs Cleanup
- **Phase 2**: Fix Blog + Remove Sanity
- **Phase 3**: Hero ASCII Art
- **Phase 4**: Generalized Typography Controls
- **Phase 5**: Data-Driven Content
- **Phase 6**: Admin Completeness