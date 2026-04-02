# Spec: Top Bar Priority Collapse

## MODIFIED Requirements

### Requirement: Theme and font dropdowns collapse on narrow screens
Below 1024px, theme and font dropdown chips SHALL hide behind a "..." overflow chip.

#### Scenario: Admin viewed at 900px width
**Given** the browser window is 900px wide
**When** the admin top bar renders
**Then** the breadcrumb shows "admin" (shortened)
**And** the theme dropdown is hidden
**And** the font dropdown is hidden
**And** a "..." overflow chip is visible

#### Scenario: Admin viewed at 1200px width
**Given** the browser window is 1200px wide
**When** the admin top bar renders
**Then** the full breadcrumb "portfolio / admin" is shown
**And** the theme and font dropdowns are visible
**And** no overflow chip is shown

### Requirement: Gear and config toggle always visible
The settings gear icon and config toggle chip MUST remain visible at all screen sizes.

#### Scenario: Any screen size
**Given** the admin is viewed at any width >= 320px
**When** the top bar renders
**Then** the gear icon button is visible
**And** the config toggle chip is visible

## ADDED Requirements

### Requirement: Overflow chip opens dropdown
Clicking the "..." overflow chip SHALL open a small dropdown with theme and font selectors.

#### Scenario: User clicks overflow chip
**Given** the screen is narrow and overflow chip is visible
**When** the user clicks "..."
**Then** a dropdown appears with theme selector and font selector
**And** clicking outside the dropdown closes it
