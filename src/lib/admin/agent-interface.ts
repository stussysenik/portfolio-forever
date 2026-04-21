/**
 * AI agent interface for admin CMS communication.
 * Ported from clj/portfolio/admin/agent_interface.cljs
 */

export function syncAllTabs() {
	if (typeof window === "undefined") return;
	console.log("[agent] Syncing all previews...");
	const iframes = document.querySelectorAll("iframe[src*=\"preview=\"]");
	iframes.forEach((iframe) => {
		const win = (iframe as HTMLIFrameElement).contentWindow;
		if (win) {
			win.postMessage({ type: "admin:sync" }, "*");
		}
	});
}

export function notifyPreviews(changes: any) {
	if (typeof window === "undefined") return;
	const iframes = document.querySelectorAll("iframe[src*=\"preview=\"]");
	iframes.forEach((iframe) => {
		const win = (iframe as HTMLIFrameElement).contentWindow;
		if (win) {
			win.postMessage({ type: "admin:stagedChanges", changes }, "*");
		}
	});
}

export const exports = {
	syncAllTabs,
	notifyPreviews,
};
