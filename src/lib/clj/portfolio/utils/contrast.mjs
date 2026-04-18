import * as squint_core from 'squint-cljs/core.js';
var dark = "#1a1a1a";
var light = "#ffffff";
var featured_hex = ({"cloud": "#F0EEE9", "gold": "#D2AF26", "orange": "#F97242", "ocean": "#B3EBF2", "yellow": "#fff5c2", "pink": "#FFC5D3", "green": "#cef3da", "electric-green": "#44D62C", "red": "#691424"});
var hex__GT_linear_rgb = function (hex) {
const h1 = hex.replace(/^#/, "");
const full2 = (((h1.length === 3)) ? (`${squint_core.nth(h1, 0)??''}${squint_core.nth(h1, 0)??''}${squint_core.nth(h1, 1)??''}${squint_core.nth(h1, 1)??''}${squint_core.nth(h1, 2)??''}${squint_core.nth(h1, 2)??''}`) : (h1));
const r3 = (parseInt(full2.slice(0, 2), 16) / 255);
const g4 = (parseInt(full2.slice(2, 4), 16) / 255);
const b5 = (parseInt(full2.slice(4, 6), 16) / 255);
const linearize6 = (function (c) {
if ((c <= 0.04045)) {
return (c / 12.92)} else {
return Math.pow(((c + 0.055) / 1.055), 2.4)};

});
return [linearize6(r3), linearize6(g4), linearize6(b5)];

};
var relative_luminance = function (hex) {
const vec__14 = hex__GT_linear_rgb(hex);
const r5 = squint_core.nth(vec__14, 0, null);
const g6 = squint_core.nth(vec__14, 1, null);
const b7 = squint_core.nth(vec__14, 2, null);
return ((0.2126 * r5) + (0.7152 * g6) + (0.0722 * b7));

};
var contrast_ratio = function (l1, l2) {
const lighter1 = Math.max(l1, l2);
const darker2 = Math.min(l1, l2);
return ((lighter1 + 0.05) / (darker2 + 0.05));

};
var get_contrast_color = function (bg_hex) {
const bg_lum1 = relative_luminance(bg_hex);
const dark_ratio2 = contrast_ratio(bg_lum1, relative_luminance(dark));
const light_ratio3 = contrast_ratio(bg_lum1, relative_luminance(light));
if ((dark_ratio2 >= 4.5)) {
return dark} else {
if ((light_ratio3 >= 4.5)) {
return light} else {
if ((light_ratio3 > dark_ratio2)) {
return light} else {
if ("else") {
return dark} else {
return null}}}};

};
var get_highlight_text_color = function (featured) {
if (squint_core.truth_(featured)) {
const temp__23126__auto__1 = squint_core.get(featured_hex, featured);
if (squint_core.truth_(temp__23126__auto__1)) {
const bg2 = temp__23126__auto__1;
return get_contrast_color(bg2);
};
};

};
var hex_to_rgb = function (hex) {
return hex__GT_linear_rgb(hex);

};
var get_luminance = function (hex) {
return relative_luminance(hex);

};
var get_contrast_ratio = function (l1, l2) {
return contrast_ratio(l1, l2);

};

export { light, get_contrast_ratio, featured_hex, hex_to_rgb, contrast_ratio, get_contrast_color, dark, get_highlight_text_color, hex__GT_linear_rgb, relative_luminance, get_luminance }
