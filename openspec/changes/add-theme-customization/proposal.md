# Proposal: Add Theme Customization System

## Overview
Replace existing theme system with three new accessibility-focused color palettes, add live font switching capability, and enhance footer with attribution.

## Problem Statement
The current portfolio uses three themes (minimal, terminal, paper) that don't fully address:
1. **Accessibility needs** - No high-contrast theme optimized for users with visual impairments
2. **Design diversity** - Themes don't clearly represent the three intended aesthetics: accessibility-first, minimalist, and tech/developer
3. **Typography flexibility** - Users cannot change fonts to suit their reading preferences
4. **Attribution** - Missing a personalized footer attribution with location and year

## Proposed Solution
Transform the theming system to provide:

### 1. Three New Color Palettes
- **Accessible Theme** (`accessible`): High-contrast, WCAG AAA compliant, optimized for readability
- **Minimal Theme** (`minimal`): Clean, spacious, refined minimalist aesthetic
- **Terminal Theme** (`terminal`): Tech-focused, developer-oriented with matrix/sci-fi vibes

### 2. Live Font Switching
- Add font selector with multiple typeface options:
  - **Sans-serif**: Inter (current), Helvetica/Arial fallback
  - **Serif**: Crimson Pro, Georgia fallback
  - **Monospace**: JetBrains Mono (current), Fira Code, Consolas fallback
  - **Display/Alternative**: Space Grotesk or similar
- Persist font selection in localStorage
- Update all font references dynamically via CSS custom properties

### 3. Enhanced Footer
- Add copyright footer: "© 2026 Made with 💙 in BedStuy"
- Use blue heart emoji instead of red
- Integrate into existing page footer section (before elevator)
- Style consistently with site's design system

## Impact & Benefits
- **Accessibility**: Users with visual impairments get optimized high-contrast theme
- **Personalization**: Users can customize typography for comfortable reading
- **Brand identity**: Clear thematic options that reflect site's design philosophy
- **User engagement**: Interactive customization increases time on site

## Dependencies
- Google Fonts API (for loading additional fonts)
- Existing theme switching infrastructure (ThemeSwitcher.svelte)
- CSS custom property system (already in place)

## Alternatives Considered
1. **Keep existing themes + add more** - Rejected: Too many options can overwhelm users
2. **Only toggle between light/dark** - Rejected: Doesn't satisfy accessibility and customization goals
3. **Use system font stack only** - Rejected: Limits typographic expression

## Success Criteria
- [ ] All three new themes pass WCAG AA contrast requirements (AAA for accessible theme)
- [ ] Font switching works without page reload
- [ ] Theme and font preferences persist across sessions
- [ ] Footer displays correctly on all screen sizes
- [ ] No performance degradation from font loading
