# Spec: Preview Drawer

## Requirements

### R1: Availability
The preview drawer SHALL be available on viewports < 1024px (mobile and tablet). It SHALL be hidden on desktop where the live preview pane exists.

### R2: Persistent Handle
A grab handle (36px wide, 4px tall, centered, `var(--border-color)` background) SHALL be persistently visible at the bottom of the admin viewport.

### R3: Open Behavior
Tapping or pulling up the handle SHALL open the drawer as a BottomSheet overlay. The drawer SHALL slide up with 120ms ease animation.

### R4: Content
The drawer SHALL contain an iframe pointing to the live site URL. The iframe SHALL reflect real-time Convex data changes without manual refresh.

### R5: Dimensions
The drawer SHALL have max-height of 70vh. The page bar SHALL remain visible above the drawer for context.

### R6: Dismissal
The drawer SHALL close on:
- Swiping down
- Tapping the backdrop
- Pressing Escape
- Tapping a "DONE" button in the drawer header

### R7: Lazy Loading
The iframe SHALL only mount when the drawer is opened. It SHALL unmount when the drawer is closed to conserve resources.

## Acceptance Scenarios

### Scenario: Opening preview on mobile
```
Given I am on /admin on a 414px viewport
And I see the grab handle at the bottom
When I tap the grab handle
Then a bottom sheet slides up (120ms ease)
And I see the live site in an iframe
And the iframe reflects the current state of my portfolio
And the page bar (current page name) is still visible above the drawer
```

### Scenario: Real-time sync in preview
```
Given the preview drawer is open
And I see my hero section displaying "Engineer"
When I close the drawer
And I change my tagline to "Designer" in the hero CONTENT bookmark
And I open the preview drawer again
Then the preview shows "Designer" (synced via Convex)
```

### Scenario: Dismissing preview
```
Given the preview drawer is open
When I swipe down on the drawer
Then the drawer slides down and closes (120ms ease)
And the grab handle returns to the bottom of the viewport
```

### Scenario: Preview hidden on desktop
```
Given I am on /admin on a 1440px viewport
Then the preview drawer handle is NOT visible
And the live preview pane on the right side of the admin is visible instead
```
