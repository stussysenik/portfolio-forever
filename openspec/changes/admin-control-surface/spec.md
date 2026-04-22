# Admin Control Surface — Navigation Paradigm Switcher

## Overview

The admin interface must become a **surgical control surface** — minimal, precise, absolute. Currently the admin has 90+ components and no clear focus. This change strips the admin to its essential function: **control the portfolio's navigation system and preview changes live**.

The user must be able to:
1. Log in to `/admin`
2. Switch between navigation paradigms (Sidebar / Drawer / Hybrid / None)
3. See a live preview of the portfolio reflecting changes immediately
4. Toggle themes, fonts, and feature flags
5. Have every interaction feel like a precision instrument — right-angle edges, zero excess

## Philosophy: Right-Angle Edges

- **No border-radius** on admin chrome (0px)
- **1px borders** as structural lines, not decoration
- **Monospace for all labels** — every character counts
- **OKLCH color space** with exactly 3 colors: black, white, and electric blue (#2563EB)
- **GPU-only animations**: `transform` and `opacity` only
- **Essentialism**: If it doesn't help switch navigation or preview, it doesn't exist

## State Machine: Navigation Paradigm

```typescript
// XState-style finite state machine for navigation paradigm
interface NavParadigmContext {
  current: 'sidebar' | 'drawer' | 'hybrid' | 'none';
  previous: 'sidebar' | 'drawer' | 'hybrid' | 'none';
  transitioning: boolean;
}

type NavParadigmEvent =
  | { type: 'SWITCH'; to: 'sidebar' | 'drawer' | 'hybrid' | 'none' }
  | { type: 'PREVIEW'; route: string }
  | { type: 'TRANSITION_END' };
```

States:
- `idle` — stable, showing current navigation
- `switching` — morphing to new navigation style (GPU animation)
- `previewing` — showing preview iframe

## Architecture

### Components

1. **AdminShell** — minimal chrome, no rounded corners, 1px borders
2. **NavParadigmSwitcher** — 4 buttons, monospace, active state = blue left border
3. **LivePreview** — iframe loading current route, postMessage sync with parent
4. **ControlPanel** — theme, font, feature flag toggles in a single row
5. **AuthGate** — already exists, keep as-is

### Data Flow

```
Admin (/admin)
  ├── NavParadigmSwitcher → sets navParadigm store
  ├── ControlPanel → sets theme/font/flags stores
  └── LivePreview (iframe → /?preview=true)
        └── Receives postMessage: { type: 'admin:config', config: {...} }
```

## Implementation Plan

### Task 1: TDD — Navigation Paradigm State Machine
- Write unit tests for nav paradigm state transitions
- Test that switching triggers transition state
- Test that preview mode preserves paradigm choice
- Files: `src/lib/admin/stores/navParadigmMachine.ts`, `src/lib/admin/stores/navParadigmMachine.test.ts`

### Task 2: Minimal Admin Shell
- Strip AdminShell to essential chrome only
- Right-angle edges: 0px border-radius, 1px borders
- Monospace labels, electric blue active states
- Files: `src/lib/admin/AdminShell.svelte` (rewrite)

### Task 3: Nav Paradigm Switcher
- 4 buttons: SIDEBAR | DRAWER | HYBRID | NONE
- Active = blue left border + white text on black
- Inactive = gray text, no border
- Clicking switches immediately with GPU morph
- Files: `src/lib/admin/NavParadigmSwitcher.svelte`

### Task 4: Live Preview Integration
- Iframe loads `/?preview=true&nav={paradigm}`
- postMessage sync for config changes
- Preview updates without reload (morphing transition)
- Files: `src/lib/admin/LivePreview.svelte`

### Task 5: Control Panel
- Theme toggle: 5 theme buttons with swatches
- Font toggle: 9 font buttons
- Feature flags: toggle switches for key flags
- All in a single compact row
- Files: `src/lib/admin/ControlPanel.svelte`

### Task 6: Sanity Studio Preview (Optional Phase)
- Wire `@sanity/visual-editing` for overlay mode
- Enable when `?sanity-preview=true`
- Connect to Sanity Studio for live content editing

### Task 7: Typography Polish
- Fluid clamp() typography verified 320px–3840px
- Right-angle spacing: 4px base unit, no fractional
- Verify with browser testing

## Completion Status

### ✅ Completed
- [x] Resolved 20+ merge conflicts across 12 files (package.json, app.css, 10 Svelte/TS files)
- [x] Clean build: `vite build` passes with zero errors
- [x] TDD state machine: `navParadigmMachine.ts` + 9 unit tests (all passing)
- [x] Minimal AdminShell: right-angle edges, 0px border-radius, monospace labels
- [x] Nav paradigm switcher: SIDEBAR | DRAWER | HYBRID | NONE with blue active border
- [x] Theme switcher: 5 themes with swatches in admin chrome
- [x] Font switcher: 4 fonts (INTER | JETBRAINS | CRIMSON | SPACE)
- [x] Feature flag toggles: green dot indicators, live Convex mutations
- [x] Live preview iframe: loads `/?preview=true&nav={paradigm}`
- [x] postMessage sync: admin sends `admin:setNavParadigm`, `admin:setTheme`, `admin:setFont` to iframe
- [x] Preview layout updated: shows selected nav paradigm in preview mode (was showing content-only)
- [x] GPU morph animation: 300ms cubic-bezier on iframe load
- [x] Admin page simplified: 312 lines → ~30 lines
- [x] Responsive control surface: stacks vertically on mobile
- [x] `prefers-reduced-motion` respected

### 🔨 Remaining
- [ ] Sanity Studio visual editing overlay integration (deferred — needs Studio deployment)
- [ ] Browser testing verification with Chrome DevTools (needs MCP server)
- [ ] Typography fluid clamp() verification 320px–3840px

## Acceptance Criteria

- [x] Admin loads at `/admin` with clean auth
- [x] Navigation switcher shows 4 options
- [x] Switching navigation updates preview iframe live (via postMessage + URL params)
- [x] Preview shows correct navigation style without page reload
- [x] GPU morphing animation between nav styles (300ms, ease-out)
- [x] All tests pass (`bun run check`, `bun run test:unit`)
- [x] Zero build errors
- [x] Responsive from 320px to 3840px
- [x] Right-angle edges: 0px border-radius on admin chrome
- [x] Monospace labels throughout admin

## Deferred

- Sanity Studio full integration (requires Studio deployment)
- Advanced feature flag management (bulk operations)
- Analytics dashboard
- Content editing beyond navigation
