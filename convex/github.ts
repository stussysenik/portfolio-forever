import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

/** Return all GitHub projects sorted by order */
export const getAll = query({
	args: {},
	handler: async (ctx) => {
		return await ctx.db
			.query("githubProjects")
			.withIndex("by_order")
			.collect();
	},
});

/** Toggle enabled boolean by _id */
export const toggleEnabled = mutation({
	args: {
		id: v.id("githubProjects"),
	},
	handler: async (ctx, args) => {
		const project = await ctx.db.get(args.id);
		if (!project) {
			throw new Error("GitHub project not found");
		}

		await ctx.db.patch(args.id, { enabled: !project.enabled });
	},
});

/** Internal mutation for upserting a single GitHub repo */
export const upsertRepo = mutation({
	args: {
		repoName: v.string(),
		description: v.string(),
		language: v.optional(v.string()),
		url: v.string(),
		category: v.string(),
		lastSynced: v.number(),
	},
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query("githubProjects")
			.withIndex("by_repoName", (q) => q.eq("repoName", args.repoName))
			.unique();

		if (existing) {
			await ctx.db.patch(existing._id, {
				description: args.description,
				language: args.language,
				url: args.url,
				category: args.category,
				lastSynced: args.lastSynced,
			});
		} else {
			// Count existing projects to determine order
			const allProjects = await ctx.db
				.query("githubProjects")
				.withIndex("by_order")
				.collect();

			await ctx.db.insert("githubProjects", {
				repoName: args.repoName,
				description: args.description,
				language: args.language,
				url: args.url,
				category: args.category,
				enabled: true,
				featured: false,
				order: allProjects.length,
				lastSynced: args.lastSynced,
			});
		}
	},
});

/** Categorize a repo by its primary language */
function categorizeByLanguage(language: string | null): string {
	if (!language) return "tools";

	switch (language) {
		case "Zig":
		case "C":
		case "C++":
		case "Objective-C":
			return "design-eng";
		case "Python":
			return "research";
		case "Elixir":
		case "Ruby":
		case "HTML":
			return "creative";
		case "TypeScript":
		case "JavaScript":
		case "Lua":
		case "Swift":
			return "tools";
		default:
			return "tools";
	}
}

/** Sync repos from GitHub API — fetches public non-fork repos and upserts them */
export const syncRepos = action({
	args: {},
	handler: async (ctx) => {
		const response = await fetch(
			"https://api.github.com/users/stussysenik/repos?per_page=100",
			{
				headers: {
					Accept: "application/vnd.github.v3+json",
					"User-Agent": "portfolio-forever-sync",
				},
			},
		);

		if (!response.ok) {
			throw new Error(
				`GitHub API error: ${response.status} ${response.statusText}`,
			);
		}

		const repos: Array<{
			name: string;
			description: string | null;
			language: string | null;
			html_url: string;
			fork: boolean;
		}> = await response.json();

		// Filter out forks — only keep original repos
		const originalRepos = repos.filter((repo) => repo.fork === false);

		const now = Date.now();
		let synced = 0;

		for (const repo of originalRepos) {
			await ctx.runMutation(api.github.upsertRepo, {
				repoName: repo.name,
				description: repo.description ?? "",
				language: repo.language ?? undefined,
				url: repo.html_url,
				category: categorizeByLanguage(repo.language),
				lastSynced: now,
			});
			synced++;
		}

		return { synced, total: repos.length, filtered: repos.length - synced };
	},
});
