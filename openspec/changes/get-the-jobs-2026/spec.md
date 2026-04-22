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

### Batch 2: Linear (4 roles)
- Sr/Staff Product Designer → Design craft, systems thinking
- Sr/Staff Fullstack Engineer → TypeScript/React/Node full-stack proof
- Sr/Staff Product Engineer → End-to-end feature ownership
- Sr/Staff Product Engineer, AI → AI-native product features

### Batch 3: OpenAI (1 role)
- iOS Software Engineer, ChatGPT → Mobile AI interfaces

### Batch 4: Basement Studio (1 role)
- Frontend Developer → Motion, WebGL, creative frontend

### Batch 5: Jane Street (3 roles)
- Software Engineer → Functional programming, OCaml interest
- SWE Internship → Systems thinking, algorithms
- Tools & Compilers Research → PL theory, compilers

### Batch 6: DeepMind (5 roles)
- Staff AI Product Designer (×3) → AI interfaces, LLM UX, systems thinking
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

## Implementation Plan

### Phase 1: Permanent Manifest
- [x] Create `HIRE.md` at repo root — immutable hiring mission
- [x] Update `AGENTS.md` with hiring-context clause
- [x] Update `hiring-target.ts` with actual job URLs, requirements, proof mappings

### Phase 2: The `/hire` Route
- [x] Create `src/pages/hire.astro` — dedicated recruiter landing page
- [x] Build `src/lib/components/hire/HireManifest.svelte` — inverse-law hero
- [x] Build `src/lib/components/hire/RoleTargets.svelte` — company/role grid with proof links
- [x] Build `src/lib/components/hire/ProofMatrix.svelte` — skills → evidence mapping
- [x] Build `src/lib/components/hire/CallToAction.svelte` — direct contact/schedule

### Phase 3: Design System — "Proof" Aesthetic
- [x] Add `proof` theme to CSS custom properties (Rick Rubin minimalism)
- [x] High contrast, maximum whitespace, single accent
- [x] Typography: massive headings, tiny metadata (PG LANG scale contrast)
- [x] Motion: none. Static confidence. (Light Phone restraint)

### Phase 4: Navigation & Integration
- [x] Add `/hire` to fallback nav items
- [x] Update `HiringProof.svelte` to link to `/hire`
- [x] Ensure `/hire` is accessible from hero and footer

### Phase 5: Validation
- [x] `bun run build` passes with zero errors
- [x] `/hire` route renders correctly
- [x] All links resolve
- [x] Responsive from 320px to 3840px

## Success Criteria

1. A recruiter can land on `/hire` and within 30 seconds understand: who, what, why hire
2. Every target role has a visible evidence trail in the portfolio
3. The design communicates taste, restraint, and confidence — not desperation
4. The build is clean, the code is minimal, the message is clear
