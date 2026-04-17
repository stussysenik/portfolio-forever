import { writable, derived, get } from 'svelte/store';

type StagedFlag = {
	key: string;
	enabled: boolean;
	category: string;
	label: string;
};

function createStagedFlagsStore() {
	const { subscribe, set, update } = writable<Map<string, StagedFlag>>(new Map());

	return {
		subscribe,

		stage(key: string, enabled: boolean, category: string, label: string) {
			update((map) => {
				const next = new Map(map);
				next.set(key, { key, enabled, category, label });
				return next;
			});

			if (typeof window !== 'undefined') {
				const map = get({ subscribe });
				const overrides: Record<string, boolean> = {};
				map.forEach((v) => {
					overrides[v.key] = v.enabled;
				});
				const iframes = document.querySelectorAll<HTMLIFrameElement>(
					'iframe[src*="preview=true"]'
				);
				iframes.forEach((iframe) => {
					iframe.contentWindow?.postMessage(
						{ type: 'admin:flagOverrides', overrides },
						'*'
					);
				});
			}
		},

		unstage(key: string) {
			update((map) => {
				const next = new Map(map);
				next.delete(key);
				return next;
			});
		},

		clear() {
			set(new Map());
		},

		snapshot(): Map<string, StagedFlag> {
			return get({ subscribe });
		},

		getStagedEnabled(key: string): boolean | undefined {
			return get({ subscribe }).get(key)?.enabled;
		},

		async commit(
			client: any,
			api: any,
			currentFlags: Array<{ key: string; enabled: boolean; category: string }>
		) {
			const staged = get({ subscribe });
			if (staged.size === 0) return 0;

			let committed = 0;
			for (const [, flag] of staged) {
				await client.mutation(api.siteConfig.setFeatureFlag, {
					key: flag.key,
					enabled: flag.enabled,
					category: flag.category,
				});
				committed++;
			}

			set(new Map());
			return committed;
		}
	};
}

export const stagedFlags = createStagedFlagsStore();

export const stagedCount = derived(stagedFlags, ($map) => $map.size);

export const stagedLabels = derived(stagedFlags, ($map) =>
	Array.from($map.values()).map((f) => `${f.label}: ${f.enabled ? 'ON' : 'OFF'}`)
);

export function resolveFlagEnabled(
	key: string,
	currentFlags: Array<{ key: string; enabled: boolean }>,
	label?: string
): boolean {
	const staged = stagedFlags.getStagedEnabled(key);
	if (staged !== undefined) return staged;
	const flag = currentFlags.find((f) => f.key === key);
	return flag?.enabled ?? true;
}
