import * as squint_core from 'squint-cljs/core.js';
import { writable } from 'svelte/store';
var next_id = squint_core.atom(0);
var create_toast_store = function () {
const store1 = writable([]);
const update2 = store1["update"];
const dismiss3 = (function (id) {
return update2((function (t) {
return t.filter((function (toast) {
return !squint_core._EQ_(toast["id"], id);

}));

}));

});
const add4 = (function (msg, type) {
const id5 = squint_core.swap_BANG_(next_id, squint_core.inc);
update2((function (t) {
return t.concat([({"id": id5, "message": msg, "type": (() => {
const or__23461__auto__6 = type;
if (squint_core.truth_(or__23461__auto__6)) {
return or__23461__auto__6} else {
return "info"};

})()})]);

}));
return setTimeout((function () {
return dismiss3(id5);

}), 3000);

});
return ({"subscribe": store1["subscribe"], "success": (function (msg) {
return add4(msg, "success");

}), "error": (function (msg) {
return add4(msg, "error");

}), "info": (function (msg) {
return add4(msg, "info");

}), "add": add4, "dismiss": dismiss3});

};
var toast = create_toast_store();

export { next_id, create_toast_store, toast }
