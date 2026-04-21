# Spec: Astro Site Shell

## ADDED Requirements

### Requirement: Astro is the sole app framework host
The repository SHALL use Astro as the only top-level app framework for public routes and the `/admin` host route.

#### Scenario: App starts in development
**Given** the repository is installed with the migration foundation applied
**When** the developer runs the primary dev command
**Then** Astro starts as the host runtime
**And** public routes are resolved by Astro
**And** `/admin` is served by Astro rather than SvelteKit

#### Scenario: Legacy host runtime is removed
**Given** the migration reaches host parity
**When** the repository is inspected for top-level routing ownership
**Then** no SvelteKit router remains responsible for production route handling

### Requirement: Public pages are static-first with islands
Astro public routes SHALL render static-first HTML and hydrate only the Svelte islands that require client interactivity.

#### Scenario: Homepage loads
**Given** a user visits `/`
**When** the initial HTML response is delivered
**Then** the shell content is present without requiring client-side JavaScript execution
**And** only declared interactive islands hydrate on the client

#### Scenario: Non-interactive section exists on a page
**Given** a section has no client interaction requirements
**When** the Astro page renders
**Then** that section SHALL not ship unnecessary hydration code

### Requirement: Homepage proves the mixed-stack foundation
The homepage SHALL demonstrate the new architecture with at least one Sanity-backed content slice, one Convex-backed live slice, and one Svelte island.

#### Scenario: Homepage content sources render together
**Given** the homepage route is rendered
**When** the route completes rendering
**Then** at least one visible content region comes from Sanity content
**And** at least one visible live region comes from Convex-backed data
**And** at least one Svelte island hydrates successfully on the page
