import { PUBLIC_CLERK_PUBLISHABLE_KEY } from '$env/static/public';

let initPromise: Promise<any> | null = null;

export function getClerk(): Promise<any> {
	if (initPromise) return initPromise;

	initPromise = (async () => {
		const { Clerk } = await import('@clerk/clerk-js');
		const clerk = new Clerk(PUBLIC_CLERK_PUBLISHABLE_KEY);
		await clerk.load();
		return clerk;
	})();

	return initPromise;
}
