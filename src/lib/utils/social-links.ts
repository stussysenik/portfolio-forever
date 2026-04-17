/**
 * Shared utility for parsing sameAs URLs into labeled social links.
 * Used by ProfileAdmin (preview), +layout.svelte (nav), and HeroSection (identity).
 */

const KNOWN_HOSTS: Record<string, string> = {
	'github.com': 'github',
	'linkedin.com': 'linkedin',
	'instagram.com': 'instagram',
	'x.com': 'x',
	'twitter.com': 'x',
	'soundcloud.com': 'soundcloud',
	'on.soundcloud.com': 'soundcloud',
	'imdb.com': 'imdb',
	'youtube.com': 'youtube',
	'vimeo.com': 'vimeo',
	'dribbble.com': 'dribbble',
	'behance.net': 'behance',
	'letterboxd.com': 'letterboxd',
	'app.thestorygraph.com': 'storygraph',
	'medium.com': 'medium',
};

/** Parse a sameAs URL into a short label for display */
export function sameAsUrlToLabel(url: string): string {
	if (url.startsWith('mailto:')) return 'email';
	try {
		const hostname = new URL(url).hostname.replace(/^www\./, '');
		return KNOWN_HOSTS[hostname] ?? hostname;
	} catch {
		return url;
	}
}

/** Parse an array of sameAs URLs into {label, url} pairs for nav/display */
export function parseSameAs(urls: string[]): { label: string; url: string }[] {
	return urls.map((url) => ({ label: sameAsUrlToLabel(url), url }));
}
