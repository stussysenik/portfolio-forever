# Design Document: Theme Customization System

## Architecture Overview

### System Components
```
┌─────────────────────────────────────────────────┐
│           User Interface Layer                  │
│  ┌──────────────┐      ┌──────────────┐        │
│  │ ThemeSwitcher│      │ FontSwitcher │        │
│  └──────┬───────┘      └──────┬───────┘        │
│         │                     │                 │
└─────────┼─────────────────────┼─────────────────┘
          │                     │
┌─────────▼─────────────────────▼─────────────────┐
│         Preference Manager (localStorage)        │
│  ┌──────────────┐      ┌──────────────┐        │
│  │  themeKey    │      │   fontKey    │        │
│  └──────────────┘      └──────────────┘        │
└─────────────────────────────────────────────────┘
          │                     │
┌─────────▼─────────────────────▼─────────────────┐
│            CSS Custom Properties                 │
│  ┌──────────────────────────────────────┐       │
│  │ :root[data-theme="X"][data-font="Y"] │       │
│  │   --color-bg: ...                    │       │
│  │   --font-sans: ...                   │       │
│  │   ...                                │       │
│  └──────────────────────────────────────┘       │
└─────────────────────────────────────────────────┘
          │
┌─────────▼─────────────────────────────────────┐
│            Rendered UI                         │
└───────────────────────────────────────────────┘
```

## Theme System Design

### Color Palette Philosophy

#### 1. Accessible Theme
**Goal**: Maximum readability and WCAG AAA compliance

**Color Strategy**:
- Very high contrast ratios (>7:1 for all text)
- Distinct, saturated accent colors for interactive elements
- No subtle grays - clear differentiation between states
- Large touch targets, clear focus indicators

**Palette**:
```css
--color-bg: #FFFFFF (pure white)
--color-surface: #F5F5F5 (light gray)
--color-text: #000000 (pure black)
--color-accent: #0066CC (strong blue, WCAG AAA on white)
--color-border: #333333 (high contrast border)
```

#### 2. Minimal Theme
**Goal**: Clean, refined, spacious aesthetic

**Color Strategy**:
- Soft neutrals with subtle warm undertones
- Generous whitespace (handled by spacing)
- Refined accent colors (not too saturated)
- Elegant transitions and low visual noise

**Palette**:
```css
--color-bg: #FAFAF9 (warm white)
--color-surface: #FFFFFF
--color-text: #1A1A1A (near black)
--color-text-secondary: #525252
--color-accent: #2563EB (refined blue)
--color-border: #E5E5E5 (subtle)
```

#### 3. Terminal Theme
**Goal**: Developer/tech aesthetic with sci-fi vibes

**Color Strategy**:
- Dark background (easier on eyes for coding)
- Matrix-inspired green or cyan accents
- Monochrome with vibrant accent colors
- Subtle glow effects on interactive elements

**Palette**:
```css
--color-bg: #0D1117 (GitHub dark)
--color-surface: #161B22
--color-text: #E6EDF3 (light blue-gray)
--color-text-secondary: #7D8590
--color-accent: #00D9FF (electric cyan) or #00FF41 (matrix green)
--color-border: #30363D
```

### Font System Design

#### Font Loading Strategy
Use Google Fonts with `font-display: swap` for optimal performance:

```html
<!-- Load additional fonts -->
@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@300;400;600&family=Space+Grotesk:wght@300;400;500;700&family=Fira+Code:wght@300;400;500&display=swap');
```

#### Font Categories
```typescript
type FontOption = {
  id: string;
  name: string;
  family: string;
  category: 'sans' | 'serif' | 'mono' | 'display';
  weights: number[];
}

const fontOptions: FontOption[] = [
  {
    id: 'inter',
    name: 'Inter',
    family: 'Inter, -apple-system, sans-serif',
    category: 'sans',
    weights: [100, 300, 400, 500, 600, 700],
  },
  {
    id: 'crimson',
    name: 'Crimson Pro',
    family: 'Crimson Pro, Georgia, serif',
    category: 'serif',
    weights: [300, 400, 600],
  },
  {
    id: 'jetbrains',
    name: 'JetBrains Mono',
    family: 'JetBrains Mono, monospace',
    category: 'mono',
    weights: [300, 400, 500],
  },
  {
    id: 'fira',
    name: 'Fira Code',
    family: 'Fira Code, monospace',
    category: 'mono',
    weights: [300, 400, 500],
  },
  {
    id: 'space',
    name: 'Space Grotesk',
    family: 'Space Grotesk, sans-serif',
    category: 'display',
    weights: [300, 400, 500, 700],
  },
];
```

#### CSS Custom Property Implementation
```css
:root[data-font="inter"] {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

:root[data-font="crimson"] {
  --font-sans: 'Crimson Pro', Georgia, 'Times New Roman', serif;
}

:root[data-font="space"] {
  --font-sans: 'Space Grotesk', -apple-system, sans-serif;
}

/* Mono fonts can be independently switchable or tied to main font */
:root[data-font-mono="jetbrains"] {
  --font-mono: 'JetBrains Mono', 'SF Mono', monospace;
}

:root[data-font-mono="fira"] {
  --font-mono: 'Fira Code', 'Cascadia Code', monospace;
}
```

## Component Design

### FontSwitcher Component
**Location**: `src/lib/components/FontSwitcher.svelte`

**Interface**:
```typescript
export let currentFont: string = 'inter';
export let onChange: (font: string) => void;

// Keyboard shortcut: 'F' to open font selector
```

**Behavior**:
- Dropdown or modal with font preview
- Show sample text in each font before selection
- Persist to localStorage as 'preferred-font'
- Apply immediately via `data-font` attribute on `documentElement`

### Enhanced ThemeSwitcher
**Modifications to**: `src/lib/components/ThemeSwitcher.svelte`

- Update theme options from `['minimal', 'terminal', 'paper']` to `['accessible', 'minimal', 'terminal']`
- Ensure theme names are semantic and descriptive
- Keep existing keyboard shortcut ('T')

### Footer Component
**Location**: Enhance `src/routes/+page.svelte` footer section

**Current** (line ~600):
```svelte
<footer class="page-footer">
  <div class="eof-comment">/* EOF */</div>
</footer>
```

**Enhanced**:
```svelte
<footer class="page-footer">
  <div class="copyright">
    © 2026 Made with <span class="heart">💙</span> in BedStuy
  </div>
  <div class="eof-comment">/* EOF */</div>
</footer>
```

**Styling**:
```css
.page-footer .copyright {
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-md);
}

.page-footer .heart {
  color: #3B82F6; /* Blue heart */
  display: inline-block;
  animation: heartbeat 2s ease-in-out infinite;
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
```

## Implementation Phases

### Phase 1: Color Palette Update
1. Define three new theme palettes in `app.css`
2. Update ThemeSwitcher component with new theme IDs
3. Test color contrast ratios (use WebAIM or similar)
4. Verify all UI components render correctly in each theme

### Phase 2: Font Switching System
1. Add font imports to `app.css`
2. Create FontSwitcher component
3. Implement localStorage persistence
4. Add font preview functionality
5. Wire up keyboard shortcut
6. Test font loading performance

### Phase 3: Footer Enhancement
1. Update footer markup in `+page.svelte`
2. Add footer styling
3. Test responsive behavior
4. Add optional heartbeat animation

### Phase 4: Integration & Testing
1. Ensure theme + font combinations work together
2. Test localStorage persistence
3. Verify accessibility (keyboard nav, screen readers)
4. Performance testing (font loading, theme switching)
5. Cross-browser compatibility

## Performance Considerations

### Font Loading
- Use `font-display: swap` to prevent FOIT (Flash of Invisible Text)
- Subset fonts to include only required character sets
- Consider preloading critical fonts in `+layout.svelte`

### CSS Custom Properties
- Minimal performance impact (browser-native)
- Instant theme switching (no re-render required)
- Efficient cascade updates

### LocalStorage
- Sync API is acceptable for small data (theme/font IDs)
- Read on mount, write on change
- Consider debouncing writes if switching rapidly

## Accessibility Considerations

1. **Keyboard Navigation**:
   - 'T' for theme switching (existing)
   - 'F' for font switching (new)
   - All controls focusable and operable via keyboard

2. **Screen Readers**:
   - Announce theme changes: "Theme changed to Accessible"
   - Announce font changes: "Font changed to Crimson Pro"
   - Use `aria-live="polite"` regions

3. **Color Contrast**:
   - Accessible theme: WCAG AAA (>7:1)
   - Minimal & Terminal themes: WCAG AA minimum (>4.5:1)

4. **Focus Indicators**:
   - Visible focus rings on all interactive elements
   - High contrast in all themes

## Testing Strategy

### Unit Tests
- Theme switching logic
- Font switching logic
- localStorage persistence

### Visual Regression Tests
- Screenshot comparison for each theme
- Font rendering verification

### Accessibility Tests
- Automated: axe-core, Lighthouse
- Manual: Screen reader testing (NVDA/JAWS)
- Contrast ratio verification

### Performance Tests
- Font loading metrics (LCP, CLS)
- Theme switching latency
- Memory usage with multiple font loads

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Font loading delays | Medium | Use font-display:swap, preload critical fonts |
| Too many fonts slow site | Medium | Limit to 4-5 font options, lazy load |
| localStorage not available | Low | Fallback to default theme/font |
| Color contrast failures | High | Use automated testing, manual verification |
| Breaking existing styles | Medium | Thorough regression testing |

## Future Enhancements
- System font stack option (no web fonts)
- Font size adjustment (accessibility feature)
- Export/import theme settings
- Custom theme builder
- Reduced motion preferences
