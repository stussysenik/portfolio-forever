import { z } from 'zod';
import { pendingChanges } from './pending';
import { wipBannerDismissed } from '$lib/stores/siteMode';
import { getFlagEntry } from '$lib/admin/flagIndicatorRegistry';
import { stagedFlags } from '$lib/stores/stagedFlags';

export type ExecuteContext = {
	client: any;
	api: any;
	goto: (href: string) => Promise<void> | void;
};

export type ActionSpec<TSchema extends z.ZodTypeAny = z.ZodTypeAny> = {
	name: string;
	description: string;
	parameters: TSchema;
	execute: (args: z.infer<TSchema>, ctx: ExecuteContext) => Promise<unknown>;
};

type PendingFlag = {
	flagId: string;
	enabled: boolean;
};

let pendingFlags: PendingFlag[] = [];

function action<TSchema extends z.ZodTypeAny>(spec: ActionSpec<TSchema>): ActionSpec<TSchema> {
	const originalExecute = spec.execute;
	return {
		...spec,
		async execute(args, ctx) {
			const result = await originalExecute(args, ctx);
			// Record in adminHistory so sidebar ChangeBadge + HistoryPopover see cmd+K changes
			try {
				await ctx.client.mutation(ctx.api.adminHistory.insert, {
					table: 'commandOs',
					field: spec.name,
					oldValue: null,
					newValue: args,
				});
			} catch (_) {
				// History recording is best-effort — don't break the action
			}
			return result;
		},
	};
}

const workStyleOverrides = z
	.object({
		accentColor: z.string().optional(),
		httpColor: z.string().optional(),
		secondaryHighlight: z.string().optional(),
		badgeStyle: z.string().optional(),
	})
	.optional();

export const registry = {
	createWork: action({
		name: 'createWork',
		description: 'Add a new project to the works page.',
		parameters: z.object({
			title: z.string(),
			url: z.string().url(),
			category: z.string().optional(),
			linkLabel: z.string().optional(),
			visible: z.boolean().default(true),
		}),
		async execute(args, { client, api }) {
			return client.mutation(api.works.createEntry, {
				title: args.title,
				url: args.url,
				category: args.category,
				linkLabel: args.linkLabel,
				order: Number.MAX_SAFE_INTEGER,
				visible: args.visible ?? true,
			});
		},
	}),

	updateWork: action({
		name: 'updateWork',
		description: 'Edit an existing work entry by id. All fields are optional.',
		parameters: z.object({
			id: z.string(),
			title: z.string().optional(),
			url: z.string().url().optional(),
			linkLabel: z.string().optional(),
			category: z.string().optional(),
			description: z.string().optional(),
			visible: z.boolean().optional(),
			styleOverrides: workStyleOverrides,
		}),
		async execute(args, { client, api }) {
			const { id, ...rest } = args;
			return client.mutation(api.works.updateEntry, { id, ...rest });
		},
	}),

	deleteWork: action({
		name: 'deleteWork',
		description: 'Delete a work entry by id.',
		parameters: z.object({ id: z.string() }),
		async execute({ id }, { client, api }) {
			return client.mutation(api.works.deleteEntry, { id });
		},
	}),

	createBlogPost: action({
		name: 'createBlogPost',
		description: 'Create a new blog post draft.',
		parameters: z.object({
			title: z.string(),
			slug: z.string().regex(/^[a-z0-9-]+$/),
			excerpt: z.string().optional(),
			content: z.string().optional(),
			visible: z.boolean().default(false),
		}),
		async execute(args, { client, api }) {
			return client.mutation(api.blog.createPost, args);
		},
	}),

	updateBlogPost: action({
		name: 'updateBlogPost',
		description: 'Update an existing blog post.',
		parameters: z.object({
			id: z.string(),
			title: z.string().optional(),
			slug: z.string().optional(),
			excerpt: z.string().optional(),
			content: z.string().optional(),
			visible: z.boolean().optional(),
		}),
		async execute(args, { client, api }) {
			const { id, ...rest } = args;
			return client.mutation(api.blog.updatePost, { id, ...rest });
		},
	}),

	setTheme: action({
		name: 'setTheme',
		description: 'Set the default site theme by theme id (e.g. minimal, terminal, carbon).',
		parameters: z.object({ themeId: z.string() }),
		async execute({ themeId }, { client, api }) {
			return client.mutation(api.themes.setDefault, { themeId });
		},
	}),

	setFont: action({
		name: 'setFont',
		description: 'Switch the active font family. Reads existing FontSwitcher custom event contract.',
		parameters: z.object({ fontId: z.string() }),
		async execute({ fontId }) {
			if (typeof window === 'undefined') return null;
			localStorage.setItem('portfolio-font', fontId);
			window.dispatchEvent(new CustomEvent('portfolio:font-change', { detail: { fontId } }));
			return { fontId };
		},
	}),

	toggleFlag: action({
		name: 'toggleFlag',
		description: 'Enable or disable a feature flag by id.',
		parameters: z.object({
			flagId: z.string(),
			enabled: z.boolean(),
		}),
		async execute({ flagId, enabled }, { client, api }) {
			const entry = getFlagEntry(flagId);
			const category = entry?.category ?? 'visual';
			return client.mutation(api.siteConfig.setFeatureFlag, { key: flagId, enabled, category });
		},
	}),

	toggleCubeMode: action({
		name: 'toggleCubeMode',
		description: 'Switch between scroll view and 3D cube navigation.',
		parameters: z.object({ enabled: z.boolean() }),
		async execute({ enabled }) {
			stagedFlags.stage('cube-mode', enabled, 'visual', '3D Cube Mode');
			return { enabled };
		},
	}),

	navigateTo: action({
		name: 'navigateTo',
		description: 'Navigate to a SvelteKit route. Use absolute paths like /admin, /works.',
		parameters: z.object({ path: z.string().startsWith('/') }),
		async execute({ path }, { goto }) {
			await goto(path);
			return { path };
		},
	}),

	setWipBadge: action({
		name: 'setWipBadge',
		description: 'Show or hide the WIP banner in the visual preview. Changes are staged and committed with "save".',
		parameters: z.object({ visible: z.boolean() }),
		async execute({ visible }) {
			wipBannerDismissed.set(!visible);
			if (typeof window !== 'undefined') {
				window.dispatchEvent(new CustomEvent('admin:wipBadge', { detail: { visible } }));
				const iframes = document.querySelectorAll<HTMLIFrameElement>('iframe[src*="preview=true"]');
				iframes.forEach((iframe) => {
					iframe.contentWindow?.postMessage({ type: 'admin:wipBadge', visible }, '*');
				});
			}
			pendingChanges.push({
				action: 'toggleFlag',
				args: { flagId: 'wip-banner', enabled: visible },
				label: visible ? 'Enable WIP banner' : 'Disable WIP banner',
			});
			const existing = pendingFlags.findIndex((f) => f.flagId === 'wip-banner');
			if (existing >= 0) pendingFlags.splice(existing, 1);
			pendingFlags.push({ flagId: 'wip-banner', enabled: visible });
			return { visible };
		},
	}),

	previewAt: action({
		name: 'previewAt',
		description: 'Set the preview pane viewport width. Use 390 for mobile, 768 for tablet, 1440 for desktop, or any pixel value.',
		parameters: z.object({ width: z.number().min(280).max(3840) }),
		async execute({ width }) {
			if (typeof window !== 'undefined') {
				window.dispatchEvent(new CustomEvent('admin:previewBreakpoint', { detail: { width } }));
			}
			return { width };
		},
	}),

	commitPending: action({
		name: 'commitPending',
		description: 'Commit all staged changes to the database in order.',
		parameters: z.object({ confirm: z.boolean() }),
		async execute({ confirm }, { client, api }) {
			if (!confirm) return { committed: 0, error: 'not confirmed' };
			let committed = 0;
			for (const flag of pendingFlags) {
				await client.mutation(api.siteConfig.setFeatureFlag, {
					key: flag.flagId,
					enabled: flag.enabled,
					category: 'layout',
				});
				committed++;
			}
			pendingFlags = [];
			pendingChanges.clear();
			return { committed };
		},
	}),
} as const satisfies Record<string, ActionSpec>;

export type RegistryKey = keyof typeof registry;
export type RegistryAction = (typeof registry)[RegistryKey];
