# Project Context

## Purpose
Staff-level creative technologist portfolio showcasing design, engineering, and art work. Targets senior positions at studios like Pentagram, Apple, baek+baek. The medium is the message — the portfolio itself demonstrates craft.

## Tech Stack
- Astro 6 with @astrojs/node, @astrojs/svelte, React islands, and Vite 7
- Svelte 5 for interactive islands (Unified SPA shell)
- Convex for live runtime state and Sanity for editorial content / preview
- Pure CSS with custom properties (OKLCH color space)
- Phosphor Icons for UI signaling
- Bun for package management

## Project Conventions

### Code Style
- Semantic font weights: Normal (450), Medium (550), Semibold (600), Bold (800)
- OKLCH color space for perceptual uniformity
- "Inner POV" admin aesthetics: industrial minimalist, high-contrast

### Architecture Patterns
- **Unified SPA**: The homepage (`index.astro` -> `OnePageView.svelte`) is a complete SPA containing all portfolio sections.
- **Mobile-Native Navigation**: Bottom-docked `MobileDock` for app-like ergonomics on small screens.
- **Fluid Layout**: Sidebar and main area scale fluidly using `clamp()` and `vw` units.
- **Live Sidecar**: Convex handles real-time flags and system history, mirroring the public site's logic.

### Navigation Architecture
- **Desktop**: Persistent fixed sidebar with hierarchical grouping.
- **Mobile**: Fixed bottom dock with primary actions + full-screen overlay for all sections.
- **Scroll Logic**: Unified intersection observer for active section tracking and navigation history sync.

## Domain Context
- 16 sections/routes: hero, works, talks, terminal, cv, re:mix, blog, process, gallery, labs, os, media, likes, minor, gifts.
- All works enabled for live-embedded preview where possible.
- Minimap scroll indicator with "HIRE ME" CTA for deep-scroll orientation.

## Important Constraints
- Astro is the authoritative host.
- Zero-drift preview: Admin iframes render the actual public shell.
- Ergonomics first: No edge-touching elements on wide screens; easy thumb reach on mobile.
