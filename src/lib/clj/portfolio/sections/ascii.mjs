import * as squint_core from 'squint-cljs/core.js';
import * as data from './../data/content.mjs';
import * as portfolio_DOT_data_DOT_content from './../data/content.mjs';
var get_ascii_hiccup = function () {
return ["section", ({"class": "ascii-diagram-section"}), ["header", ({"class": "section-header"}), ["span", ({"class": "section-marker"}), "◆"], ["h2", ({"class": "section-title"}), "SYSTEM TOPOLOGY"]], ["div", ({"class": "ascii-container"}), ["pre", ({"class": "ascii-art"}), `${"\n    ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐\n    │     CORE A      │       │     CORE B      │       │     CORE C      │\n    │   (Research)    │ ───▶  │  (Implementation)│ ───▶  │   (Deployment)  │\n    └────────┬────────┘       └────────┬────────┘       └────────┬────────┘\n             │                         │                         │\n             ▼                         ▼                         ▼\n    ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐\n    │      EDN        │       │     HICCUP      │       │     SVELTE      │\n    │   (Structure)   │ ───▶  │     (View)      │ ───▶  │    (Runtime)    │\n    └─────────────────┘       └─────────────────┘       └─────────────────┘\n"}`]]];

};

export { get_ascii_hiccup }
