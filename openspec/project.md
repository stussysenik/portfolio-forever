# Project Context

## Purpose
Staff-level creative technologist portfolio showcasing design, engineering, and art work. Targets senior positions at studios like Pentagram, Apple, baek+baek. The medium is the message — the portfolio itself demonstrates craft.

## Tech Stack
- SvelteKit 2.49.1 (Svelte 5) with Vite 7.2.6
- Static site generation via @sveltejs/adapter-static
- Pure CSS with custom properties (OKLCH color space)
- Playwright 1.57.0 for E2E testing
- @axe-core/playwright for accessibility scanning
- Sanity CMS for blog posts
- Package manager: Bun

## Project Conventions

### Code Style
- SRP, modular code with educational doc comments
- CSS custom properties for all design tokens
- OKLCH color space for perceptual uniformity
- 60/30/10 color rule across themes

### Architecture Patterns
- File-based routing (SvelteKit)
- Design tokens in src/lib/data/tokens.ts + CSS variables in src/app.css
- 4 themes: minimal (default), studio, darkroom, accessible
- 5 switchable typefaces via FontSwitcher
- Component library in src/lib/components/

### Testing Strategy
- Playwright for E2E, accessibility, visual regression, responsive testing
- 13 test projects configured (chromium, firefox, webkit, mobile, tablet, desktop, a11y, etc.)
- TestUtils class with reusable fixtures in tests/setup.ts
- Currently 8 test files, ~4,545 lines, with gaps in tablet/desktop/theme coverage

### Git Workflow
- Feature branches (feat/*, fix/*) off main
- User verifies on test branch before merge
- Descriptive commit messages

## Domain Context
- 16 routes: /, /works, /talks, /likes, /blog, /gifts, /cv, /terminal, /process, /gallery, /labs, /os, /minor, /scratchpad, /blog/[slug]
- 11 live-embedded project previews on /works page (iframes + static images)
- Responsive: mobile-first, supports 320px to 6K (3840px)
- Keyboard shortcuts: T (theme), F (font), / (command palette), ? (help)

## Important Constraints
- Static site — no server-side runtime
- Dev server: portless (portfolio.localhost:1355)
- Must work on mobile, iPad, and desktop
- WCAG AA minimum, AAA for accessible theme

## External Dependencies
- Sanity CMS (blog content)
- Google Fonts (Inter, JetBrains Mono, Crimson Pro, Fira Code, Space Grotesk)
- Vercel (deployment)
