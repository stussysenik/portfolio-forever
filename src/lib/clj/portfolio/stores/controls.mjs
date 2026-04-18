import * as squint_core from 'squint-cljs/core.js';
var depth_levels = ["5-min", "15-min", "full"];
var theme_modes = ["minimalist", "brutalist", "night-vision"];
var physics_modes = ["frictionless", "spring", "string"];
var parallax_multipliers = ({"spring": 0.1, "frictionless": 0, "string": 0.25});
var scroll_behaviors = ({"spring": "smooth", "frictionless": "auto", "string": "smooth"});
var get_parallax_multiplier = function (mode) {
return squint_core.get(parallax_multipliers, mode, 0.1);

};
var get_scroll_behavior = function (mode) {
return squint_core.get(scroll_behaviors, mode, "smooth");

};
var is_screen_pass_QMARK_ = function (depth) {
return (depth === "5-min");

};
var is_deep_dive_QMARK_ = function (depth) {
return (depth === "15-min");

};
var is_full_archive_QMARK_ = function (depth) {
return (depth === "full");

};
var is_night_vision_QMARK_ = function (theme) {
return (theme === "night-vision");

};
var is_brutalist_QMARK_ = function (theme) {
return (theme === "brutalist");

};
var is_fluid_string_QMARK_ = function (physics) {
return (physics === "string");

};
var is_frictionless_QMARK_ = function (physics) {
return (physics === "frictionless");

};

export { physics_modes, depth_levels, is_fluid_string_QMARK_, theme_modes, is_deep_dive_QMARK_, is_full_archive_QMARK_, scroll_behaviors, is_brutalist_QMARK_, parallax_multipliers, get_scroll_behavior, is_screen_pass_QMARK_, is_night_vision_QMARK_, get_parallax_multiplier, is_frictionless_QMARK_ }
