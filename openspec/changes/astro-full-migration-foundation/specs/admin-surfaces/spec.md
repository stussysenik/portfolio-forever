# Spec: Admin Surfaces

## ADDED Requirements

### Requirement: Admin is one custom shell with editorial and system surfaces
The admin SHALL be presented as one coherent shell containing distinct Editorial and System surfaces.

#### Scenario: User opens admin root
**Given** a user visits `/admin`
**When** the admin loads
**Then** the user is placed into a coherent admin shell
**And** the shell exposes an editorial path and a system path

#### Scenario: User enters editorial mode
**Given** a user visits `/admin/content`
**When** the page renders
**Then** the editorial surface is available for structured Sanity content editing

#### Scenario: User enters system mode
**Given** a user visits `/admin/system`
**When** the page renders
**Then** the custom Convex-backed admin SPA is available for live site controls and system views

### Requirement: Visual editing routes back into the editorial surface
Public-site visual editing affordances SHALL route the editor into the corresponding editorial admin surface.

#### Scenario: User clicks edit from a live preview overlay
**Given** a page is rendered in visual editing mode
**And** a visible content block is backed by a Sanity document
**When** the user invokes the edit action for that block
**Then** the resulting navigation lands in the editorial admin surface for the corresponding document
**And** the handoff preserves enough document identity to edit the intended content without manual searching
