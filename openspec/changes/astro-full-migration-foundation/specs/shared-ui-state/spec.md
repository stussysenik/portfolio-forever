# Spec: Shared UI State with Nano Stores

## ADDED Requirements

### Requirement: Shared client UI state uses Nano Stores
Client-side UI state shared across Astro-mounted Svelte islands SHALL use Nano Stores.

#### Scenario: Theme state is read across islands
**Given** a page contains multiple Svelte islands
**When** the active theme changes through a shared client interaction
**Then** each subscribed island observes the same Nano Store value without bespoke event plumbing

#### Scenario: Navigation shell state is shared
**Given** the page shell and an interactive island both need nav open/closed state
**When** one surface mutates that state
**Then** the other surface reads the updated value from the shared Nano Store

### Requirement: Nano Stores do not replace backend ownership
Nano Stores SHALL not be used as the canonical source of truth for editorial content, composition data, or multi-user live state.

#### Scenario: A user edits a blog post
**Given** a blog post is being previewed locally
**When** draft content changes
**Then** Nano Stores may hold ephemeral preview/session UI state
**But** the canonical blog content remains owned by Sanity

#### Scenario: A live widget updates from multiple users
**Given** multiple users are affecting a live runtime feature
**When** the feature state updates
**Then** the canonical shared state is managed by Convex rather than a Nano Store
