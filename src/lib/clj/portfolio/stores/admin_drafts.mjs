import * as squint_core from 'squint-cljs/core.js';
import { writable } from 'svelte/store';
var init_draft = function (drafts, id, initial_data) {
if (squint_core.truth_(drafts[id])) {
return drafts} else {
const cloned1 = JSON.parse(JSON.stringify(initial_data));
const entry2 = Object.create(null);
(entry2["original"] = cloned1);
(entry2["current"] = cloned1);
(entry2["isDirty"] = false);
const result3 = Object.assign(Object.create(null), drafts);
(result3[id] = entry2);
return result3;
};

};
var update_draft = function (drafts, id, updates) {
const draft1 = drafts[id];
if (squint_core.not(draft1)) {
return drafts} else {
const nextCurrent2 = Object.assign(Object.create(null), draft1.current, updates);
const isDirty3 = !squint_core._EQ_(JSON.stringify(nextCurrent2), JSON.stringify(draft1.original));
const entry4 = Object.create(null);
(entry4["original"] = draft1.original);
(entry4["current"] = nextCurrent2);
(entry4["isDirty"] = isDirty3);
const result5 = Object.assign(Object.create(null), drafts);
(result5[id] = entry4);
return result5;
};

};
var reset_draft = function (drafts, id) {
const draft1 = drafts[id];
if (squint_core.not(draft1)) {
return drafts} else {
const reset2 = JSON.parse(JSON.stringify(draft1.original));
const entry3 = Object.create(null);
(entry3["original"] = draft1.original);
(entry3["current"] = reset2);
(entry3["isDirty"] = false);
const result4 = Object.assign(Object.create(null), drafts);
(result4[id] = entry3);
return result4;
};

};
var commit_draft = function (drafts, id) {
const draft1 = drafts[id];
if (squint_core.not(draft1)) {
return drafts} else {
const committed2 = JSON.parse(JSON.stringify(draft1.current));
const entry3 = Object.create(null);
(entry3["original"] = committed2);
(entry3["current"] = draft1.current);
(entry3["isDirty"] = false);
const result4 = Object.assign(Object.create(null), drafts);
(result4[id] = entry3);
return result4;
};

};
var create_admin_drafts_store = function () {
const store1 = writable(Object.create(null));
return Object.freeze(({"subscribe": store1.subscribe, "initDraft": (function (id, initial_data) {
return store1.update((function (drafts) {
return init_draft(drafts, id, initial_data);

}));

}), "updateDraft": (function (id, updates) {
return store1.update((function (drafts) {
return update_draft(drafts, id, updates);

}));

}), "resetDraft": (function (id) {
return store1.update((function (drafts) {
return reset_draft(drafts, id);

}));

}), "commitDraft": (function (id) {
return store1.update((function (drafts) {
return commit_draft(drafts, id);

}));

})}));

};

export { init_draft, update_draft, reset_draft, commit_draft, create_admin_drafts_store }
