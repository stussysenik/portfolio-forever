# Spec: Site Header (Public Site Chrome)

## ADDED Requirements

### Requirement: Header renders as a single horizontal line at every supported viewport
The public site header SHALL render as a single horizontal row — name, primary navigation (where applicable), and a fold trigger — at every viewport width from 320px through 2200px. No flex-wrap, no column stacking, no second row ever visible in the resting state.

#### Scenario: Galaxy S8 portrait (360×740)
**Given** the public site is loaded at 360×740 CSS pixels
**When** the header paints
**Then** `.header-inner` renders exactly two elements on its oneliner — the site name and a fold trigger labeled `index ↗`
**And** the header height is a single line of `--font-size-xs` text plus its padding
**And** no primary-nav link and no social link is visible in the resting state
**And** the fold trigger is focusable and has `aria-expanded="false"`

#### Scenario: iPhone 15 portrait (393×852)
**Given** the public site is loaded at 393×852
**When** the header paints
**Then** `.header-inner` renders exactly two elements on its oneliner — the site name and the fold trigger
**And** the oneliner fits without clipping or horizontal scroll

#### Scenario: iPad portrait (768×1024)
**Given** the public site is loaded at 768×1024
**When** the header paints
**Then** `.header-inner` renders the site name, every primary nav link, and the fold trigger on a single row
**And** the primary nav links render in their declared order
**And** no external social link is visible in the resting state
**And** the row does not wrap

#### Scenario: iPad landscape (1024×768)
**Given** the public site is loaded at 1024×768
**When** the header paints
**Then** `.header-inner` renders name + primary nav + fold trigger on one row

#### Scenario: 1340px laptop viewport
**Given** the public site is loaded at 1340×1500
**When** the header paints
**Then** `.header-inner` renders name + primary nav + fold trigger on one row
**And** there is measurable horizontal slack between the fold trigger and the container edge

#### Scenario: 1920px desktop viewport
**Given** the public site is loaded at 1920×1080
**When** the header paints
**Then** `.header-inner` renders name + primary nav + fold trigger on one row

#### Scenario: Container-max 2200px ultrawide
**Given** the public site is loaded at 2400px wide
**When** the header paints
**Then** `.header-inner` respects `--container-max: 2200px` and remains a single row centered within the viewport

### Requirement: Fold trigger opens and closes the header fold panel
The header SHALL expose a single `<button>` labeled `index ↗` that toggles the visibility of the folded navigation payload. The button reflects state via `aria-expanded` and controls the fold panel via `aria-controls`.

#### Scenario: Trigger is focusable and labeled
**Given** the header is rendered at any supported width
**When** a user Tab-navigates from the site name
**Then** the next focus target is the fold trigger button
**And** the button's accessible name is `index`
**And** the button has `aria-expanded` and `aria-controls` attributes

#### Scenario: Click opens the fold
**Given** the fold trigger has `aria-expanded="false"`
**When** the user clicks or taps the trigger
**Then** `aria-expanded` becomes `"true"`
**And** the fold panel becomes visible
**And** all link children inside the fold panel become focusable in the tab order
**And** focus stays on the trigger (does not jump into the panel)

#### Scenario: Second click closes the fold
**Given** the fold trigger has `aria-expanded="true"`
**When** the user clicks or taps the trigger again
**Then** `aria-expanded` becomes `"false"`
**And** the fold panel becomes visually hidden
**And** link children inside the fold panel are removed from the tab order

#### Scenario: Escape closes the fold and restores focus
**Given** the fold is open and a link inside it has keyboard focus
**When** the user presses `Escape`
**Then** the fold closes
**And** keyboard focus returns to the fold trigger

#### Scenario: Click outside closes the fold
**Given** the fold is open
**When** the user clicks anywhere outside the header and outside the fold panel
**Then** the fold closes

### Requirement: Fold uses adaptive axis — horizontal at ≥768px, vertical at <768px
The fold panel's unfold axis SHALL depend on the viewport width. At ≥768px it unfolds horizontally inline at the trailing edge of the header. At <768px it unfolds vertically as a drop panel below the top-frame.

#### Scenario: Horizontal unfold at ≥768px
**Given** the viewport is 1024px wide and the fold is closed
**When** the user clicks the trigger
**Then** the fold panel's children animate from `transform: rotateY(-90deg)` to `transform: rotateY(0deg)`
**And** the panel's hinge origin is its left edge
**And** opening does not change the header's height
**And** opening does not push any other element on the page

#### Scenario: Vertical unfold at <768px
**Given** the viewport is 360px wide and the fold is closed
**When** the user taps the trigger
**Then** the fold panel animates from `transform: rotateX(-90deg)` to `transform: rotateX(0deg)`
**And** the panel's hinge origin is its top edge
**And** the panel renders as an overlay below the top-frame, not displacing main content
**And** the header row height does not change

#### Scenario: No layout shift
**Given** any supported viewport width
**When** the fold opens or closes
**Then** the Cumulative Layout Shift (CLS) score for that frame is 0
**And** no element outside the fold panel moves in any dimension

### Requirement: Fold payload differs by viewport tier
The fold panel SHALL render different child content depending on the viewport tier. At ≥768px it SHALL hold only the external social links. At <768px it SHALL hold the primary nav links followed by the external social links.

#### Scenario: Desktop fold contents
**Given** the viewport is 1024px wide
**When** the user opens the fold
**Then** the fold panel renders one link element per entry in the external social-links data source
**And** no primary nav link appears inside the fold panel (those remain on the oneliner)

#### Scenario: Mobile fold contents
**Given** the viewport is 360px wide
**When** the user opens the fold
**Then** the fold panel renders the primary nav links first, in declared order
**And** the external social links follow, in declared order
**And** the two groups are visually separated by the existing `.nav-sep` token or equivalent

#### Scenario: Viewport crosses the 768px threshold while fold is open
**Given** the fold is open at 400px wide
**When** the user resizes the viewport to 900px wide
**Then** the fold panel re-renders with the ≥768px payload (socials only)
**And** the axis changes from vertical to horizontal
**And** the fold remains open

### Requirement: Primary nav links are visible on the oneliner at ≥768px
At viewports 768px and wider, the primary navigation links SHALL render directly on the header oneliner, not inside the fold panel.

#### Scenario: iPad portrait shows primary nav inline
**Given** the viewport is 768×1024
**When** the header paints
**Then** every entry in the primary `navItems` array is rendered as a visible `<a>` element between the site name and the fold trigger
**And** each nav link is keyboard-focusable in declared order

#### Scenario: Active nav link is visually distinct
**Given** the user is on the route matching a primary nav link
**When** the header paints
**Then** the matching `<a>` has the `.active` class or equivalent styling
**And** the active state's visual treatment (underline, weight, color) matches the existing active-link treatment

### Requirement: Reduced motion honors user preference
When `prefers-reduced-motion: reduce` is set, the fold SHALL omit all `transform` transitions and use opacity-only fade.

#### Scenario: Reduced-motion user opens the fold
**Given** the user agent reports `prefers-reduced-motion: reduce`
**When** the user opens the fold
**Then** no `rotateX` or `rotateY` transform is applied during the transition
**And** the fold panel fades in via `opacity` only
**And** the transition duration does not exceed `var(--duration-fast)` (120ms)

### Requirement: Fold trigger label is icon-free and editorial
The fold trigger's visible label SHALL be a text token only, using standard Unicode characters. No emoji, no icon font, no SVG glyph.

#### Scenario: Trigger renders as plain text
**Given** any supported viewport
**When** the header paints
**Then** the fold trigger renders the string `index ↗` using the same font stack as `.nav-link`
**And** the `↗` character is Unicode U+2197 (NORTH EAST ARROW), not an emoji or image
**And** the trigger contains no `<img>`, `<svg>`, or `background-image` descendants

### Requirement: External social links render with solid brand colors
External social links SHALL render with solid, opaque colors. No `background-clip: text` + gradient fill SHALL be used on link text.

#### Scenario: Inspect social link hover on desktop
**Given** the fold is open at 1024px wide
**When** the user hovers any external social link
**Then** the link's `color` resolves to a single opaque value (no `transparent` with `background-clip: text`)
**And** the hover treatment uses the existing `.nav-link::after` underline crescendo, not a gradient fill

#### Scenario: Grep audit of layout stylesheet
**Given** the file `src/routes/+layout.svelte`
**When** the file is scanned for `background-clip: text` or `-webkit-background-clip: text`
**Then** no occurrence remains in any selector that targets `.nav-link` or its descendants

### Requirement: Header height is constant regardless of fold state
The header row height SHALL NOT change when the fold opens, closes, or animates at any viewport width.

#### Scenario: Measure header height across fold state
**Given** any supported viewport
**When** the fold state changes from closed to open to closed
**Then** the computed `height` of `.header-inner` is identical in both states
**And** the `.top-frame` fixed element does not change its `bottom` coordinate
**And** the `main-content` element's `padding-top` remains its declared value

### Requirement: Fold does not introduce modal semantics
The fold panel SHALL be a disclosure, not a modal. Body scroll SHALL NOT be locked, focus SHALL NOT be trapped, and the page underneath SHALL remain interactive.

#### Scenario: Background content remains scrollable on mobile
**Given** the viewport is 360px wide and the fold is open
**When** the user swipes on the main content area (outside the fold panel)
**Then** the page scrolls normally
**And** the fold closes as a side effect of the outside interaction (per the click-outside rule)

#### Scenario: No focus trap
**Given** the fold is open
**When** the user Shift+Tabs backward from the first link inside the fold
**Then** focus moves to the fold trigger
**And** continuing to Shift+Tab moves focus outside the header into earlier page content
**And** at no point does focus loop back into the fold panel
