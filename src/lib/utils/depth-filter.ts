// Re-exporting from Clojure Abstraction Layer with camelCase parity
import * as clj from "$lib/clj/portfolio/utils/depth_filter.mjs";

export const filterByDepth = clj.filter_by_depth;
export const isScreenPass = clj.is_screen_pass;
export const isDeepDive = clj.is_deep_dive;
export const isFullArchive = clj.is_full_archive;
