// Re-exporting from Clojure Abstraction Layer with camelCase parity
import * as clj from "$lib/clj/portfolio/utils/contrast.mjs";

export const featuredHex = clj.featured_hex;
export const getContrastColor = clj.get_contrast_color;
export const getHighlightTextColor = clj.get_highlight_text_color;
export const hexToRgb = clj.hex_to_rgb;
export const getLuminance = clj.get_luminance;
export const getContrastRatio = clj.get_contrast_ratio;
