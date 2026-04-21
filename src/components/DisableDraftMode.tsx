import { useMemo } from "react";

function isTopWindow() {
	try {
		return window.top === window.self;
	} catch (_error) {
		return false;
	}
}

export default function DisableDraftMode(): React.JSX.Element | null {
	const href = useMemo(() => {
		const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`;
		return `/api/draft-mode/disable?returnTo=${encodeURIComponent(returnTo)}`;
	}, []);

	if (!isTopWindow()) {
		return null;
	}

	return (
		<a className="draft-mode-exit" href={href}>
			Exit draft mode
		</a>
	);
}
