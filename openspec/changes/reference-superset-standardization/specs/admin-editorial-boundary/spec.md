# Spec: Admin and Editorial Boundary

## ADDED Requirements

### Requirement: Admin SHALL govern the canonical public system rather than a divergent parallel site
The admin surface SHALL control and preview the same token, content, and route system that the public site actually renders.

#### Scenario: Admin preview is used to inspect a public route
**Given** a user is editing or reviewing public content in `/admin`
**When** they open a preview for a public route
**Then** the preview reflects the actual public shell and route behavior
**And** admin controls correspond to real public-system properties rather than admin-only abstractions

### Requirement: Sanity live preview SHALL remain first-class in the Astro-first architecture
Sanity editorial and preview workflows SHALL remain supported without requiring the public site to become React-first.

#### Scenario: Editor previews a Sanity-backed public change
**Given** editorial content is authored in Sanity
**When** an editor opens live preview for a public route
**Then** the preview path remains available and accurate for the Astro-first public app
**And** preview integration does not require rewriting public routes into a React-first implementation

### Requirement: React usage SHALL stay constrained to the editorial boundary unless explicitly widened later
React MAY be used where it materially improves Sanity preview or editorial integration, but SHALL NOT become the default public runtime as part of this change.

#### Scenario: A new preview or editorial adapter is introduced
**Given** a contributor needs React for a Sanity-related integration point
**When** they implement that boundary
**Then** the React usage is isolated to the editorial or preview integration layer
**And** public route ownership remains Astro plus the canonical public component system

### Requirement: Convex SHALL remain complementary to the editorial/public boundary
Convex SHALL continue as a live/runtime sidecar where useful, but SHALL NOT silently replace editorial ownership of routes covered by this change.

#### Scenario: A route uses both editorial content and live state
**Given** a public route combines authored content with runtime behavior
**When** the route is implemented
**Then** Sanity remains the canonical source for editorial content
**And** Convex provides only the live/runtime behavior that benefits from it
