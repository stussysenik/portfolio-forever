import * as squint_core from 'squint-cljs/core.js';
var get_registry_schema = function (registry) {
"Generates Anthropic tool specs from the action registry map.";
const result1 = squint_core.atom([]);
for (let G__2 of squint_core.iterable(Object.keys(registry))) {
const key3 = G__2;
const spec4 = registry[key3];
const params5 = spec4.parameters;
const properties6 = Object.create(null);
const required7 = squint_core.atom([]);
for (let G__8 of squint_core.iterable(Object.keys(params5))) {
const pkey9 = G__8;
const pdef10 = params5[pkey9];
const prop11 = Object.create(null);
if (squint_core.truth_(squint_core.get(pdef10, "type"))) {
(prop11["type"] = squint_core.get(pdef10, "type"))};
if (squint_core.truth_(squint_core.get(pdef10, "description"))) {
(prop11["description"] = squint_core.get(pdef10, "description"))};
if (squint_core.truth_(squint_core.get(pdef10, "format"))) {
(prop11["format"] = squint_core.get(pdef10, "format"))};
(properties6[pkey9] = prop11);
if (squint_core.truth_(squint_core.get(pdef10, "required"))) {
squint_core.swap_BANG_(required7, squint_core.conj, pkey9)}
};
squint_core.swap_BANG_(result1, squint_core.conj, ({"name": spec4.name, "description": spec4.description, "input_schema": ({"type": "object", "properties": properties6, "required": squint_core.clj__GT_js(squint_core.deref(required7))})}))
};
return squint_core.clj__GT_js(squint_core.deref(result1));

};
var get_registry_summary = function (registry) {
"Returns a simplified summary of available actions.";
const result1 = squint_core.atom([]);
for (let G__2 of squint_core.iterable(Object.keys(registry))) {
const key3 = G__2;
const spec4 = registry[key3];
squint_core.swap_BANG_(result1, squint_core.conj, ({"name": spec4.name, "description": spec4.description}))
};
return squint_core.clj__GT_js(squint_core.deref(result1));

};

export { get_registry_schema, get_registry_summary }
