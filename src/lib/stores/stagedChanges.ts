import { derived } from 'svelte/store';
// @ts-ignore
import { exports as staging } from '../clj/portfolio/admin/staging.mjs';

export const stagedChanges = staging;

export const stagedChangesCount = derived(stagedChanges, (map: any) => map.size);

export const stagedChangesLabels = derived(stagedChanges, (map: any) => {
	const labels: string[] = [];
	map.forEach((c: any) => labels.push(c.label));
	return labels;
});
