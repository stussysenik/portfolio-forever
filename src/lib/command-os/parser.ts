import { registry } from './registry';

export type ParseResult =
	| { success: true; action: string; args: Record<string, unknown> }
	| { success: false; error: string; suggestions?: string[] };

const THEME_ALIASES = ['minimal', 'studio', 'terminal', 'bw'];

/**
 * Local NLP-lite parser. Covers the high-frequency cases without an LLM so the
 * palette works at first-run even before ANTHROPIC_API_KEY is configured.
 * The server-side routeCommand action is the authoritative path; this is a
 * zero-latency fast path for exact phrasings.
 */
export function parseLocally(input: string): ParseResult | null {
	const raw = input.trim();
	if (!raw) return null;
	const lower = raw.toLowerCase();

	// theme switch
	const themeMatch = lower.match(
		/(?:^|\b)(?:set|switch|use|change)\s+theme\s+(?:to\s+)?([a-z-]+)$/
	);
	if (themeMatch) {
		const themeId = themeMatch[1];
		if (THEME_ALIASES.includes(themeId)) {
			return { success: true, action: 'setTheme', args: { themeId } };
		}
		return {
			success: false,
			error: `unknown theme "${themeId}"`,
			suggestions: THEME_ALIASES,
		};
	}
	// bare theme name
	if (THEME_ALIASES.includes(lower)) {
		return { success: true, action: 'setTheme', args: { themeId: lower } };
	}

	// navigation
	const navMatch = lower.match(/^(?:go to|goto|open|nav(?:igate)?\s+to)\s+(\S+)$/);
	if (navMatch) {
		let path = navMatch[1];
		if (!path.startsWith('/')) path = '/' + path;
		return { success: true, action: 'navigateTo', args: { path } };
	}

	// flag toggle
	const flagMatch = lower.match(/^(?:enable|disable|turn\s+(on|off))\s+(?:flag\s+)?([a-z0-9-]+)$/);
	if (flagMatch) {
		const enabled = /enable|on/.test(lower);
		return {
			success: true,
			action: 'toggleFlag',
			args: { flagId: flagMatch[2], enabled },
		};
	}

	// WIP badge — goes through pending stack, not direct Convex
	const wipMatch = lower.match(/^(?:enable|disable|show|hide|turn\s+(on|off))\s+(?:the\s+)?wip(?:\s+badge)?$/);
	if (wipMatch) {
		const visible = /^(?:enable|show|turn\s+on)/.test(lower);
		return { success: true, action: 'setWipBadge', args: { visible } };
	}

	// "save" / "commit" — flush pending changes
	if (/^(?:save|commit|apply|publish)\s*(?:changes)?$/.test(lower)) {
		return { success: true, action: 'commitPending', args: { confirm: true } };
	}

	// preview breakpoint: "preview 390", "preview mobile", "preview tablet", "preview desktop"
	const PREVIEW_ALIASES: Record<string, number> = {
		mobile: 390, phone: 390, iphone: 390,
		tablet: 768, ipad: 768,
		desktop: 1440, laptop: 1440,
	};
	const previewMatch = lower.match(/^(?:preview|viewport|breakpoint)\s+(?:at\s+)?(\S+)$/);
	if (previewMatch) {
		const val = previewMatch[1];
		const width = PREVIEW_ALIASES[val] ?? parseInt(val, 10);
		if (width >= 280 && width <= 3840) {
			return { success: true, action: 'previewAt', args: { width } };
		}
		return { success: false, error: `invalid viewport: "${val}". Use a number (280–3840) or: mobile, tablet, desktop` };
	}

	// font switch
	const fontMatch = lower.match(/^(?:set\s+)?font\s+(?:to\s+)?([a-z-]+)$/);
	if (fontMatch) {
		return { success: true, action: 'setFont', args: { fontId: fontMatch[1] } };
	}

	// create work: "new work "title" https://..."
	const newWorkMatch = raw.match(
		/^(?:new|create|add)\s+work\s+(?:"([^"]+)"|([^\s]+))\s+(https?:\/\/\S+)/i
	);
	if (newWorkMatch) {
		const title = newWorkMatch[1] ?? newWorkMatch[2];
		const url = newWorkMatch[3];
		return { success: true, action: 'createWork', args: { title, url, visible: true } };
	}

	return null;
}

/** Suggest registry entries that fuzzy-match input — used for idle/autocomplete state. */
export function suggestActions(input: string, limit = 5) {
	const lower = input.trim().toLowerCase();
	if (!lower) {
		return (Object.keys(registry) as (keyof typeof registry)[]).slice(0, limit).map((k) => ({
			name: registry[k].name,
			description: registry[k].description,
		}));
	}
	const scored: { name: string; description: string; score: number }[] = [];
	for (const key of Object.keys(registry) as (keyof typeof registry)[]) {
		const spec = registry[key];
		const haystack = (spec.name + ' ' + spec.description).toLowerCase();
		let score = 0;
		for (const term of lower.split(/\s+/)) {
			if (!term) continue;
			if (haystack.includes(term)) score += term.length;
		}
		if (score > 0) scored.push({ name: spec.name, description: spec.description, score });
	}
	return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}
