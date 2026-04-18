import * as squint_core from 'squint-cljs/core.js';
var parallax_multipliers = ({"spring": 0.1, "frictionless": 0, "string": 0.25});
var scroll_behaviors = ({"spring": "smooth", "frictionless": "auto", "string": "smooth"});
var get_parallax_multiplier = function (mode) {
return squint_core.get(parallax_multipliers, mode, 0.1);

};
var get_scroll_behavior = function (mode) {
return squint_core.get(scroll_behaviors, mode, "smooth");

};

export { parallax_multipliers, scroll_behaviors, get_parallax_multiplier, get_scroll_behavior }
