# Get The Jobs — 2026 Hiring Proof Manifest

## Permanent Goal

This portfolio is the primary verification proof for 30+ targeted roles across Ramp, Linear, OpenAI, Basement Studio, Jane Street, DeepMind, Windmill, Notion, Apple, and Mistral AI. Every design decision, code path, and content surface exists to answer one question: **Why should this person be the #1 prospect hire?**

## Inverse-Law Design Philosophy

> "Simplicity is the ultimate sophistication." — Leonardo da Vinci (via Steve Jobs)

**Rick Rubin mentorship**: Strip away everything that doesn't serve the song. The portfolio is the song. Recruiters are the audience. If it doesn't make them want to hire, it doesn't belong.

**PG LANG energy**: Bold, purposeful, unapologetic. Every element is intentional. No filler. The work speaks, the design amplifies.

**Light Phone restraint**: Digital minimalism. Only the essential. No notification anxiety, no feature bloat. Calm, focused, present.

## Target Roles & Evidence Mapping

### Batch 1: Ramp (9 roles)
- Design Engineer → `works` (live surfaces, design system), `process` (AI-native workflow)
- Product Designer → `works` (UX craft), `process` (problem framing)
- Frontend SWE → `works` (TypeScript/React/Vite stack), `terminal` (engineering depth)
- Android Intern → Mobile AR filters, Android projects
- iOS Engineer → Swift/SwiftUI projects, mobile craft
- Product Manager Intl → `process` (systems thinking), `cv` (cross-functional)
- Security Engineer → `terminal` (systems), code quality
- Forward Deployed AI → AI tools, prompt engineering, agentic workflows

### Batch 2: Linear (5 roles)
- Sr/Staff Product Designer → Design craft, systems thinking
- Sr/Staff Fullstack Engineer → TypeScript/React/Node full-stack proof
- Sr/Staff Product Engineer → End-to-end feature ownership
- Sr/Staff Product Engineer, AI → AI-native product features
- Designer, Web & Brand → Web design, motion, interaction

### Batch 3: OpenAI (1 role)
- iOS Software Engineer, ChatGPT → Mobile AI interfaces

### Batch 4: Basement Studio (1 role)
- Frontend Developer → Motion, WebGL, creative frontend

### Batch 5: Jane Street (3 roles)
- Software Engineer → Functional programming, OCaml interest
- SWE Internship → Systems thinking, algorithms
- Tools & Compilers Research → PL theory, compilers

### Batch 6: DeepMind (5 roles)
- Staff AI Product Designer (×4) → AI interfaces, LLM UX, systems thinking
- Research Scientist → ML research, post-training

### Batch 7: Windmill (3 roles)
- Founding Design Engineer → Design + engineering hybrid
- Software Engineer → Full-stack systems
- ML Engineer → Machine learning systems

### Batch 8: Notion (3 roles)
- Fullstack Early Career → React/TypeScript/Node
- Cloud Infrastructure → Systems, scale
- Mobile Platform Android → Kotlin, mobile craft

### Batch 9: Apple (3 roles)
- ML Engineer Recommendations → ML systems
- Sr Ruby on Rails Engineer → Backend craft
- SWE Search MLPT → Search + ML

### Batch 10: Mistral AI (4 roles)
- AI Engineer → LLM evals, prompts, orchestration
- Senior Frontend Engineer → TypeScript/React/Next.js
- Backend Engineer → Python, distributed systems
- Web Crawling Engineer → Go/Rust, distributed crawling

## The Recruiter Experience (The 30-Second Scan)

When a hiring manager at Ramp, Linear, or DeepMind opens `/hire` on their phone while drinking coffee:

1. **0–3s**: Name. Title. One-line proof statement. They know who I am.
2. **3–10s**: Selected works with live previews. They see I can ship.
3. **10–20s**: Proof pillars. They understand the depth: design engineer + AI-native + systems.
4. **20–30s**: Role fit matrix. They see exactly which roles I match and why.
5. **30s+**: Contact. They're reaching out.

NOTHING else. No fluff. No timeline. No hobbies. Just proof.

## Implementation Plan

### Phase 1: Permanent Manifest ✅
- [x] Create `HIRE.md` at repo root — immutable hiring mission
- [x] Update `AGENTS.md` with hiring-context clause
- [x] Update `hiring-target.ts` with actual job URLs, requirements, proof mappings

### Phase 2: The `/hire` Route ✅ (Structural)
- [x] Create `src/pages/hire.astro` — dedicated recruiter landing page
- [x] Build `src/lib/components/hire/HirePage.svelte` — inverse-law hero + manifest + roles + matrix + CTA

### Phase 3: Crystallize & Polish 🔨 (Session 2026-04-22)
- [x] **Inverse theme**: Added `inverse` as 5th theme — pure black bg, white text, monospaced accents. Selectable from ThemeSwitcher (T key), admin AppearanceCell, and Convex seed data.
- [x] **`/hire` page rebuilt**: Container queries (`cqi`), fluid `clamp()` typography, IntersectionObserver reveals, green availability dot, CTA button, hover micro-interactions on work cards.
- [x] **Mobile dock**: Added `/hire` as primary nav item (replaced Admin).
- [x] **Hire data weaponized**: Statement now says "This website is the application... a working prototype you can verify right now."
- [x] **openspec updated**: Crystallize & Polish phase with recruiter experience spec.
- [x] **HIRE.md updated**: Documents 5 themes including Inverse.
- [x] **boneyard-js installed**: Vite plugin + Svelte 5 component + bones registry for skeleton loading.
- [ ] **Skeleton loading on hero + key sections**: Framework in place, bones registered, needs component wrapping.
- [ ] **Hero section**: First impression = proof. Needs tightening.
- [x] **Mobile dock overflow fix**: Dock now viewport-constrained (max-width: 28rem, centered), touch targets 45px (WCAG 44px minimum), labels 9.6px readable (up from 8.32px), color contrast upgraded to WCAG AA.
- [x] **IntersectionObserver scroll-spy**: Dock highlights active section as user scrolls through the one-page view.
- [x] **CV Invalid Date fix**: Date parser now handles short-form dates (YY-MM) that were rendering "Invalid Date".
- [x] **Overflow-x: hidden**: Added to html and body to prevent horizontal scroll on mobile.
- [x] **Minimap hidden on mobile**: Minimap overlaps content on narrow viewports; hidden below 900px where dock handles navigation.
- [x] **Elevator repositioned on mobile**: Moved above the dock to avoid overlap.
- [x] **Dock label contrast**: Upgraded from `--color-text-subtle` (#cbd5e1, ratio 1.47) to `--color-text-secondary` (#475569, ratio 4.5+), WCAG AA pass.
- [x] **CV email link fix**: Added `email` field to cvData to eliminate `mailto:undefined` link.

### Phase 4: Validation

### Phase 4: Validation
- [ ] `bun run build` passes with zero errors ✅ (verified)
- [ ] `bun run check` passes with 0 errors ✅ (verified, 1 pre-existing hint)
- [ ] `/hire` route bundles correctly ✅
- [ ] All links resolve
- [ ] Responsive from 320px to 3840px — verified via Chrome DevTools
- [ ] First Contentful Paint < 1.5s on mobile
- [ ] Lighthouse Performance > 90

## Success Criteria

1. A recruiter can land on `/hire` and within 30 seconds understand: who, what, why hire
2. Every target role has a visible evidence trail in the portfolio
3. The design communicates taste, restraint, and confidence — not desperation
4. The build is clean, the code is minimal, the message is clear
5. The website itself IS the proof — not just a container for proof