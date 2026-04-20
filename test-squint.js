import { process_steps } from "./src/lib/clj/portfolio/data/content.mjs";
import { get_cv_hiccup } from "./src/lib/clj/portfolio/sections/cv.mjs";

console.log("Process step 0:", process_steps[0]);
console.log("CV hiccup:", get_cv_hiccup(false));
