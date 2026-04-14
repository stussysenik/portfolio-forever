import type { DepthLevel } from "$lib/stores/controls";

/** Sections visible in 5-min "screen pass" mode */
const SCREEN_PASS_SECTIONS = ["hero", "works", "cv"];

/**
 * Filter section IDs by depth level.
 * - "full": all sections (current default behavior)
 * - "15-min": all sections (same set, truncation handled per-section)
 * - "5-min": hero + works + cv only
 */
export function filterByDepth(sections: string[], depth: DepthLevel): string[] {
	if (depth === "5-min") {
		return sections.filter((id) => SCREEN_PASS_SECTIONS.includes(id));
	}
	return sections;
}
