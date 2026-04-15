import { z } from 'zod';

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

function action<TSchema extends z.ZodTypeAny>(spec: ActionSpec<TSchema>): ActionSpec<TSchema> {
	return spec;
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
			return client.mutation(api.siteConfig.setFeatureFlag, { flagId, enabled });
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
} as const satisfies Record<string, ActionSpec>;

export type RegistryKey = keyof typeof registry;
export type RegistryAction = (typeof registry)[RegistryKey];
