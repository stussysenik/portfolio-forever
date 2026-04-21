# Spec: Runtime Flag Parity on Astro Public Shell

## ADDED Requirements

### Requirement: Astro public shell reflects Convex-backed runtime controls
The Astro public shell SHALL reflect the Convex-backed runtime controls that are intended to affect the live public site.

#### Scenario: Navigation order changes in system controls
**Given** the public navigation order is changed through Convex-backed system controls
**When** a public Astro page renders
**Then** the Astro shell reflects the updated navigation order

#### Scenario: WIP banner is enabled for the live site
**Given** the WIP banner is enabled in the runtime control surface
**When** a user visits a public Astro route
**Then** the Astro public shell renders the WIP banner according to the configured public behavior

### Requirement: Runtime-owned visual behavior remains backend-owned
Astro SHALL not replace runtime-owned public behavior with hardcoded shell-only styling.

#### Scenario: Public shell behavior was previously controlled by site config or flags
**Given** a public-shell behavior depends on Convex-backed config or feature flags
**When** the Astro shell is rendered
**Then** the shell behavior is derived from runtime state rather than a static fallback
