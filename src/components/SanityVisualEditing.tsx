import { useEffect, useMemo, useRef } from "react";
import {
	VisualEditing,
	type HistoryAdapter,
	type HistoryUpdate,
} from "@sanity/visual-editing/react";
import { perspectiveCookieName } from "@sanity/preview-url-secret/constants";
import type { ClientPerspective } from "@sanity/client";

function serializePerspective(perspective: ClientPerspective) {
	return typeof perspective === "string" ? perspective : JSON.stringify(perspective);
}

function getCookie(name: string) {
	const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
	return match ? decodeURIComponent(match[1]) : undefined;
}

function setPerspectiveCookie(perspective: ClientPerspective) {
	const nextValue = serializePerspective(perspective);
	const currentValue = getCookie(perspectiveCookieName);

	if (currentValue === nextValue) {
		return false;
	}

	document.cookie = `${perspectiveCookieName}=${encodeURIComponent(nextValue)}; path=/; SameSite=None; Secure`;
	return true;
}

function currentUrl() {
	return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

export default function SanityVisualEditing(): React.JSX.Element {
	const navigateRef = useRef<((update: HistoryUpdate) => void) | undefined>(undefined);
	const releaseNavigateRef = useRef<number | undefined>(undefined);

	useEffect(() => {
		const publishCurrentUrl = () => {
			navigateRef.current?.({
				type: "push",
				title: document.title,
				url: currentUrl(),
			});
		};

		const originalPushState = window.history.pushState;
		const originalReplaceState = window.history.replaceState;

		window.addEventListener("popstate", publishCurrentUrl);
		window.addEventListener("hashchange", publishCurrentUrl);

		window.history.pushState = function (...args) {
			originalPushState.apply(window.history, args);
			publishCurrentUrl();
		};

		window.history.replaceState = function (...args) {
			originalReplaceState.apply(window.history, args);
			publishCurrentUrl();
		};

		publishCurrentUrl();

		return () => {
			window.clearTimeout(releaseNavigateRef.current);
			window.removeEventListener("popstate", publishCurrentUrl);
			window.removeEventListener("hashchange", publishCurrentUrl);
			window.history.pushState = originalPushState;
			window.history.replaceState = originalReplaceState;
		};
	}, []);

	const history = useMemo<HistoryAdapter>(
		() => ({
			subscribe: (navigate) => {
				window.clearTimeout(releaseNavigateRef.current);
				navigateRef.current = navigate;
				navigate({
					type: "push",
					title: document.title,
					url: currentUrl(),
				});

				return () => {
					releaseNavigateRef.current = window.setTimeout(() => {
						if (navigateRef.current === navigate) {
							navigateRef.current = undefined;
						}
					}, 200);
				};
			},
			update: (update) => {
				switch (update.type) {
					case "push":
						if (window.location.href !== update.url) {
							window.location.assign(update.url);
						}
						return;
					case "replace":
						if (window.location.href !== update.url) {
							window.location.replace(update.url);
						}
						return;
					case "pop":
						window.history.back();
						return;
					default:
						throw new Error(`Unsupported history update: ${(update as { type?: string }).type ?? "unknown"}`);
				}
			},
		}),
		[],
	);

	return (
		<VisualEditing
			history={history}
			portal
			refresh={() => window.location.reload()}
			onPerspectiveChange={(perspective) => {
				if (setPerspectiveCookie(perspective)) {
					window.location.reload();
				}
			}}
		/>
	);
}
