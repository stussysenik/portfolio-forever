# Spec: Precision Monolith Boundary

## ADDED Requirements

### Requirement: The target production host SHALL be Rails with Inertia and Solid
The migration target SHALL use Rails as the sole application host, Inertia as the transport boundary, and Solid for client interactivity.

#### Scenario: A first migrated route is delivered
**Given** the replatform is underway
**When** the first target route is considered complete
**Then** that route is served by Rails
**And** page data is delivered through Inertia props
**And** client interactivity is implemented in Solid

### Requirement: Interactive controls SHALL use Solid-native accessible primitives
The Solid interaction layer SHALL use Solid-native accessible primitives for controls that users operate directly.

#### Scenario: A user toggles a runtime preference or comparison mode
**Given** the public UI exposes a switch, checkbox, tab, or command surface
**When** the control is rendered in the target Solid app
**Then** it is built from a Solid-native accessible primitive layer such as Kobalte
**And** custom styling does not remove its keyboard or ARIA behavior

### Requirement: Animation engines SHALL be swappable behind a narrow adapter
The app SHALL be able to compare Motion and GSAP on the same interaction surface without rewriting the surrounding component.

#### Scenario: A comparison lab toggles animation engines
**Given** a local or debug-visible animation comparison surface exists
**When** a user switches the animation engine
**Then** the same interaction behavior is rendered through either Motion or GSAP
**And** the component API above that adapter remains unchanged

### Requirement: Convex SHALL remain a realtime sidecar only
Convex SHALL not become the canonical content or page-composition database for the new monolith.

#### Scenario: A live metric is added to the portfolio
**Given** a route already renders canonical content from Rails and Sanity
**When** a live feature such as likes or views is added
**Then** Convex may provide the realtime state for that feature
**But** the core page content does not move into Convex

### Requirement: The target UI SHALL be a finished superset of the reference versions
The new public shell SHALL preserve the strongest finished traits from the selected reference deployments rather than collapsing to a reduced subset.

#### Scenario: Homepage shell selection
**Given** the three reference deployments each have different strengths
**When** the homepage shell is finalized
**Then** the chosen design is based on an explicit comparison of those references
**And** the result preserves the strongest traits needed for clarity, density, and finish
