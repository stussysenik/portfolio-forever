import * as squint_core from 'squint-cljs/core.js';
import * as clojure_DOT_string from 'squint-cljs/src/squint/string.js';
import * as convex from './../convex/client.mjs';
import * as portfolio_DOT_convex_DOT_client from './../convex/client.mjs';
import * as data from './../data/content.mjs';
import * as portfolio_DOT_data_DOT_content from './../data/content.mjs';
import { api } from '$lib/app-shims';;
var use_static_preview_QMARK_ = function (project) {
const or__23461__auto__1 = (project["previewMode"] === "static");
if (or__23461__auto__1) {
return or__23461__auto__1} else {
const and__23501__auto__2 = project["preview"];
if (squint_core.truth_(and__23501__auto__2)) {
return squint_core.not(project["videoPreview"])} else {
return and__23501__auto__2};
};

};
var use_video_preview_QMARK_ = function (project) {
const or__23461__auto__1 = (project["previewMode"] === "video");
if (or__23461__auto__1) {
return or__23461__auto__1} else {
const and__23501__auto__2 = project["videoPreview"];
if (squint_core.truth_(and__23501__auto__2)) {
return project["preview"]} else {
return and__23501__auto__2};
};

};
var get_object_position = function (project) {
const or__23461__auto__1 = project["objectPosition"];
if (squint_core.truth_(or__23461__auto__1)) {
return or__23461__auto__1} else {
const fx2 = project["focalX"];
const fy3 = project["focalY"];
if (squint_core.truth_((() => {
const and__23501__auto__4 = fx2;
if (squint_core.truth_(and__23501__auto__4)) {
return fy3} else {
return and__23501__auto__4};

})())) {
return `${fx2??''}${"% "}${fy3??''}${"%"}`} else {
return "center top"};
};

};
var get_zoom_style = function (project) {
const temp__23055__auto__1 = project["zoom"];
if (squint_core.truth_(temp__23055__auto__1)) {
const zoom2 = temp__23055__auto__1;
return `${"transform: scale("}${zoom2??''}${"); transform-origin: "}${get_object_position(project)??''}${";"}`;
} else {
return ""};

};
var override_vars = function (project) {
"Collect styleOverrides as inline CSS var declarations.";
const o1 = (() => {
const or__23461__auto__2 = project["styleOverrides"];
if (squint_core.truth_(or__23461__auto__2)) {
return or__23461__auto__2} else {
return ({})};

})();
return clojure_DOT_string.join("; ", squint_core.filterv(squint_core.some_QMARK_, [(() => {
const temp__23126__auto__3 = o1["accentColor"];
if (squint_core.truth_(temp__23126__auto__3)) {
const v4 = temp__23126__auto__3;
return `${"--works-stripe-color: "}${v4??''}`;
};

})(), (() => {
const temp__23126__auto__5 = o1["httpColor"];
if (squint_core.truth_(temp__23126__auto__5)) {
const v6 = temp__23126__auto__5;
return `${"--works-http-color: "}${v6??''}`;
};

})(), (() => {
const temp__23126__auto__7 = o1["secondaryHighlight"];
if (squint_core.truth_(temp__23126__auto__7)) {
const v8 = temp__23126__auto__7;
return `${"--works-secondary-highlight: "}${v8??''}`;
};

})()]));

};
var color_map = ({"cloud": "#EBEBEB", "gold": "#DAB230", "orange": "#F97242", "ocean": "#BAF1F9", "yellow": "#FFEB3B", "pink": "#FFC0CB", "green": "#4CAF50", "electric-green": "#39FF14", "red": "#F44336"});
var get_row_style = function (work) {
const featured1 = work["featured"];
const style_overrides2 = work["styleOverrides"];
const temp__23055__auto__3 = squint_core.get(color_map, featured1);
if (squint_core.truth_(temp__23055__auto__3)) {
const color4 = temp__23055__auto__3;
return `${"--row-bg: "}${color4??''}`;
} else {
if (squint_core.truth_((() => {
const and__23501__auto__5 = style_overrides2;
if (squint_core.truth_(and__23501__auto__5)) {
return style_overrides2["accentColor"]} else {
return and__23501__auto__5};

})())) {
return `${"--row-bg: "}${style_overrides2["accentColor"]??''}`} else {
return ""}};

};
var format_work_date = function (work) {
const y1 = work["year"];
const m2 = work["month"];
if (squint_core.truth_((() => {
const and__23501__auto__3 = y1;
if (squint_core.truth_(and__23501__auto__3)) {
return m2} else {
return and__23501__auto__3};

})())) {
return `${y1??''}${"."}${`${m2??''}`.padStart(2, "0")??''}`} else {
const or__23461__auto__4 = y1;
if (squint_core.truth_(or__23461__auto__4)) {
return or__23461__auto__4} else {
return ""};
};

};
var get_works_hiccup = function (projects, display_mode, grid_cols, show_preview, view_mode, is_screen_pass) {
"Returns the works section as a Hiccup-like structure.";
const visible_projects1 = ((squint_core.truth_(is_screen_pass)) ? (projects.slice(0, 11)) : (projects));
const children2 = squint_core.map((function (p) {
return ["a", ({"href": p["url"], "target": "_blank", "class": "work-row", "style": get_row_style(p)}), ["span", ({"class": "work-date"}), format_work_date(p)], ["span", ({"class": "work-title"}), p["title"]], ["span", ({"class": "work-link"}), "visit"]];

}), visible_projects1);
const div3 = ["div", ({"class": "works-list"})];
for (let G__4 of squint_core.iterable(children2)) {
const c5 = G__4;
div3.push(c5)
};
return ["section", ({"class": "works-list-container", "id": "works"}), ["header", ({"class": "table-header"}), ["span", ({"class": "table-marker"}), "◆"], ["h2", ({"class": "table-title"}), "WORKS"], ["span", ({"class": "table-count"}), `${"["}${squint_core.count(projects)??''}${"]"}`]], div3];

};
var setup_works_subscriptions = function (client, callbacks) {
"Sets up Convex subscriptions for the works section.\n   callbacks: #js {:onWorks (fn [data] ...) :onThumbnails (fn [data] ...) :onSection (fn [data] ...)}\n   Returns a function to unsubscribe from all.";
const on_works1 = callbacks["onWorks"];
const on_thumbnails2 = callbacks["onThumbnails"];
const on_section3 = callbacks["onSection"];
const api4 = api;
const unsub_works5 = client.onUpdate(api4["works"]["getVisibleWorks"], ({}), (function (data) {
if (squint_core.truth_(on_works1)) {
return on_works1(data);
};

}));
const unsub_thumbnails6 = client.onUpdate(api4["thumbnails"]["getConfig"], ({"section": "works"}), (function (data) {
if (squint_core.truth_(on_thumbnails2)) {
return on_thumbnails2(data);
};

}));
const unsub_section7 = client.onUpdate(api4["sectionRegistry"]["getBySectionId"], ({"sectionId": "works"}), (function (data) {
if (squint_core.truth_(on_section3)) {
return on_section3(data);
};

}));
return function () {
unsub_works5();
unsub_thumbnails6();
return unsub_section7();

};

};

export { get_object_position, get_works_hiccup, setup_works_subscriptions, get_zoom_style, use_static_preview_QMARK_, use_video_preview_QMARK_, color_map, get_row_style, override_vars, format_work_date }
