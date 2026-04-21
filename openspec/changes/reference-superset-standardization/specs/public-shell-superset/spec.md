# Spec: Public Shell Superset

## ADDED Requirements

### Requirement: The public site SHALL use one canonical shell derived from the three named reference deployments
The public portfolio SHALL standardize on a single shell that deliberately combines the strongest shipped traits from the February 3, 2026, April 3, 2026, and April 18, 2026 reference deployments.

#### Scenario: Desktop public shell is finalized
**Given** the three reference deployments each provide different strengths
**When** the desktop shell is considered complete
**Then** the shell uses the strongest navigation hierarchy and route framing from the selected reference source
**And** it preserves the strongest readability and finish traits from the other selected sources
**And** the result does not read as a partial clone of only one historical deployment

### Requirement: Desktop shell SHALL preserve strong orientation and route identity
The desktop public shell SHALL give users a persistent sense of where they are in the portfolio and how internal routes differ from external identity links.

#### Scenario: User opens the homepage on desktop
**Given** the viewport is desktop width
**When** the homepage shell renders
**Then** internal navigation and external identity links are visually grouped with different roles
**And** the route frame provides clear orientation
**And** the shell remains readable without overwhelming the main content

### Requirement: Mobile and tablet shell SHALL remain compact without collapsing the system identity
Smaller viewports SHALL preserve the public system's identity while simplifying the shell.

#### Scenario: User opens the homepage on mobile
**Given** the viewport is below desktop width
**When** the shell renders
**Then** navigation remains discoverable and coherent
**And** the shell does not force the full desktop structure into an unreadable layout
**And** system cues such as status, route framing, or command hints remain intentional rather than decorative leftovers

### Requirement: Public footer/status framing SHALL remain part of the canonical shell
The public footer or terminal/status strip SHALL continue to function as part of the portfolio's identity rather than an optional afterthought.

#### Scenario: User reaches the end of a public route
**Given** a public route has loaded
**When** the footer/status framing is visible
**Then** it reflects the same design system as the rest of the public shell
**And** it reinforces the portfolio's voice, status, and interaction language
