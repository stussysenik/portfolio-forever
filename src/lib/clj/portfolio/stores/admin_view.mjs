import * as squint_core from 'squint-cljs/core.js';
import { writable } from 'svelte/store';
var admin_view_store = (() => {
const initial_state1 = ({"currentView": "dashboard", "currentSubView": null});
const store2 = writable(initial_state1);
return ({"subscribe": store2.subscribe, "setView": (function (view, sub_view) {
return store2.set(({"currentView": view, "currentSubView": sub_view}));

}), "update": store2.update});

})();

export { admin_view_store }
