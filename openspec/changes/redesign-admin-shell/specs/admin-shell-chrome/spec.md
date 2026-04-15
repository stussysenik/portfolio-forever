# Spec: Admin Shell Chrome

## ADDED Requirements

### Requirement: Admin surface reads as distinct from previewed site
The admin shell SHALL render with chrome, workspace, and preview-frame surfaces that are visually distinguishable from the public site, with explicit surface tokens and keyline dividers.

#### Scenario: Admin loads at desktop width
**Given** a user opens `/admin` at 1440px
**When** the `AdminShell` mounts
**Then** the topbar and left rail render with background `--admin-chrome-bg`
**And** the builder pane renders with background `--admin-workspace-bg`
**And** the preview pane renders with background `--admin-frame-bg`
**And** a 1px solid keyline of `--admin-keyline` separates each surface from its neighbor
**And** the three background values are visually distinct from each other and from the previewed site's body background

#### Scenario: Preview iframe sits inside a framed viewport
**Given** the admin is loaded with a preview visible
**When** the preview pane renders
**Then** the iframe is inset from the frame edge by at least 8px on all sides
**And** a frame header above the iframe shows the current preview route and a responsive-width switcher
**And** the iframe and the frame border do not share the same background color

### Requirement: Admin tokens are namespaced and scoped
Admin-specific CSS custom properties SHALL be defined only under the `.admin-shell[data-admin]` selector and SHALL be prefixed with `--admin-`.

#### Scenario: Public site stylesheet inspection
**Given** the public site route `/` is loaded
**When** the computed style of `document.documentElement` is inspected
**Then** no `--admin-*` custom property resolves to a non-empty value

#### Scenario: Admin selector discipline
**Given** any `.svelte` or `.css` file under `src/lib/admin/` or `src/routes/admin/`
**When** a build-time or test-time grep runs against its `<style>` blocks
**Then** no selector targets a bare HTML element (no `button`, `h1`, `a`, `div`, `input` selectors without a class prefix)

### Requirement: Admin inherits theme accent and typography
The admin shell SHALL pick up `--color-accent`, `--font-family-sans`, and `--font-family-mono` from the active site theme, with safe fallbacks.

#### Scenario: Site theme changes accent color
**Given** the site theme is active with `--color-accent: oklch(65% 0.2 30)`
**When** the admin shell renders
**Then** `--admin-accent` resolves to `oklch(65% 0.2 30)`
**And** elements using `--admin-accent` reflect the new value without a page reload

#### Scenario: Site theme has no accent defined
**Given** the active theme does not set `--color-accent`
**When** the admin shell renders
**Then** `--admin-accent` resolves to its hardcoded fallback value
**And** admin chrome remains legible without visual regression

### Requirement: Dark chrome activates from dark site themes
The admin chrome SHALL switch to dark surface tokens when a dark site theme is active, without loading a separate stylesheet.

#### Scenario: User switches to darkroom theme
**Given** the admin is visible with the minimal (light) theme active
**When** the user changes the site theme to `darkroom`
**Then** `.admin-shell` gains dark values for `--admin-chrome-bg`, `--admin-workspace-bg`, `--admin-frame-bg`, `--admin-text`, `--admin-keyline`
**And** `color-scheme: dark` is set on the admin shell
**And** no stylesheet fetch occurs
**And** the swap completes in under one frame (16ms)

#### Scenario: User returns to light theme
**Given** the admin is visible with the `darkroom` theme active
**When** the user switches back to `minimal`
**Then** the admin chrome returns to its light defaults without artifacts

### Requirement: Command dock is anchored, not floating
The command entry bar SHALL render as a docked strip inside the admin chrome rail at the bottom edge of the viewport, not as a floating overlay.

#### Scenario: Admin loads at any breakpoint
**Given** the admin shell is mounted
**When** the command dock renders
**Then** the dock occupies a dedicated grid row in the chrome rail
**And** the dock has a keyline above it separating it from the workspace or rail content
**And** the dock does not overlap the preview pane or the workspace pane

### Requirement: Preview iframe isolation
The preview iframe SHALL be rendered as a separate document so that cascade cannot leak between admin chrome and the previewed site.

#### Scenario: Admin changes an admin-only CSS variable
**Given** the admin shell sets `--admin-chrome-bg: #000`
**When** the preview iframe's body computed style is inspected from within the iframe document
**Then** `--admin-chrome-bg` is not defined inside the iframe document

#### Scenario: Previewed route sets a global variable
**Given** the previewed site route sets `--color-bg: red` at `:root`
**When** the computed style of `.admin-shell` in the top document is inspected
**Then** the admin chrome background does not become red
