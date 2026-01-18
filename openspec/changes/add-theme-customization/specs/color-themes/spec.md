# Spec: Color Theme System

## ADDED Requirements

### Requirement: Three Distinct Color Palettes
The system SHALL provide three theme options with distinct visual identities and use cases.

#### Scenario: User selects Accessible theme
**Given** a user with visual impairments visits the site
**When** they select the "Accessible" theme
**Then** the site displays with high-contrast colors (WCAG AAA compliant, >7:1 ratio)
**And** all interactive elements have clearly visible focus indicators
**And** text is rendered in pure black (#000000) on pure white (#FFFFFF) backgrounds

#### Scenario: User selects Minimal theme
**Given** a user who prefers clean, refined aesthetics
**When** they select the "Minimal" theme
**Then** the site displays with soft neutral colors and warm undertones
**And** backgrounds use warm white (#FAFAF9) with subtle borders (#E5E5E5)
**And** text uses near-black (#1A1A1A) for primary content

#### Scenario: User selects Terminal theme
**Given** a developer or tech-oriented user
**When** they select the "Terminal" theme
**Then** the site displays with dark background (#0D1117) and light text (#E6EDF3)
**And** accent colors use electric cyan (#00D9FF) or matrix green (#00FF41)
**And** the overall aesthetic evokes terminal/developer tools

### Requirement: Theme Persistence
User theme selection SHALL persist across browser sessions.

#### Scenario: User returns after closing browser
**Given** a user has selected the "Terminal" theme
**When** they close the browser and return later
**Then** the site automatically loads with the "Terminal" theme
**And** no flash of unstyled content occurs

### Requirement: Theme Switching via Keyboard
Users SHALL be able to switch themes using keyboard shortcut.

#### Scenario: User presses 'T' key to cycle themes
**Given** the user is on any page
**When** they press the 'T' key
**Then** the theme cycles to the next option (Accessible → Minimal → Terminal → Accessible)
**And** a screen reader announces "Theme changed to [theme name]"

### Requirement: CSS Custom Property Architecture
Themes SHALL be implemented using CSS custom properties for maintainability.

#### Scenario: Developer adds new component
**Given** a developer creates a new UI component
**When** they use standard CSS custom properties (--color-bg, --color-text, etc.)
**Then** the component automatically adapts to all theme switches
**And** no theme-specific component code is required

## MODIFIED Requirements

### Requirement: Theme Options (previously had minimal/terminal/paper)
The ThemeSwitcher component theme options SHALL be updated from `['minimal', 'terminal', 'paper']` to `['accessible', 'minimal', 'terminal']`.

#### Scenario: Existing theme preference migration
**Given** a user previously selected the "paper" theme
**When** they visit the site after the update
**Then** their theme preference defaults to "minimal" (closest match)
**And** localStorage is updated with the new theme ID

## REMOVED Requirements

None - this is a theme replacement, not a removal of theming functionality.

---

## Design Notes

### Color Palette Reference

**Accessible Theme**:
```css
--color-bg: #FFFFFF
--color-surface: #F5F5F5
--color-text: #000000
--color-text-secondary: #333333
--color-accent: #0066CC
--color-border: #333333
```

**Minimal Theme**:
```css
--color-bg: #FAFAF9
--color-surface: #FFFFFF
--color-text: #1A1A1A
--color-text-secondary: #525252
--color-accent: #2563EB
--color-border: #E5E5E5
```

**Terminal Theme**:
```css
--color-bg: #0D1117
--color-surface: #161B22
--color-text: #E6EDF3
--color-text-secondary: #7D8590
--color-accent: #00D9FF
--color-border: #30363D
```

### Accessibility Standards
- Accessible theme: WCAG AAA (7:1 minimum contrast)
- Minimal & Terminal themes: WCAG AA (4.5:1 minimum for body text, 3:1 for large text)

### Cross-References
- Related to: `font-switching` spec (font + theme combinations must work together)
- Impacts: All UI components site-wide
