// Re-exporting from Clojure Abstraction Layer with camelCase parity
import * as clj from "$lib/clj/portfolio/data/cv.mjs";

export const cvData = clj.cv_data;
export const generateJsonLd = clj.generate_json_ld;
