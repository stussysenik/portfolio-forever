import * as squint_core from 'squint-cljs/core.js';
var section_categories = ({"content": (new Set (["hero", "works-grid", "blog-feed", "cv", "timeline", "academia"])), "media": (new Set (["gallery", "terminal"])), "layout": (new Set (["process", "gifts", "os", "likes", "minor", "labs"]))});
var section_registry = [({"category": "content", "animation-speed": 1, "animation-opacity": 0.5, "view-mode": "grid", "route": "/", "immune": false, "label": "Home", "id": "hero", "animation-bg": "none"}), ({"category": "content", "animation-speed": 1, "animation-opacity": 0.5, "view-mode": "grid", "route": "/works", "immune": false, "label": "Works", "id": "works-grid", "animation-bg": "none"}), ({"category": "content", "animation-speed": 1, "animation-opacity": 0.5, "view-mode": "grid", "route": "/talks", "immune": false, "label": "Talks", "id": "timeline", "animation-bg": "none"}), ({"category": "media", "animation-speed": 1, "animation-opacity": 0.5, "view-mode": "terminal", "route": "/terminal", "immune": false, "label": "Terminal", "id": "terminal", "animation-bg": "none"}), ({"category": "content", "animation-speed": 1, "animation-opacity": 0.5, "view-mode": "timeline", "route": "/cv", "immune": false, "label": "CV", "id": "cv", "animation-bg": "none"}), ({"category": "content", "animation-speed": 1, "animation-opacity": 0.5, "view-mode": "grid", "route": "/academia", "immune": false, "label": "Re:mix", "id": "academia", "animation-bg": "none"}), ({"category": "content", "animation-speed": 1, "animation-opacity": 0.5, "view-mode": "list", "route": "/blog", "immune": false, "label": "Blog", "id": "blog-feed", "animation-bg": "none"}), ({"category": "layout", "animation-speed": 1, "animation-opacity": 0.5, "view-mode": "cycle", "route": "/process", "immune": false, "label": "Process", "id": "process", "animation-bg": "none"}), ({"category": "media", "animation-speed": 1, "animation-opacity": 0.5, "view-mode": "mosaic", "route": "/gallery", "immune": false, "label": "Gallery", "id": "gallery", "animation-bg": "none"}), ({"category": "layout", "animation-speed": 1, "animation-opacity": 0.5, "view-mode": "list", "route": "/likes", "immune": false, "label": "Likes", "id": "likes", "animation-bg": "none"}), ({"category": "layout", "animation-speed": 1, "animation-opacity": 0.5, "view-mode": "list", "route": "/minor", "immune": false, "label": "Minor", "id": "minor", "animation-bg": "none"}), ({"category": "layout", "animation-speed": 1, "animation-opacity": 0.5, "view-mode": "list", "route": "/labs", "immune": false, "label": "Labs", "id": "labs", "animation-bg": "none"}), ({"category": "layout", "animation-speed": 1, "animation-opacity": 0.5, "view-mode": "list", "route": "/gifts", "immune": false, "label": "Gifts", "id": "gifts", "animation-bg": "none"}), ({"category": "layout", "animation-speed": 1, "animation-opacity": 0.5, "view-mode": "desktop", "route": "/os", "immune": false, "label": "OS", "id": "os", "animation-bg": "none"})];
var get_section = function (id) {
return squint_core.first(squint_core.filterv((function (_PERCENT_1) {
return squint_core._EQ_(squint_core.get(_PERCENT_1, "id"), id);

}), section_registry));

};
var get_sections_by_category = function (category) {
return squint_core.filterv((function (_PERCENT_1) {
return squint_core._EQ_(squint_core.get(_PERCENT_1, "category"), category);

}), section_registry);

};
var section_routes = function () {
return squint_core.mapv((function (_PERCENT_1) {
return squint_core.select_keys(_PERCENT_1, ["id", "label", "route"]);

}), section_registry);

};

export { section_categories, section_registry, get_section, get_sections_by_category, section_routes }
