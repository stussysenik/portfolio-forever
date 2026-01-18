# Spec: Footer Attribution

## ADDED Requirements

### Requirement: Copyright Attribution Footer
The site SHALL display a copyright and attribution message in the footer.

#### Scenario: User scrolls to bottom of page
**Given** a user is viewing the homepage
**When** they scroll to the bottom of the page
**Then** they see the text "© 2026 Made with 💙 in BedStuy"
**And** the heart emoji is displayed in blue (#3B82F6)
**And** the footer is positioned above the terminal footer
**And** the text is center-aligned

### Requirement: Blue Heart Emoji
The heart emoji SHALL be styled with blue color instead of default red.

#### Scenario: Footer renders with blue heart
**Given** the footer is displayed
**When** the page loads
**Then** the heart emoji (💙) appears in blue color (#3B82F6)
**And** the heart has a subtle animation (optional heartbeat)

### Requirement: Responsive Footer Styling
The footer SHALL adapt to different screen sizes.

#### Scenario: Footer on mobile devices
**Given** a user views the site on mobile (< 768px width)
**When** they scroll to the footer
**Then** the text remains readable and centered
**And** the font size adjusts appropriately (--font-size-sm)
**And** adequate padding prevents overlap with terminal footer

#### Scenario: Footer on desktop
**Given** a user views the site on desktop (> 1024px width)
**When** they view the footer
**Then** the footer displays with comfortable spacing
**And** maintains visual hierarchy with other page elements

### Requirement: Theme Compatibility
The footer SHALL adapt colors based on active theme.

#### Scenario: Footer in Accessible theme
**Given** the user has "Accessible" theme active
**When** the footer renders
**Then** the text color uses --color-text-secondary
**And** maintains WCAG AAA contrast with background
**And** the blue heart remains visible and accessible

#### Scenario: Footer in Terminal theme
**Given** the user has "Terminal" theme active
**When** the footer renders
**Then** the text color adapts to the dark theme
**And** the blue heart color (#3B82F6) provides adequate contrast
**And** the footer integrates visually with the dark aesthetic

## MODIFIED Requirements

### Requirement: Page Footer Layout
The existing page footer section SHALL be enhanced to include attribution.

#### Scenario: Enhanced footer with attribution and EOF
**Given** the page footer currently displays "/* EOF */"
**When** the page renders after enhancement
**Then** the footer displays attribution above EOF comment
**And** maintains vertical spacing between elements
**And** both elements are visually distinct

## REMOVED Requirements

None - this is an addition, not a removal.

---

## Design Notes

### Markup Structure
```svelte
<footer class="page-footer">
  <div class="copyright">
    © 2026 Made with <span class="heart">💙</span> in BedStuy
  </div>
  <div class="eof-comment">/* EOF */</div>
</footer>
```

### Styling
```css
.page-footer {
  margin-top: var(--space-2xl);
  margin-bottom: var(--space-xl);
  text-align: center;
}

.page-footer .copyright {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-md);
  font-weight: 400;
}

.page-footer .heart {
  color: #3B82F6; /* Blue-500 */
  display: inline-block;
  animation: heartbeat 2s ease-in-out infinite;
}

.page-footer .eof-comment {
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  opacity: 0.5;
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  10% { transform: scale(1.15); }
  20% { transform: scale(1); }
}
```

### Animation Details
- **Heartbeat animation**: Optional subtle pulse every 2 seconds
- **Transform scale**: 1.0 → 1.15 → 1.0
- **Timing**: Ease-in-out for smooth animation
- **Performance**: Uses transform (GPU-accelerated)

### Location
- **File**: `src/routes/+page.svelte`
- **Position**: Within existing `.page-footer` section (around line 600)
- **Context**: Above EOF comment, before Elevator component

### Accessibility
- Text remains readable in all themes
- Heart emoji has adequate contrast (blue on light/dark backgrounds)
- Screen readers read "copyright 2026 Made with blue heart in BedStuy"

### Cross-References
- Related to: `color-themes` spec (theme-aware text colors)
- Impacts: `+page.svelte`, `app.css`
