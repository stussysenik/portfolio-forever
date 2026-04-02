# Spec: Breakpoint Bar Redesign

## MODIFIED Requirements

### Requirement: Quick preset breakpoints reduced to 3
The viewport bar SHALL show `auto` + 3 quick presets (390, 768, 1440) instead of 6.

#### Scenario: Preview pane renders
**Given** the preview pane is visible
**When** the viewport bar renders
**Then** it shows: auto, 390, 768, 1440 as chip buttons
**And** 320, 1024, 1920 are NOT shown as presets (accessible via custom input)

### Requirement: Custom width input always visible
A numeric input field for custom pixel width SHALL be always visible beside the presets.

#### Scenario: User enters custom breakpoint
**Given** the viewport bar is visible
**When** the user types "1024" into the custom input
**Then** the preview viewport resizes to 1024px width
**And** no preset chip is active (custom value)

## ADDED Requirements

### Requirement: H/V orientation toggle
Two device-orientation icon buttons (landscape/portrait) SHALL allow switching viewport orientation.

#### Scenario: User toggles to portrait
**Given** the viewport is at 1440x900 (landscape)
**When** the user clicks the portrait orientation icon
**Then** the viewport swaps to 900x1440
**And** the portrait icon becomes active

### Requirement: Dimensions always displayed
The current viewport width x height SHALL always be shown as text.

#### Scenario: Viewport at fixed width
**Given** the viewport is set to 768px
**When** the dimensions display renders
**Then** it shows "768 x [containerHeight]" in monospace text

### Requirement: Dashed boundary lines on fixed viewport
When a fixed-width breakpoint is active, the preview viewport SHALL show dashed border styling.

#### Scenario: Fixed breakpoint selected
**Given** the user selects 768px breakpoint
**When** the iframe viewport renders
**Then** the viewport container has a dashed border (replacing solid)
**And** the border indicates the breakpoint boundary

#### Scenario: Auto mode selected
**Given** the user selects "auto"
**When** the iframe viewport renders
**Then** the viewport has standard solid border (no dashed indicator)
