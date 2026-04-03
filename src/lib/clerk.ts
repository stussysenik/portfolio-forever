import { env } from '$env/dynamic/public';

let initPromise: Promise<any> | null = null;

export function getClerk(): Promise<any> {
	if (initPromise) return initPromise;

	initPromise = (async () => {
		const key = env.PUBLIC_CLERK_PUBLISHABLE_KEY;
		if (!key) throw new Error("PUBLIC_CLERK_PUBLISHABLE_KEY is not set");
		const { Clerk } = await import('@clerk/clerk-js');
		const clerk = new Clerk(key);
		await clerk.load();
		return clerk;
	})();

	return initPromise;
}
