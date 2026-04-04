let initPromise: Promise<any> | null = null;

export function getClerk(): Promise<any> {
	const publishableKey =
		import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
		import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY;

	if (!publishableKey) {
		return Promise.reject(new Error('Missing Clerk publishable key'));
	}

	if (initPromise) return initPromise;

	initPromise = (async () => {
		const { Clerk } = await import('@clerk/clerk-js');
		const clerk = new Clerk(publishableKey);
		await clerk.load();
		return clerk;
	})();

	return initPromise;
}
