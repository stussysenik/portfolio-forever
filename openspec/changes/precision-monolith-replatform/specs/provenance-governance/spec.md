# Spec: Provenance Governance

## ADDED Requirements

### Requirement: The repository SHALL maintain an authoritative provenance record
The repository SHALL document which stack is current, which stack is historical, and which stack is the active migration target.

#### Scenario: Documentation conflicts are resolved explicitly
**Given** `README.md`, `TECHSTACK.md`, and runtime code can drift over time
**When** a contributor needs to determine the active architecture
**Then** the repository provides a documented tie-break order
**And** the current stack can be derived without guessing

#### Scenario: Missing progress history is filled
**Given** the repo has moved through multiple architectural eras
**When** a contributor reads the provenance docs
**Then** they can see a dated timeline of the major host/runtime transitions
**And** the purpose of each era is explained

### Requirement: Reference deployments SHALL be preserved as design provenance
Protected preview deployments SHALL not be treated as disposable if they represent important finished states of the portfolio.

#### Scenario: A future migration needs to recover the strongest prior surface
**Given** three reference deployments were selected as design inputs
**When** a contributor evaluates a route or shell decision
**Then** the repo contains a named record of the relevant reference versions
**And** the strongest traits of each reference are documented
