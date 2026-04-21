export function navigateTo(href: string) {
	if (typeof window !== "undefined") {
		window.location.assign(href);
	}
}
