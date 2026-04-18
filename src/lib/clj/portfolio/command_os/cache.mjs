import * as squint_core from 'squint-cljs/core.js';
var make_lru_cache = function (max_size) {
const map1 = squint_core.atom((new Map()));
return ({"get": (function (key) {
const m2 = squint_core.deref(map1);
const v3 = m2.get(key);
if (squint_core.truth_(v3)) {
m2.delete(key);
m2.set(key, v3);
return v3;
};

}), "set": (function (key, value) {
const m4 = squint_core.deref(map1);
if (squint_core.truth_(m4.has(key))) {
m4.delete(key)};
m4.set(key, value);
if ((m4.size > max_size)) {
m4.delete(m4.keys().next())};
return value;

}), "clear": (function () {
return squint_core.reset_BANG_(map1, (new Map()));

}), "size": (function () {
return squint_core.deref(map1).size;

})});

};
var command_cache = make_lru_cache(20);

export { make_lru_cache, command_cache }
