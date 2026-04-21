# Spec: Public Route Parity

## ADDED Requirements

### Requirement: Astro reaches full public route parity
Astro SHALL provide a production route for every supported legacy public route, unless that route is explicitly merged into another route or intentionally removed with documentation.

#### Scenario: Contributor checks migration status
**Given** the repository contains legacy public routes under `src/routes`
**When** the contributor reviews the migration matrix
**Then** each legacy public route has a recorded outcome of `ported`, `merged`, or `removed`

#### Scenario: Legacy public route is still supported
**Given** a legacy public route is still part of the intended site surface
**When** the migration is complete
**Then** Astro serves an equivalent public route for that surface

### Requirement: Route parity includes route identity, not just path existence
Ported Astro routes SHALL preserve the legacy route’s visual hierarchy, content density, and characteristic interaction patterns.

#### Scenario: A route had a distinctive legacy presentation
**Given** a legacy route used bespoke composition or interaction patterns
**When** the corresponding Astro route is implemented
**Then** the Astro route preserves the route’s recognizable identity
**And** it is not replaced with a generic page scaffold that merely exposes the same path
