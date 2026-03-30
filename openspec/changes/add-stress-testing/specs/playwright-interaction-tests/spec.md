# Spec: Playwright Interaction Stress Tests

## ADDED Requirements

### Requirement: All interactive elements SHALL have E2E test coverage
Every button, link, keyboard shortcut, and interactive component MUST be tested for correct behavior under normal and stress conditions.

#### Scenario: Navigation links work for all routes
**Given** the user is on any page
**When** they click each navigation link (process, works, talks, likes, blog, gifts, cv, terminal)
**Then** the correct page loads with expected content visible

#### Scenario: Theme switcher cycles through all 4 themes via T key
**Given** the user is on the homepage with default theme "minimal"
**When** they press T repeatedly
**Then** themes cycle: minimal → studio → darkroom → accessible → minimal
**And** the CSS custom property --color-bg changes for each theme

#### Scenario: Theme switcher works via dropdown UI
**Given** the user clicks the theme toggle button
**When** they click each theme option in the dropdown
**Then** the page updates to that theme's colors
**And** localStorage stores the selected theme

#### Scenario: Font switcher toggles via F key
**Given** the user is on any page
**When** they press F
**Then** the font selector opens
**And** selecting a font changes the root font-family

#### Scenario: Command palette opens and navigates
**Given** the user presses /
**When** the command palette opens
**Then** typing a route name filters results
**And** pressing Enter navigates to the selected route

#### Scenario: Social toggle reveals links
**Given** the user clicks the @ button in the nav
**When** the social dropdown opens
**Then** all social links are visible
**And** each link has target="_blank" and rel containing "noopener"

#### Scenario: Rapid theme cycling does not corrupt state
**Given** the user is on the homepage
**When** they press T key 10 times rapidly within 1 second
**Then** the final theme is correctly applied
**And** no console errors are logged
**And** the theme persists on page refresh

#### Scenario: All external links have security attributes
**Given** any page is loaded
**When** all anchor elements with target="_blank" are collected
**Then** each has rel containing "noopener"

#### Scenario: Cold start with cleared localStorage
**Given** localStorage is completely cleared
**When** the page loads fresh
**Then** the default theme "minimal" is applied
**And** no console errors occur

## Related Capabilities
- [theme-system-tests](../theme-system-tests/spec.md)
- [responsive-layout-tests](../responsive-layout-tests/spec.md)
