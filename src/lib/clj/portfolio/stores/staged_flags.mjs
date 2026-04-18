import * as squint_core from 'squint-cljs/core.js';
import { writable } from 'svelte/store';
var create_staged_flags_store = function () {
const store1 = writable((new Map()));
return ({"subscribe": store1.subscribe, "stage": (function (key, enabled, category, label) {
return store1.update((function (m) {
const result2 = (new Map(m));
result2.set(key, ({"key": key, "enabled": enabled, "category": category, "label": label}));
return result2;

}));

}), "unstage": (function (key) {
return store1.update((function (m) {
const result3 = (new Map(m));
result3.delete(key);
return result3;

}));

}), "clear": (function () {
return store1.set((new Map()));

}), "snapshot": (function () {
return store1.get();

})});

};

export { create_staged_flags_store }
