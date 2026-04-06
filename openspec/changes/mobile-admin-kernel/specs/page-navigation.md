# Spec: Page Navigation — Crystal Clear Context

## Requirements

### R1: Always Visible Page Context
The current page name SHALL always be visible on screen regardless of scroll position. On mobile, this is the PageBar pinned between the topbar and the compartment list.

### R2: Page Switching
Pages SHALL be switchable via horizontal scroll pills. Tapping a pill SHALL:
- Load that page's sections into the compartment list
- Collapse any expanded compartments
- Update the page heading

### R3: Page Indicators
Each page pill SHALL display:
- Page label (uppercase, monospace)
- Visibility dot (green = visible, gray = hidden)
- Section count (optional, subtle)

### R4: Active Page Distinction
The active page pill SHALL be visually distinct from inactive pills (inverted colors: light background with dark text, matching existing `.pill-active` pattern).

### R5: Touch Targets
All page pills SHALL meet 44px minimum touch target height.

## Acceptance Scenarios

### Scenario: Identifying current page
```
Given I am on /admin on a 414px viewport
And the Home page is selected
Then I see "Home" prominently at the top (or as the active pill)
And it is always visible even when scrolling through compartments
```

### Scenario: Switching pages
```
Given I am on the Home page
And the HERO compartment is expanded
When I tap the "WORKS" page pill
Then the compartments update to show the Works page's sections
And no compartment is expanded (fresh state)
And "WORKS" pill shows as active
```

### Scenario: Horizontal scroll on many pages
```
Given there are 12 pages configured
And the viewport is 414px
Then the page pills are horizontally scrollable
And scrollbar is hidden (clean appearance)
And I can swipe to reveal offscreen page pills
```

### Scenario: Page visibility indicator
```
Given the "CV" page has visible: false
Then the CV page pill shows a gray dot (not green)
```
