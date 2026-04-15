# Spec: Mobile Admin Navigation

## ADDED Requirements

### Requirement: Mobile workspace row shrinks and scrolls correctly
The admin shell on mobile widths SHALL use a grid template that allows the workspace row to shrink below its content size and scroll independently of the dock and topbar.

#### Scenario: User opens admin at 390px width
**Given** the admin is loaded at viewport width 390px and height 844px
**When** the admin shell mounts
**Then** the grid template on `.admin-shell` resolves to `grid-template-rows: auto auto minmax(0, 1fr) auto`
**And** the workspace child has `min-height: 0` and `overflow-y: auto`
**And** the overall shell height is `100dvh`

#### Scenario: User selects a section and expands a bookmark
**Given** the admin is loaded at 390×844
**When** the user taps the `HERO` compartment and the `CONTENT` bookmark
**Then** the `BookmarkTabs` component renders with non-zero width and height inside the workspace row
**And** the bookmark editor fields are mounted and visible
**And** scrolling the workspace does not move the topbar or the dock

#### Scenario: Compartment content exceeds viewport height
**Given** a compartment's `CONTENT` bookmark contains enough fields to overflow the workspace
**When** the user scrolls inside the workspace
**Then** only the workspace content scrolls
**And** the dock remains fixed to the bottom of the viewport
**And** the topbar remains fixed to the top of the viewport
**And** on iOS Safari the bottom dock does not slide under the URL bar

### Requirement: Mobile dock replaces cmd+K as the primary entry point
On mobile widths, the admin SHALL expose navigation through a persistent 3-button dock (`PAGES · SECTIONS · PREVIEW`) inside the admin chrome, and SHALL NOT open the CommandPalette.

#### Scenario: User loads admin on a phone
**Given** the admin loads at viewport width below 768px
**When** the admin shell mounts
**Then** the dock renders three buttons labelled `PAGES`, `SECTIONS`, `PREVIEW`
**And** each button has an associated lucide icon from the admin icon manifest
**And** the CommandPalette overlay does not mount in the DOM

#### Scenario: User taps the PAGES button
**Given** the admin is mounted on mobile with a page already active
**When** the user taps `PAGES`
**Then** a bottom sheet slides up from the bottom edge
**And** the sheet contains the same page list as the desktop sidebar
**And** tapping a page closes the sheet and updates the active page
**And** no network request to an LLM endpoint is made

#### Scenario: User taps the SECTIONS button
**Given** the admin is mounted on mobile with the `process` page active
**When** the user taps `SECTIONS`
**Then** a bottom sheet slides up containing the section compartment list for `process`
**And** the currently-active compartment is pre-scrolled into view

#### Scenario: User taps the PREVIEW button
**Given** the admin is mounted on mobile with the `home` page active
**When** the user taps `PREVIEW`
**Then** a full-height bottom sheet slides up containing an iframe of `/`
**And** the sheet has a dismiss handle at the top
**And** dragging the handle down or tapping outside closes the sheet

### Requirement: CommandPalette is desktop-only
The `CommandPalette.svelte` overlay SHALL NOT mount below 768px viewport width.

#### Scenario: User presses cmd+K on a phone with a connected keyboard
**Given** the admin is loaded at 390px width
**When** the user triggers cmd+K via an attached keyboard
**Then** the CommandPalette does not mount
**And** no error is thrown

#### Scenario: User resizes viewport from desktop to mobile with palette open
**Given** the CommandPalette is open at 1440px width
**When** the viewport resizes below 768px
**Then** the CommandPalette unmounts
**And** the mobile dock takes over as the entry point

### Requirement: Mobile sheets reuse existing admin primitives
The `PAGES`, `SECTIONS`, and `PREVIEW` sheets SHALL reuse existing admin components rather than introducing parallel implementations.

#### Scenario: Pages sheet mounts the sidebar component
**Given** the user opens the `PAGES` sheet
**When** the sheet content renders
**Then** the content is the same `PageSidebar` component used at desktop widths
**And** the component is rendered without its desktop width constraint

#### Scenario: Sections sheet mounts the compartment list
**Given** the user opens the `SECTIONS` sheet
**When** the sheet content renders
**Then** the content is the same `SectionCompartmentList` component used at desktop widths
