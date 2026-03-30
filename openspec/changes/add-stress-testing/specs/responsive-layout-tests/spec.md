# Spec: Responsive Layout Tests

## ADDED Requirements

### Requirement: Layout SHALL be verified at all major breakpoints
Every page MUST render without overlap, overflow, or broken layouts at mobile (375px), tablet (768px), and desktop (1280px+) viewports.

#### Scenario: No element overlaps at any breakpoint
**Given** a page is loaded at viewport widths 375px, 768px, 1024px, 1280px, 1920px
**When** the overlap detector scans all visible elements
**Then** zero overlapping element pairs with area > 100px² are found

#### Scenario: Footer renders gracefully on mobile
**Given** the page is viewed at 375px width
**When** the footer is visible
**Then** the footer content fits without horizontal overflow

#### Scenario: Navigation adapts on mobile
**Given** viewport width < 768px
**When** the header navigation is rendered
**Then** nav links are displayed in a compact scrollable layout
**And** no nav items are clipped or hidden

#### Scenario: Works grid adapts from 1-column to 2-column
**Given** the /works page is loaded
**When** viewport width < 768px
**Then** the grid uses 1 column
**When** viewport width >= 768px
**Then** the grid uses 2 columns

#### Scenario: Tablet landscape layout works
**Given** an iPad in landscape orientation (1024x768)
**When** any page is loaded
**Then** content uses the tablet/desktop grid
**And** no horizontal scrollbar appears

#### Scenario: Touch targets meet minimum size on mobile
**Given** viewport width <= 768px
**When** all interactive elements are measured
**Then** each has a tap target of at least 44x44px

#### Scenario: Content reflows during resize
**Given** the page is loaded at 1920px desktop width
**When** the viewport is progressively resized to 375px
**Then** no content breaks, overlaps, or disappears at any width

#### Scenario: iPad Pro renders correctly
**Given** an iPad Pro viewport (1024x1366)
**When** any page is loaded
**Then** the layout uses the expected grid columns
**And** container padding matches the breakpoint

## Related Capabilities
- [playwright-interaction-tests](../playwright-interaction-tests/spec.md)
