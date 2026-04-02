# Spec: Chip Component Standardization

## MODIFIED Requirements

### Requirement: All chip groups use 2px border-radius rectangles
Every chip/button group in the admin UI MUST use the `AdminChipGroup` primitive with consistent 2px border-radius.

#### Scenario: Weight buttons render
**Given** the hero typography weight control renders
**Then** all weight chips (100-900) have 2px border-radius
**And** the active chip has solid blue fill + white text
**And** inactive chips have transparent bg + subtle border

#### Scenario: Wrap buttons render
**Given** the hero wrap control renders
**Then** WRAP, NOWRAP, BALANCE, PRETTY chips have 2px border-radius
**And** chips use equal-width layout (each fills available space evenly)

#### Scenario: View mode buttons render
**Given** a section view mode control renders
**Then** grid, case-study, minimal-list chips have 2px border-radius
**And** chips use equal-width layout

### Requirement: No inline chip markup
All chip-like controls MUST use the `AdminChipGroup` Svelte component, not custom inline HTML.

#### Scenario: Audit finds inline chips
**Given** any admin component renders chip-like buttons
**Then** those buttons are rendered via `AdminChipGroup` component
**And** not via custom inline `<button>` or `<span>` elements with ad-hoc styling
