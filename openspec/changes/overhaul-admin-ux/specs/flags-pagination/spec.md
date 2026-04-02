# Spec: Flags Paginated Categories

## MODIFIED Requirements

### Requirement: Flags grouped into 3 categories
The 10 feature flags SHALL be organized into Visual, Layout, and System categories.

#### Scenario: Flags render in sidebar
**Given** the flags section is visible
**When** it renders the default category
**Then** only the Visual category flags are shown: pixel-engine, ascii-donut, parallax, terminal-matrix
**And** other categories are accessible via step navigation

### Requirement: Step bar navigation
A horizontal step bar SHALL show the 3 categories with active/done state indicators.

#### Scenario: User is on Visual category
**Given** the flags section shows Visual flags
**When** the step bar renders
**Then** "Visual" chip is active (blue border + tint)
**And** "Layout" and "System" chips are inactive
**And** clicking "Layout" chip navigates to the Layout flags

### Requirement: Arrow navigation between categories
Previous/next arrow buttons below the flags SHALL allow sequential navigation.

#### Scenario: User on Layout category
**Given** the current category is Layout (page 2 of 3)
**When** the arrow nav renders
**Then** "<- Visual" button is visible on the left
**And** "System ->" button is visible on the right

#### Scenario: User on first category
**Given** the current category is Visual (page 1 of 3)
**Then** the left arrow is disabled or hidden
**And** "Layout ->" button is visible on the right

### Requirement: Page dots indicator
3 small dots below the flags SHALL indicate the current page position.

#### Scenario: User on second category
**Given** the current category is Layout (page 2)
**When** the dots render
**Then** dot 2 is active (blue) and dots 1 and 3 are inactive (gray)

## ADDED Requirements

### Requirement: Category definitions
Flag categories MUST be defined as a constant and map each flag to a group.

#### Scenario: Categories constant
**Given** FLAG_CATEGORIES is defined
**Then** Visual contains: pixel-engine, ascii-donut, parallax, terminal-matrix
**And** Layout contains: view-transitions, wip-banner, elevator
**And** System contains: os-desktop, social-links, command-palette
