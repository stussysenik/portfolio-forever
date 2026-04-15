// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
/// <reference types="unplugin-icons/types/svelte" />

declare global {
	interface ImportMetaEnv {
		readonly NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?: string;
		readonly PUBLIC_CLERK_PUBLISHABLE_KEY?: string;
	}

	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
