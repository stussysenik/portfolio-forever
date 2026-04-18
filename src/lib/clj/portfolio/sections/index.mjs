import * as squint_core from 'squint-cljs/core.js';
var section_routes = [({"id": "hero", "label": "Home", "route": "/"}), ({"id": "works", "label": "Works", "route": "/works"}), ({"id": "talks", "label": "Talks", "route": "/talks"}), ({"id": "terminal", "label": "Terminal", "route": "/terminal"}), ({"id": "cv", "label": "CV", "route": "/cv"}), ({"id": "academia", "label": "Re:mix", "route": "/academia"}), ({"id": "blog", "label": "Blog", "route": "/blog"}), ({"id": "process", "label": "Process", "route": "/process"}), ({"id": "gallery", "label": "Gallery", "route": "/gallery"}), ({"id": "likes", "label": "Likes", "route": "/likes"}), ({"id": "minor", "label": "Minor", "route": "/minor"}), ({"id": "gifts", "label": "Gifts", "route": "/gifts"}), ({"id": "os", "label": "OS", "route": "/os"})];
var route_for_section = function (section_id) {
return squint_core.get(squint_core.first(squint_core.filterv((function (_PERCENT_1) {
return squint_core._EQ_(squint_core.get(_PERCENT_1, "id"), section_id);

}), section_routes)), "route");

};
var section_for_route = function (route) {
return squint_core.get(squint_core.first(squint_core.filterv((function (_PERCENT_1) {
return squint_core._EQ_(squint_core.get(_PERCENT_1, "route"), route);

}), section_routes)), "id");

};

export { section_routes, route_for_section, section_for_route }
