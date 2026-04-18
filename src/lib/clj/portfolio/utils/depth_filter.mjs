import * as squint_core from 'squint-cljs/core.js';
var screen_pass_sections = (new Set (["hero", "works", "cv"]));
var filter_by_depth = function (sections, depth) {
if ((depth === "5-min")) {
return squint_core.filterv((function (_PERCENT_1) {
return squint_core.contains_QMARK_(screen_pass_sections, _PERCENT_1);

}), sections)} else {
return sections};

};
var is_screen_pass = function (depth) {
return (depth === "5-min");

};
var is_deep_dive = function (depth) {
return (depth === "15-min");

};
var is_full_archive = function (depth) {
return (depth === "full");

};

export { screen_pass_sections, filter_by_depth, is_screen_pass, is_deep_dive, is_full_archive }
