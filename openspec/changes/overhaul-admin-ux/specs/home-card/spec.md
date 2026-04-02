# Spec: Home Card Header

## ADDED Requirements

### Requirement: Home page displays as pinned card in sidebar
The Home page SHALL render as a visually distinct card at the top of the sidebar, above the PAGES label and divider.

#### Scenario: Admin loads with Home page existing
**Given** the pages list contains a page with pageId "home"
**When** the admin sidebar renders
**Then** a card header appears above the "PAGES" label
**And** the card shows: house icon, "Home" label, route "/", subtitle "root page"
**And** the card has a blue accent border or subtle background tint
**And** a visibility dot (green if visible, gray if hidden) is shown

### Requirement: Home page cannot be reordered
The Home card SHALL be stationary and excluded from drag-and-drop reordering.

#### Scenario: User attempts to drag Home
**Given** the admin sidebar is visible
**When** the user tries to drag the Home card
**Then** the card does not respond to drag events
**And** the Home page stays at navOrder 0

### Requirement: Home excluded from sortable page list
The draggable pages list below the PAGES label MUST NOT include the Home page.

#### Scenario: Pages list renders
**Given** 5 pages exist including Home
**When** the sidebar renders the draggable page list
**Then** only 4 pages appear in the draggable list (Home is excluded)
**And** Home is only shown in the card header above
