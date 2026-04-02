import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const insert = mutation({
	args: {
		table: v.string(),
		field: v.string(),
		oldValue: v.any(),
		newValue: v.any(),
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert("adminHistory", {
			...args,
			timestamp: Date.now(),
		});
	},
});

export const getRecent = query({
	args: {
		table: v.string(),
		field: v.string(),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, { table, field, limit }) => {
		const rows = await ctx.db
			.query("adminHistory")
			.withIndex("by_table_field", (q) => q.eq("table", table).eq("field", field))
			.order("desc")
			.collect();
		return rows.slice(0, limit ?? 5);
	},
});
