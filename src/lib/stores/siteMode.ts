import { writable, derived } from "svelte/store";

export type SiteMode = "one-page" | "multi-page" | "reader";

export const siteMode = writable<SiteMode>("multi-page");
export const readerMode = derived(siteMode, ($mode) => $mode === "reader");

// Local override for user toggle (r key) independent of admin setting
export const readerOverride = writable<boolean | null>(null);

// Effective reader state: override takes precedence over site mode
export const isReaderMode = derived(
	[readerMode, readerOverride],
	([$readerMode, $override]) => $override ?? $readerMode
);
