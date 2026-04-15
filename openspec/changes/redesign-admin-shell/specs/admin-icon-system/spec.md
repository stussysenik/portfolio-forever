# Spec: Admin Icon System

## ADDED Requirements

### Requirement: Admin icons use unplugin-icons with iconify lucide set
All icons rendered inside `src/lib/admin/**` and `src/routes/admin/**` SHALL be imported from the `~icons/lucide/*` namespace provided by `unplugin-icons`.

#### Scenario: Build compiles admin icon imports
**Given** the Vite config has `unplugin-icons` registered with `compiler: 'svelte'`
**When** a Svelte file imports `IconHome from '~icons/lucide/home'`
**Then** the build succeeds
**And** the compiled output contains an inline SVG component
**And** no runtime icon registry is fetched over the network

#### Scenario: Admin file contains a Unicode glyph
**Given** any `.svelte` file under `src/lib/admin/` or `src/routes/admin/`
**When** a grep runs for common Unicode icon glyphs (`○`, `⊙`, `⊚`, `⌘`, `⌥`, `▲`, `▼`, `●`)
**Then** the grep returns zero matches in template or visible-text positions

#### Scenario: Admin file contains an inline SVG
**Given** any `.svelte` file under `src/lib/admin/` or `src/routes/admin/`
**When** a grep runs for `<svg` inside the template
**Then** the grep returns zero matches
**And** any existing inline SVG icons have been replaced with a `~icons/lucide/*` import

### Requirement: Admin icon manifest is the single import source
Admin files SHALL import icons from `$lib/admin/admin-icons`, not from `~icons/lucide/*` directly.

#### Scenario: Admin component imports an icon
**Given** a new icon is needed in `AdminShell.svelte`
**When** the component imports the icon
**Then** the import statement reads from `$lib/admin/admin-icons`
**And** `$lib/admin/admin-icons.ts` exports the icon as a named export sourced from `~icons/lucide/*`

#### Scenario: Admin component attempts a direct iconify import
**Given** a pull request adds `import IconFoo from '~icons/lucide/foo'` in a file under `src/lib/admin/`
**When** a review-time check scans the imports
**Then** the check flags the direct import as a violation

### Requirement: AdminIcon primitive wraps size and color
The `AdminIcon.svelte` primitive SHALL render any lucide icon with size and color controlled by `--admin-*` tokens.

#### Scenario: AdminIcon renders with size preset
**Given** `<AdminIcon icon={IconHome} size="sm" />`
**When** the component mounts
**Then** the rendered SVG is 14×14 pixels
**And** the SVG stroke color inherits from `--admin-text`

#### Scenario: AdminIcon renders with accent color
**Given** `<AdminIcon icon={IconHome} tone="accent" />`
**When** the component mounts
**Then** the rendered SVG stroke color resolves to `--admin-accent`

### Requirement: Flag indicators pair semantic icon with state dot
The `FlagIndicator.svelte` component SHALL render a per-flag lucide icon from the registry alongside the state dot from `add-flag-visual-indicators`.

#### Scenario: Registry defines an icon for a flag
**Given** `flagIndicatorRegistry['pixel-engine'] = { label, category, icon: 'lucide:sparkles' }`
**When** `FlagIndicator` renders for the `pixel-engine` flag
**Then** the output contains both the per-flag icon (lucide sparkles) and the state dot (green or outline)
**And** the icon occupies a fixed 14×14 slot to the left of the label
**And** the dot sits to the right of the label at 6×6

#### Scenario: Flag exists in registry without an icon field
**Given** a flag is defined in the registry but has no `icon` field
**When** `FlagIndicator` renders
**Then** a default `lucide:dot` icon renders in place of the semantic icon
**And** no console error is emitted

### Requirement: Type-safe icon imports
The project SHALL reference the `unplugin-icons/types/svelte` declaration file so that `~icons/lucide/*` imports resolve in TypeScript.

#### Scenario: TypeScript checks admin icon import
**Given** `src/app.d.ts` contains `/// <reference types="unplugin-icons/types/svelte" />`
**When** `tsc --noEmit` runs
**Then** no type errors are emitted for `~icons/lucide/*` imports
