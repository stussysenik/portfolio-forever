# Spec: Font Switching System

## ADDED Requirements

### Requirement: Multiple Font Options
The system SHALL provide multiple font family options for user selection.

#### Scenario: User selects serif font for better readability
**Given** a user prefers serif fonts for reading comfort
**When** they open the font switcher and select "Crimson Pro"
**Then** all body text renders in Crimson Pro (serif)
**And** monospace code blocks remain in monospace font (independent)
**And** the font loads with font-display: swap to prevent text blocking

#### Scenario: User selects monospace font for tech aesthetic
**Given** a developer wants monospace everywhere
**When** they select "JetBrains Mono" as primary font
**Then** all text (body and code) renders in JetBrains Mono
**And** the site maintains readability at all breakpoints

#### Scenario: User selects display font for modern look
**Given** a user wants a contemporary geometric sans
**When** they select "Space Grotesk"
**Then** headings and body text render in Space Grotesk
**And** the font loads successfully without layout shift

### Requirement: Font Persistence
User font selection SHALL persist across browser sessions.

#### Scenario: User returns to site after selecting font
**Given** a user has selected "Crimson Pro" font
**When** they close and reopen the browser
**Then** the site loads with "Crimson Pro" applied
**And** fonts load efficiently without visible font flash

### Requirement: Font Switcher UI Component
The system SHALL provide an accessible UI for font selection.

#### Scenario: User opens font switcher with keyboard
**Given** the user is on any page
**When** they press the 'F' key
**Then** a font selector modal/dropdown opens
**And** focus moves to the font selector
**And** user can navigate options with arrow keys
**And** pressing Enter selects the focused font

#### Scenario: User previews font before selection
**Given** the font switcher is open
**When** the user hovers or focuses on a font option
**Then** a preview of sample text in that font is displayed
**And** the preview shows the font name, category, and example text

### Requirement: CSS Custom Property Integration
Font switching SHALL update CSS custom properties dynamically.

#### Scenario: Font change applies site-wide instantly
**Given** a user selects a new font
**When** the selection is confirmed
**Then** the `data-font` attribute updates on `<html>` element
**And** CSS custom properties (--font-sans, --font-mono) update
**And** all text re-renders immediately without page reload
**And** localStorage saves the preference

### Requirement: Performance Optimization
Font loading SHALL NOT negatively impact site performance.

#### Scenario: Initial page load with custom font
**Given** a user with no cached fonts visits the site
**When** the page loads
**Then** text is visible immediately with fallback fonts (FOIT prevention)
**And** custom fonts swap in within 3 seconds
**And** no layout shift occurs (CLS < 0.1)
**And** Lighthouse performance score remains > 90

#### Scenario: Subsequent page loads use cached fonts
**Given** a user has previously loaded custom fonts
**When** they navigate to another page
**Then** fonts render immediately from browser cache
**And** no additional network requests for fonts occur

## MODIFIED Requirements

None - this is a new feature addition.

## REMOVED Requirements

None.

---

## Design Notes

### Font Options
The following fonts SHALL be available for selection:

| Font ID | Font Name | Category | Use Case |
|---------|-----------|----------|----------|
| `inter` | Inter | Sans-serif | Default, clean modern UI |
| `crimson` | Crimson Pro | Serif | Enhanced readability, traditional |
| `jetbrains` | JetBrains Mono | Monospace | Developer aesthetic, code-first |
| `fira` | Fira Code | Monospace | Alternative mono with ligatures |
| `space` | Space Grotesk | Display | Geometric, contemporary |

### Font Loading Strategy
```css
/* Load fonts with display:swap */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Crimson+Pro:wght@300;400;600&family=JetBrains+Mono:wght@300;400;500&family=Fira+Code:wght@300;400;500&family=Space+Grotesk:wght@300;400;500;700&display=swap');
```

### CSS Custom Property Structure
```css
:root[data-font="inter"] {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

:root[data-font="crimson"] {
  --font-sans: 'Crimson Pro', Georgia, 'Times New Roman', serif;
}

:root[data-font="jetbrains"] {
  --font-sans: 'JetBrains Mono', 'SF Mono', Consolas, monospace;
  --font-mono: 'JetBrains Mono', 'SF Mono', Consolas, monospace;
}

:root[data-font="fira"] {
  --font-sans: 'Fira Code', 'Cascadia Code', monospace;
  --font-mono: 'Fira Code', 'Cascadia Code', monospace;
}

:root[data-font="space"] {
  --font-sans: 'Space Grotesk', system-ui, sans-serif;
}
```

### Component Structure
**FontSwitcher.svelte** SHALL export:
- `currentFont: string` - Currently selected font ID
- Event: `on:change` - Fires when font selection changes

### Accessibility Requirements
- Keyboard navigation: Arrow keys + Enter
- Screen reader announcements: "Font changed to [Font Name]"
- Focus management: Return focus after selection
- ARIA labels: aria-label="Font selector" on trigger button

### Cross-References
- Related to: `color-themes` spec (fonts must render well in all themes)
- Impacts: `app.css`, `ThemeSwitcher.svelte`, font loading in `+layout.svelte`
