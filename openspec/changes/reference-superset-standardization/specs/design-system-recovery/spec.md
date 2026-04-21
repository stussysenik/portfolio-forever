# Spec: Design System Recovery

## ADDED Requirements

### Requirement: Themes, typography, and emphasis behaviors SHALL resolve to one canonical public system
The portfolio SHALL standardize themes, palette logic, typography behavior, and emphasis treatments so that the site reads as one locked design language.

#### Scenario: User changes theme or font
**Given** the public site exposes theme and font switching
**When** the user changes those settings
**Then** the resulting color, type, spacing, and emphasis behavior remains coherent across all major public routes
**And** the switch does not expose route-level inconsistencies that imply multiple competing design systems

### Requirement: Highlight and entry-emphasis behavior SHALL be intentional and reusable
Highlight colors, entry emphasis, and related interaction cues SHALL be governed by reusable rules rather than ad hoc route-specific styling.

#### Scenario: User views highlighted entries across multiple routes
**Given** highlighted content appears on the homepage, works, or related sections
**When** the user moves between those routes
**Then** highlight behavior feels recognizably related
**And** the emphasis system supports route-specific variation without becoming visually inconsistent

### Requirement: Footer, status, and motion cues SHALL belong to the same system as layout and color
Footer language, status framing, and motion cues SHALL be treated as first-class parts of the design system.

#### Scenario: User experiences the public site over multiple routes
**Given** the user navigates between major public routes
**When** footer, status, and motion cues appear
**Then** those cues reinforce the same design language as themes, typography, and layout
**And** they do not feel like isolated historical leftovers from a different version of the site
