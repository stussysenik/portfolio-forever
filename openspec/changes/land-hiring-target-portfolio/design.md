# Design: Land Hiring-Target Portfolio

## Decision

Use a two-layer approach:

1. `openspec` records the actual hiring target and role clusters.
2. The homepage hero exposes a concise public-facing fit statement and proof routes.

This keeps the permanent repo intent explicit without making the site read like a desperate pitch.

## Research Summary

The referenced job set converges on a shared bar:

- code-level design craft
- strong visual and interaction quality
- prototyping directly in code
- AI-native workflow literacy
- systems thinking
- accessibility and performance discipline
- cross-functional ownership from concept to shipped product
- comfort with trust-heavy or expert-user interfaces

The portfolio should therefore lead with:

- what role types this work fits
- what proof exists
- where to inspect that proof quickly

## Public Experience Rule

The homepage hero should answer three recruiter questions immediately:

1. What kind of builder is this?
2. Why is this person relevant to my role?
3. Where do I click to verify the claim?

That is why the public layer should include:

- hiring-fit tracks
- proof pillars
- route-true verification links

## Code Boundary

The hiring target model should live in a dedicated data file so it can be reused and evolved
without burying the goal inside one component.

Recommended structure:

- `src/lib/data/hiring-target.ts`
- consumed by a focused hero-level component

Later, this can move into Sanity if recruiter-facing positioning becomes editorially managed.
For now, code-level ownership is acceptable because this is product strategy, not CMS copy.
