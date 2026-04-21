# Spec: Route Fidelity Recovery

## ADDED Requirements

### Requirement: The hero SHALL recover the strongest missing traits from the reference deployments
The homepage hero SHALL act as the front door to the portfolio by combining strong hierarchy, proof, identity, and interaction cues from the selected reference sources.

#### Scenario: Homepage hero is reviewed against the references
**Given** the hero exists in the current Astro app
**When** it is compared to the February 3, 2026, April 3, 2026, and April 18, 2026 references
**Then** the final hero preserves the strongest hierarchy and framing from the chosen references
**And** it includes enough proof, metadata, and interaction cues to avoid feeling reduced relative to the older shipped versions

### Requirement: Works SHALL support both readable ledger structure and richer showcase behavior
The works system SHALL support clean list readability and selective media/showcase energy without fragmenting into separate competing route models.

#### Scenario: User browses works on the homepage and `/works`
**Given** the portfolio exposes works on multiple public surfaces
**When** a user compares the homepage works treatment and the `/works` route
**Then** both surfaces are driven by one coherent works presentation model
**And** that model supports readable entry structure
**And** it can express preview surfaces, internal portfolio routes, and external canonical links
**And** richer showcase/media behavior may appear where it adds signal rather than clutter

### Requirement: Process SHALL visibly explain systems, not only describe them
The process route SHALL preserve or restore the stronger diagrammatic or system-explanation behavior present in the portfolio's better shipped states.

#### Scenario: User opens `/process`
**Given** the process route is rendered
**When** the user reads the route
**Then** the route includes a structured explanatory visual grammar such as diagrammatic treatment, system map, or equivalent high-signal process visualization
**And** the route does not degrade into generic text sections only

### Requirement: CV SHALL return to a finished public-document standard
The CV route SHALL recover strong hierarchy, scanability, and presentation quality while remaining aligned with the canonical public shell.

#### Scenario: User opens `/cv`
**Given** the CV route is rendered
**When** the user scans education, experience, links, and metadata
**Then** the route presents those sections with stronger typographic and layout finish than the current reduced state
**And** the route feels like part of the same canonical public system
**And** print or export-aware structure is preserved where supported
