export type FlagIndicatorEntry = {
	key: string;
	label: string;
	category: 'visual' | 'layout';
	mountHint: string;
	/**
	 * Iconify key resolved via `$lib/admin/admin-icons#resolveIconifyKey`.
	 * Pairs with the state-dot vocabulary from `add-flag-visual-indicators`
	 * so the indicator communicates both identity (glyph) and state (dot).
	 */
	icon: string;
};

/**
 * Single source of truth for the 10 feature flags that drive both the admin
 * chip and the public-site visual indicator. `mountHint` is advisory — where
 * the indicator should appear on the public site when
 * `siteConfig.showFlagIndicators` is true.
 */
export const flagIndicatorRegistry: FlagIndicatorEntry[] = [
	{ key: 'pixel-engine',     label: 'Pixel Engine',          category: 'visual', mountHint: 'near <PixelCanvas /> consumer',     icon: 'lucide:sparkles' },
	{ key: 'ascii-donut',      label: 'ASCII Donut',           category: 'visual', mountHint: 'HeroSection donut conditional',     icon: 'lucide:circle-dot' },
	{ key: 'parallax',         label: 'Parallax Transitions',  category: 'visual', mountHint: 'parallax controller',               icon: 'lucide:layers' },
	{ key: 'view-transitions', label: 'View Transitions',      category: 'visual', mountHint: '+layout.svelte',                    icon: 'lucide:waves' },
	{ key: 'wip-banner',       label: 'WIP Banner',            category: 'layout', mountHint: 'banner component',                  icon: 'lucide:bell' },
	{ key: 'elevator',         label: 'Elevator (Back to Top)', category: 'visual', mountHint: 'back-to-top control',              icon: 'lucide:arrow-up-circle' },
	{ key: 'terminal-matrix',  label: 'Terminal Matrix',       category: 'visual', mountHint: 'terminal animation',                icon: 'lucide:terminal-square' },
	{ key: 'os-desktop',       label: 'OS Desktop Simulator',  category: 'visual', mountHint: 'OS desktop mount',                  icon: 'lucide:app-window' },
	{ key: 'social-links',     label: 'Social Links Dropdown', category: 'layout', mountHint: 'social links dropdown',             icon: 'lucide:at-sign' },
	{ key: 'command-palette',  label: 'Command Palette',       category: 'layout', mountHint: 'admin layout cmd+K',                icon: 'lucide:command' },
	{ key: 'cube-mode',       label: '3D Cube Mode',           category: 'visual', mountHint: '+page.svelte conditional',          icon: 'lucide:box' },
];

export function getFlagEntry(key: string): FlagIndicatorEntry | undefined {
	return flagIndicatorRegistry.find((f) => f.key === key);
}

export function getFlagIconKey(key: string): string {
	return getFlagEntry(key)?.icon ?? 'lucide:dot';
}
