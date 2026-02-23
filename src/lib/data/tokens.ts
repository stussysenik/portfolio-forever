// Design Tokens — Single Source of Truth
// Runtime mechanism: CSS custom properties in app.css
// This file: documentation, type-safety, and reference for all design decisions.
// No runtime JS dependency — import only for types/constants.

// ── Colors ──────────────────────────────────────────────────────────
// OKLCh color space for perceptual uniformity
// 60/30/10 rule:
//   60% — Background/neutral: bg, bg-alt, surface
//   30% — Text/secondary: text, text-secondary, border-color
//   10% — Accent/signal: accent, success, category colors

export const colors = {
	// 60% — Background / Neutral
	bg: 'oklch(0.985 0.002 80)', // #FAFAF9
	bgAlt: 'oklch(0.970 0.002 80)', // #F5F5F4
	surface: 'oklch(1.000 0 0)', // #FFFFFF
	surfaceRaised: 'oklch(1.000 0 0)', // #FFFFFF

	// 30% — Text / Secondary
	text: 'oklch(0.145 0.005 285)', // #1A1A1A
	textSecondary: 'oklch(0.365 0.005 285)', // #525252
	textMuted: 'oklch(0.485 0.005 285)', // #737373
	textSubtle: 'oklch(0.670 0.005 285)', // #A3A3A3

	// 10% — Accent / Signal
	accent: 'oklch(0.546 0.245 264)', // #2563EB
	accentHover: 'oklch(0.488 0.243 264)', // #1D4ED8
	accentSubtle: 'oklch(0.932 0.042 264)', // #DBEAFE
	success: 'oklch(0.560 0.140 160)', // hsl(155, 65%, 38%)
	warning: 'oklch(0.780 0.160 80)', // hsl(40, 90%, 50%)
	danger: 'oklch(0.560 0.200 25)', // hsl(0, 70%, 50%)

	// Category colors
	design: 'oklch(0.580 0.180 350)', // hsl(340, 55%, 52%)
	technology: 'oklch(0.540 0.200 260)', // hsl(220, 75%, 52%)
	art: 'oklch(0.720 0.160 85)', // hsl(45, 85%, 48%)
	film: 'oklch(0.540 0.160 300)', // hsl(275, 50%, 52%)

	// Borders
	border: 'oklch(0.910 0.002 80)', // #E5E5E5
	borderStrong: 'oklch(0.670 0.005 285)', // #A3A3A3
	borderSubtle: 'oklch(0.970 0.002 80)', // #F5F5F4
} as const;

// ── Spacing ─────────────────────────────────────────────────────────
// 12-step scale based on 1rem unit

export const spacing = {
	'3xs': '0.0625rem', // 1px
	'2xs': '0.125rem', // 2px
	xs: '0.25rem', // 4px
	sm: '0.5rem', // 8px
	md: '1rem', // 16px (base)
	lg: '1.5rem', // 24px
	xl: '2rem', // 32px
	'2xl': '3rem', // 48px
	'3xl': '4rem', // 64px
	'4xl': '6rem', // 96px
	'5xl': '8rem', // 128px
	'6xl': '12rem', // 192px
} as const;

// ── Typography ──────────────────────────────────────────────────────

export const typography = {
	families: {
		sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
		mono: "'JetBrains Mono', ui-monospace, 'SF Mono', 'Cascadia Code', monospace",
	},
	sizes: {
		'3xs': 'clamp(0.5625rem, 0.5rem + 0.15vw, 0.625rem)',
		'2xs': 'clamp(0.625rem, 0.58rem + 0.2vw, 0.75rem)',
		xs: 'clamp(0.75rem, 0.7rem + 0.2vw, 0.875rem)',
		sm: 'clamp(0.875rem, 0.82rem + 0.25vw, 1rem)',
		base: 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)',
		lg: 'clamp(1.125rem, 1rem + 0.5vw, 1.375rem)',
		xl: 'clamp(1.375rem, 1.15rem + 0.75vw, 1.875rem)',
		'2xl': 'clamp(1.75rem, 1.4rem + 1.25vw, 2.5rem)',
		'3xl': 'clamp(2.25rem, 1.75rem + 1.75vw, 3.5rem)',
		'4xl': 'clamp(3rem, 2.25rem + 2.5vw, 5rem)',
		display: 'clamp(3.5rem, 2.5rem + 4vw, 8rem)',
		hero: 'clamp(4rem, 3rem + 5vw, 10rem)',
	},
	weights: {
		thin: 100,
		extralight: 200,
		light: 300,
		normal: 400,
		medium: 450,
		semibold: 550,
		bold: 650,
	},
	lineHeights: {
		tight: 1.05,
		snug: 1.2,
		normal: 1.55,
		relaxed: 1.7,
	},
	letterSpacings: {
		tighter: '-0.04em',
		tight: '-0.025em',
		normal: '-0.011em',
		wide: '0.025em',
		wider: '0.08em',
		widest: '0.15em',
	},
} as const;

// ── Breakpoints ─────────────────────────────────────────────────────

export const breakpoints = {
	sm: '480px', // 6-col grid
	md: '768px', // 8-col grid
	lg: '1024px', // 12-col grid
	xl: '1440px', // wide desktop
	'2xl': '2560px', // 4K
	'3xl': '3840px', // 6K
} as const;

// ── Animation ───────────────────────────────────────────────────────

export const animation = {
	durations: {
		instant: '50ms',
		fast: '120ms',
		normal: '220ms',
		slow: '400ms',
		slower: '600ms',
	},
	easings: {
		default: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
		out: 'cubic-bezier(0.16, 1, 0.3, 1)',
		bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
	},
} as const;

// ── Borders ─────────────────────────────────────────────────────────

export const borders = {
	widths: {
		default: '1px',
		thick: '1.5px',
	},
	radii: {
		sm: '4px',
		md: '8px',
		lg: '12px',
	},
} as const;

// ── Type Exports ────────────────────────────────────────────────────

export type ColorToken = keyof typeof colors;
export type SpacingToken = keyof typeof spacing;
export type FontSizeToken = keyof typeof typography.sizes;
export type BreakpointToken = keyof typeof breakpoints;
