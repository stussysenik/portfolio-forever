# Spec: Theme System Tests

## ADDED Requirements

### Requirement: All 4 themes SHALL pass accessibility and visual correctness tests
Each theme (minimal, studio, darkroom, accessible) MUST be independently verified for contrast, highlight rendering, and CSS custom property application.

#### Scenario: Each theme applies correct CSS custom properties
**Given** the user switches to theme "minimal" or "studio" or "darkroom" or "accessible"
**Then** --color-bg matches the expected value for that theme
**And** --color-text matches the expected value
**And** --color-accent matches the expected value

#### Scenario: Entry highlights render per-theme styles
**Given** entries with data-highlight attributes exist
**When** theme is "minimal"
**Then** highlights have full-saturation colored backgrounds
**When** theme is "studio"
**Then** highlights have low-opacity wash with left border
**When** theme is "darkroom"
**Then** highlights have opacity wash with colored border
**When** theme is "accessible"
**Then** highlights have solid border with bold text

#### Scenario: Axe-core passes for each theme
**Given** the homepage is loaded with any of the 4 themes
**When** axe-core accessibility scan runs
**Then** zero critical or serious violations are reported

#### Scenario: Theme persists across page refresh
**Given** the user selects theme "darkroom"
**When** the page is refreshed
**Then** the page loads with theme "darkroom" applied
**And** localStorage contains the selected theme

#### Scenario: Legacy theme terminal migrates to darkroom
**Given** localStorage contains theme="terminal"
**When** the page loads
**Then** the page renders with theme "darkroom"
**And** localStorage is updated

#### Scenario: System dark preference triggers darkroom fallback
**Given** no theme is set in localStorage
**And** the user's OS prefers dark color scheme
**When** the page loads
**Then** darkroom-equivalent colors are applied

## Related Capabilities
- [playwright-interaction-tests](../playwright-interaction-tests/spec.md)
