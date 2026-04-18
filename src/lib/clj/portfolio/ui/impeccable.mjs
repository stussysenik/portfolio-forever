import * as squint_core from 'squint-cljs/core.js';
var grid_columns = 12;
var base_unit = 12;
var px = function (units) {
return `${(units * base_unit)??''}px`;

};
var rem = function (units) {
return `${(units * 0.75)??''}rem`;

};
var get_hero_layout = function (view_mode) {
const G__11 = view_mode;
switch (G__11) {case "editorial":
return ({"identity": 5, "visual": 7});

break;
case "balanced":
return ({"identity": 6, "visual": 6});

break;
case "focus":
return ({"identity": 4, "visual": 8});

break;
default:
return ({"identity": 5, "visual": 7})};

};
var vertical_space = function (scale) {
const G__21 = scale;
switch (G__21) {case "xs":
return rem(1);

break;
case "sm":
return rem(2);

break;
case "md":
return rem(4);

break;
case "lg":
return rem(8);

break;
case "xl":
return rem(12);

break;
default:
return rem(4)};

};

export { grid_columns, base_unit, px, rem, get_hero_layout, vertical_space }
