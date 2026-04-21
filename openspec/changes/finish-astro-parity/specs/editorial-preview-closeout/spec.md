# Spec: Editorial Preview Closeout

## ADDED Requirements

### Requirement: Migrated Sanity-backed routes are not complete until preview is verified
A Sanity-backed Astro public route SHALL not be considered migration-complete until published render, draft preview, and editorial handoff are verified for that route.

#### Scenario: Route is marked complete
**Given** a Sanity-backed Astro route is marked migrated
**When** a contributor reviews its acceptance record
**Then** the route has verification for published rendering
**And** the route has verification for preview or draft-mode rendering
**And** the route has verification for visual-editing handoff into the editorial surface

### Requirement: Visual editing targets the actual public route
Editorial preview SHALL operate against the actual Astro public route rather than a disconnected preview-only surface.

#### Scenario: Editor opens a route from Presentation
**Given** a Sanity document has a Presentation location mapped to a public route
**When** the editor opens preview from the editorial surface
**Then** the preview loads the actual public Astro route for that content
**And** the edit handoff returns to the correct editorial context
