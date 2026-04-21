# Proposal: Data-Driven Portfolio Overhaul

## Overview
Make the entire portfolio data-driven and editable from /admin — remove hardcoded sections, fix broken blog, add ASCII art toggles, generalize typography controls, and render CV from Convex data.

> Note: `astro-full-migration-foundation` supersedes Phase 2's "Remove Sanity" direction. Sanity is now reintroduced as the editorial archive while Convex stays responsible for live composition and runtime state.

## Problem Statement
The portfolio has several gaps preventing full admin-driven content management:
1. **Hardcoded content** — Hero case studies ("Attendu", "Claude Code Elixir") are hardcoded in HeroSection.svelte, not editable from admin
2. **Dead CMS code** — Sanity CMS client files remain in codebase despite full Convex migration; blog shows no content because `blogPosts` table is empty
3. **Static CV** — CvSection embeds a PDF instead of rendering structured data from Convex (cvEntries, cvProfile, cvLanguages tables already exist)
4. **Hero-only typography** — Typography controls (size, weight, tracking, leading) only work for the hero section, not globally
5. **Missing ASCII art** — AsciiDonut component exists but isn't rendered; no wave ASCII animation
6. **Labs noise** — Legend and Browser Requirements sections add visual clutter without adding value
7. **Navigation hardcoded** — Header name comes from static import, not Convex profile data

## Proposed Solution

### Phase 1: Labs Cleanup
Remove the LEGEND (WebGPU/WebGL2/WASM icons) and BROWSER REQUIREMENTS (Chrome 113+/Edge/Firefox/Safari) sections from LabsSection.svelte. Purely subtractive — these were never admin-controlled.

### Phase 2: Fix Blog + Remove Sanity
Seed sample blog posts into Convex `blogPosts` table so `/blog` shows content. Delete dead Sanity code and dependency.

### Phase 3: Hero ASCII Art
Render existing AsciiDonut in hero, create new AsciiWave component (sine-wave ASCII animation), make both toggleable via admin using `heroConfig.showAsciiDonut` and new `showAsciiWave` field.

### Phase 4: Generalized Typography Controls
Extract hero typography controls into reusable `TypographyControls.svelte`. Make available for ALL section types via `pages.sections[].config.typography`. Standardize font size and line height scales.

### Phase 5: Data-Driven Content
- Create `heroCaseStudies` Convex table with CRUD, seed existing case studies, render from Convex in HeroSection
- Subscribe to `cvProfile.name` in layout for dynamic nav name
- Rewrite CvSection to render structured CV from Convex data instead of PDF embed
- Create HeroCaseStudyAdmin.svelte for admin editing

### Phase 6: Admin Completeness
Wire all new tables into admin subscriptions, ensure every page shows editable content, verify complete coverage.

## Impact & Benefits
- **Full admin control**: Every piece of content on every page is editable from /admin
- **Live updates**: Changes in admin reflect instantly on the live site via Convex subscriptions
- **Clean codebase**: Dead Sanity code removed, hardcoded content eliminated
- **Creative features**: ASCII art animations add personality, controllable from admin
- **Typography consistency**: Standardized scales and per-section controls

## Risks
- Schema changes require `npx convex dev` push — coordinated deploy needed
- CV HTML rendering may not match PDF formatting exactly — keep PDF download as fallback
- Blog seed posts are placeholders — user should edit with real content via admin
- `heroCaseStudies` table adds a new data entity to maintain

## Non-Goals
- Process section data-driven conversion (future phase)
- Terminal section content editing (already interactive)
- Theme color editing from admin (existing functionality)
- Responsive layout changes to admin shell
