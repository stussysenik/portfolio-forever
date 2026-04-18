import * as squint_core from 'squint-cljs/core.js';
var view_modes = (new Set (["grid", "case-study", "minimal-list"]));
var strip_convex_meta = function (doc) {
"Strip Convex system fields (_id, _creationTime) before passing to mutations.";
const result1 = Object.assign(({}), doc);
delete$(result1, "_id");
delete$(result1, "_creationTime");
return result1;

};
var defaults = ({"hero": ({"hero-name-size": 3.5, "hero-name-weight": 400, "hero-name-letter-spacing": 0, "hero-name-line-height": 1.2, "hero-name-text-wrap": "wrap"}), "site-config": ({"mode": "multi-page", "parallax-speed": 0.5})});
var line_height_scale = [1, 1.15, 1.25, 1.375, 1.5, 1.625, 1.75, 2];
var font_size_scale = [({"id": "2xs", "rem": 0.625}), ({"id": "xs", "rem": 0.75}), ({"id": "sm", "rem": 0.875}), ({"id": "base", "rem": 1}), ({"id": "lg", "rem": 1.125}), ({"id": "xl", "rem": 1.25}), ({"id": "2xl", "rem": 1.5}), ({"id": "3xl", "rem": 1.875}), ({"id": "4xl", "rem": 2.25}), ({"id": "5xl", "rem": 3}), ({"id": "6xl", "rem": 3.75}), ({"id": "display", "rem": 4.5})];
var typography_defaults = ({"font-size": 1, "font-weight": 400, "letter-spacing": 0, "line-height": 1.5});
var named_colors = ["orange", "green", "electric-green", "ocean", "gold", "pink", "cloud", "red", "yellow"];
var color_css = ({"cloud": "#F0EEE9", "gold": "#D2AF26", "orange": "#F97242", "ocean": "#B3EBF2", "yellow": "#D2AF26", "pink": "#FFC5D3", "green": "#44D62C", "electric-green": "#44D62C", "red": "#691424"});
var flag_categories = [({"id": "visual", "label": "Visual", "flags": ["pixel-engine", "ascii-donut", "parallax", "terminal-matrix"]}), ({"id": "layout", "label": "Layout", "flags": ["view-transitions", "wip-banner", "elevator"]}), ({"id": "system", "label": "System", "flags": ["os-desktop", "social-links", "command-palette"]})];
var format_relative_time = function (timestamp) {
const diff1 = (Date.now() - timestamp);
const mins2 = Math.floor((diff1 / 60000));
if ((mins2 < 1)) {
return "just now"} else {
if ((mins2 < 60)) {
return `${mins2??''}${"m ago"}`} else {
if ("else") {
const hours3 = Math.floor((mins2 / 60));
if ((hours3 < 24)) {
return `${hours3??''}${"h ago"}`} else {
const days4 = Math.floor((hours3 / 24));
if ((days4 < 30)) {
return `${days4??''}${"d ago"}`} else {
return `${Math.floor((days4 / 30))??''}${"mo ago"}`};
};
} else {
return null}}};

};

export { view_modes, color_css, typography_defaults, strip_convex_meta, font_size_scale, named_colors, line_height_scale, format_relative_time, flag_categories, defaults }
