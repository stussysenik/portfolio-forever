# Refine Layout and Navigation

## Refinements

### Elevator Component
- **Positioning:** Moved from `right: var(--space-lg)` to `right: clamp(var(--space-md), 5vw, var(--space-xl))` to ensure it doesn't touch the screen edge on wide viewports and remains ergonomically reachable on smaller ones.
- **Navigation:** Added a "GO TO LOBBY" link that smoothly scrolls to the top and resets the SPA state to the home section.
- **Visuals:** Refined backdrop-filter (12px blur) and shadow for better separation from content.

### Shell Layout (BaseLayout.astro)
- **Sidebar:** Updated width to `clamp(16rem, 18vw, 22rem)` and refined padding for a more "airy" feel on large displays. Added a structural `border-right`.
- **Main Area:** Adjusted margins and padding to match the sidebar's fluid width. Increased bottom padding to `12rem` to ensure the terminal footer and elevator don't overlap with content.
- **Terminal Footer:** Refined positioning using `clamp` and added `backdrop-filter` for better legibility over scrolled content.

### Admin Experience
- **Overview:** Added a high-contrast "Visit live portfolio" link to the overview strip for faster switching between admin and public views.
- **Preview Integration:** Verified `SanityVisualEditing` and `DisableDraftMode` components are correctly active in the live view shell.

## Validation
- [x] Elevator doesn't touch right edge on ultra-wide screens.
- [x] Human ergonomics: sidebar scales proportionally with screen width.
- [x] Breakpoints: layout remains balanced from 320px to desktop.
- [x] Admin-to-Live navigation loop is complete.
