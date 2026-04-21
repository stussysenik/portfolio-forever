/**
 * Data override layer — merges canonical Convex data with staged CMS changes.
 * Ported from clj/portfolio/data/overrides.cljs
 */

export function mergePatch(base: any, patch: any) {
	if (base && patch) {
		const result = { ...base, ...patch };
		// Handle special nested merging if needed (e.g. sections in pages)
		if (base.sections && patch.sections) {
			result.sections = patch.sections;
		}
		return result;
	}
	return patch || base;
}

export function applyOverrides(table: string, data: any, overrides: any) {
	if (!overrides) return data;

	if (Array.isArray(data)) {
		// Handle arrays (worksEntries, blogPosts, etc.)
		const patchMap = new Map();
		Object.keys(overrides).forEach((id) => {
			const [t, docId] = id.split(":");
			if (t === table) {
				patchMap.set(docId, overrides[id].patch);
			}
		});

		const baseIds = new Set(data.map((item) => item._id || item.id));
		const merged = data.map((item) => {
			const id = item._id || item.id;
			const patch = patchMap.get(id);
			if (patch) {
				return mergePatch(item, patch);
			}
			return item;
		});

		// Add new items that aren't in base data yet
		const newItems: any[] = [];
		patchMap.forEach((patch, id) => {
			if (!baseIds.has(id)) {
				newItems.push(mergePatch({}, patch));
			}
		});

		return [...merged, ...newItems];
	}

	// Handle singletons (siteConfig, heroConfig)
	const singletonId = `${table}:singleton`;
	const patchChange = overrides[singletonId];
	if (patchChange) {
		return mergePatch(data, patchChange.patch);
	}

	return data;
}

export const exports = {
	applyOverrides,
};
