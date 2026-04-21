# Spec: Sanity and Convex Content Boundary

## ADDED Requirements

### Requirement: Sanity owns long-lived editorial content
Sanity SHALL store long-lived editorial content and rich structured content that benefits from versioning and editorial workflows.

#### Scenario: Blog content is authored
**Given** a user creates or edits a blog post
**When** the content is saved
**Then** the canonical editorial record lives in Sanity

#### Scenario: Case-study content is authored
**Given** a user creates or edits a case study
**When** the content is saved
**Then** the canonical editorial record lives in Sanity

### Requirement: Convex owns composition and runtime state
Convex SHALL remain the source of truth for page composition, navigation order, feature flags, and live application state.

#### Scenario: Page section order changes
**Given** an admin reorders sections on a page
**When** the change is saved
**Then** the canonical composition record is stored in Convex

#### Scenario: Live site status updates
**Given** a runtime widget reports live state such as presence, claps, chat, or system status
**When** the underlying state changes
**Then** the canonical live record is stored and served from Convex

### Requirement: Convex composition can reference Sanity atoms
Convex composition records SHALL be able to reference Sanity-backed content atoms without making Sanity the composition source of truth.

#### Scenario: A homepage hero section uses Sanity-authored copy
**Given** a Convex page composition record includes a hero section
**And** the hero section references a Sanity content document
**When** the page renders
**Then** Convex determines that the hero section appears on the page
**And** Sanity provides the hero copy/media content rendered inside that section

### Requirement: This change reverses prior Sanity removal
Migration and architecture docs SHALL reflect that Sanity is intentionally reintroduced after a prior Convex-only direction.

#### Scenario: A contributor reviews prior migration notes
**Given** the contributor reads the current migration spec and related docs
**When** they inspect the content architecture rationale
**Then** they can tell that Sanity reintroduction is intentional
**And** they are not left with contradictory instructions about whether Sanity should exist in the stack
