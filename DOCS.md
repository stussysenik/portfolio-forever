# Architecture & Design Decisions

## Layout System

### Fixed Header + Content Spacing

The header (`.top-frame`) is `position: fixed` with a blurred backdrop. Content pages use `.main-content` with `padding-top: var(--space-3xl)` to clear the header. Individual pages may add their own `padding-top` (e.g., `/cv` uses `var(--space-lg)`) for breathing room.

Pages must **not** use `justify-content: center` on their wrappers unless the content is intentionally centered (like a 404). Sparse pages (`/likes`, `/talks`) previously used vertical centering which created massive gaps below the header.

### Social Links

All viewports use the `@` toggle button to open a dropdown. The "find me elsewhere" label is hidden. Brand-specific gradient hover effects use `background-clip: text` for each platform (SoundCloud orange, GitHub dark, LinkedIn blue, Instagram rainbow, X black/white, email accent blue).

### Nav Spacing

- Desktop (>=768px): `.header-nav-group` gap is `var(--space-lg)` (24px)
- Tablet (<=1024px): gap is `var(--space-md)`
- Mobile (<=380px): gap is `var(--space-xs)`

## Works Page

### Mobile Strategy

On mobile (`< 768px`), iframes are suppressed entirely. Instead, each project shows a "tap to open" placeholder that links externally. This avoids:
- Slow loading on constrained networks
- Touch interaction conflicts with embedded content
- Battery/data drain from 11 live iframes

The `mymind.com clone` uses a static preview image (`/previews/curate-your-own-network.png`) because the site blocks iframe embedding.

### Scroll-to-Top

`window.scrollTo(0, 0)` is called in `onMount` to prevent the browser from restoring a mid-page scroll position (caused by skeleton loading shifting the viewport).

## Design Tokens

Spacing follows a golden-ratio-inspired scale defined in `src/lib/data/tokens.ts`:

| Token          | Value |
|----------------|-------|
| `--space-xs`   | 4px   |
| `--space-sm`   | 8px   |
| `--space-md`   | 16px  |
| `--space-lg`   | 24px  |
| `--space-xl`   | 32px  |
| `--space-2xl`  | 48px  |
| `--space-3xl`  | 64px  |

## Testing

### Test Structure

```
tests/
├── setup.ts                          # Shared config (BASE_URL from env)
├── essential.spec.ts                 # Core functionality
├── ui-polish.spec.ts                 # Visual polish & layout assertions
├── responsive/
│   └── mobile/
│       └── works.spec.ts             # Mobile /works — loading, network, a11y
└── visual/
    └── homepage.spec.ts              # Visual regression snapshots
```

### Base URL

Tests use `process.env.PLAYWRIGHT_BASE_URL` (default: `http://portfolio.localhost:1355`) for portless local development. The `webServer` auto-start is disabled because Node.js cannot resolve `.localhost` TLD (browsers can per RFC 6761).

### Mobile Works Tests

The mobile works test suite mocks all external project URLs and preview images to avoid network dependencies. It covers:
- Skeleton-to-placeholder transitions
- Iframe suppression on mobile
- Preview image loading (including delayed loading)
- Network throttling (3G/4G via CDP)
- Network failure resilience
- Viewport layouts (single/two column grid)
- Touch target sizes (44px minimum per WCAG 2.5.5)
- Performance (DOM content loaded < 3s, FCP < 2s)
