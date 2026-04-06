# Spec: Mobile Section Compartments

## Requirements

### R1: Section Compartment Display
The admin SHALL render each section within the current page as a collapsible compartment.

### R2: Collapsed State
Each collapsed compartment SHALL display:
- Section type icon (from registry.ts)
- Section type label (uppercase, monospace)
- Visibility status dot (green = visible, gray = hidden)
- Entry count badge (if section has a dataTable)
- Expand/collapse chevron

### R3: Expanded State
Each expanded compartment SHALL display:
- Bookmark tab bar: CONTENT | STYLE | LAYOUT
- Active bookmark content panel
- CONTENT bookmark as the default active tab

### R4: Accordion Behavior
Only one compartment SHALL be expanded at a time. Expanding a compartment SHALL collapse the previously expanded one.

### R5: CSS Dividers
Each compartment SHALL be separated from adjacent compartments by `1px solid var(--border-color-subtle)`.

### R6: Control Group Organization
Within each bookmark, controls SHALL be organized into labeled groups. Each group SHALL have:
- A top border: `1px solid var(--border-color-subtle)`
- A heading label: `.admin-label--2xs` (7px, monospace, uppercase)
- Padding: `var(--admin-space-3, 12px)` above and below

## Acceptance Scenarios

### Scenario: Viewing collapsed compartments on mobile
```
Given I am on /admin on a 414px viewport
And the Home page is selected
And Home has sections: [hero, works-grid, blog-feed]
Then I see three collapsed compartment rows
And each row shows the section icon, label, and status indicators
And compartment rows are separated by 1px subtle borders
```

### Scenario: Expanding a compartment
```
Given I see three collapsed compartments
When I tap the "HERO" compartment header
Then the hero compartment expands
And I see bookmark tabs: CONTENT | STYLE | LAYOUT
And CONTENT is the active tab by default
And the compartment scrolls into view smoothly
```

### Scenario: Accordion — only one open at a time
```
Given the "HERO" compartment is expanded
When I tap the "WORKS GRID" compartment header
Then the "HERO" compartment collapses
And the "WORKS GRID" compartment expands
And only one compartment is expanded at any time
```

### Scenario: Switching bookmark tabs
```
Given the "HERO" compartment is expanded
And the CONTENT tab is active
When I tap the STYLE tab
Then the STYLE bookmark content is displayed
And typography, color, and animation control groups are visible
And each group has a labeled heading and top border divider
```

### Scenario: Content bookmark shows section-specific editor
```
Given the "WORKS GRID" compartment is expanded
And the CONTENT tab is active
Then I see the WorksAdmin component (in compact mode)
And I can create, edit, delete, reorder, and toggle visibility of work entries
And all CRUD operations call the existing Convex mutations
```

### Scenario: Style bookmark shows all visual modifiers
```
Given the "HERO" compartment is expanded
And the STYLE tab is active
Then I see three control groups: TYPOGRAPHY, COLOR, ANIMATION
And TYPOGRAPHY contains: size slider, weight chips, tracking slider, leading slider, wrap chips
And COLOR contains: accent color picker
And ANIMATION contains: ASCII donut toggle, ASCII wave toggle, pixel art toggle, velocity toggle
And each control group is separated by a 1px border with a labeled heading
```

### Scenario: Layout bookmark shows structural controls
```
Given any compartment is expanded
And the LAYOUT tab is active
Then I see control groups: VISIBILITY, SPACING, POSITION
And VISIBILITY contains: a green toggle to show/hide the section
And SPACING contains: preset chips (none/sm/md/lg/xl) and box model diagram
And POSITION contains: move up/down buttons and remove section button
```

### Scenario: Keyboard navigation
```
Given I am focused on a compartment header
When I press Enter or Space
Then the compartment toggles expanded/collapsed

Given I am focused on bookmark tabs
When I press arrow keys left/right
Then focus moves between CONTENT, STYLE, LAYOUT tabs
And the active tab switches accordingly
```
