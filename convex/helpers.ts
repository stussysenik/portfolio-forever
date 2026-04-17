import { GenericMutationCtx } from "convex/server";
import { DataModel } from "./_generated/dataModel";

/** Strip undefined values from an object before passing to db.patch */
export function stripUndefined(obj: Record<string, unknown>): Record<string, unknown> {
	return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
}

/** Utility to log administrative actions to the history table */
export async function logHistory(
	ctx: GenericMutationCtx<DataModel>,
	args: {
		table: string;
		field: string;
		oldValue: any;
		newValue: any;
	}
) {
	const identity = await ctx.auth.getUserIdentity();
	await ctx.db.insert("adminHistory", {
		...args,
		user: identity?.tokenIdentifier ?? "anonymous",
		timestamp: Date.now(),
	});
}
