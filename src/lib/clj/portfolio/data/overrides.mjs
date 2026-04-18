import * as squint_core from 'squint-cljs/core.js';
var merge_patch = function (base, patch) {
if (squint_core.truth_((() => {
const and__23501__auto__1 = base;
if (squint_core.truth_(and__23501__auto__1)) {
return patch} else {
return and__23501__auto__1};

})())) {
const result2 = Object.assign(({}), base, patch);
if (squint_core.truth_((() => {
const and__23501__auto__3 = base["sections"];
if (squint_core.truth_(and__23501__auto__3)) {
return patch["sections"]} else {
return and__23501__auto__3};

})())) {
(result2["sections"] = patch["sections"])};
return result2;
} else {
const or__23461__auto__4 = patch;
if (squint_core.truth_(or__23461__auto__4)) {
return or__23461__auto__4} else {
return base};
};

};
var apply_overrides = function (table, data, overrides) {
if (squint_core.truth_(Array.isArray(data))) {
const patch_map1 = (new Map());
Object.keys(overrides).forEach((function (id) {
const parts2 = id.split(":");
const t3 = parts2[0];
const doc_id4 = parts2[1];
if (squint_core._EQ_(t3, table)) {
return patch_map1.set(doc_id4, overrides[id].patch);
};

}));
const base_ids5 = (new Set(squint_core.map((function (_PERCENT_1) {
const or__23461__auto__6 = _PERCENT_1["_id"];
if (squint_core.truth_(or__23461__auto__6)) {
return or__23461__auto__6} else {
return _PERCENT_1["id"]};

}), data)));
const merged7 = squint_core.map((function (item) {
const id8 = (() => {
const or__23461__auto__9 = item["_id"];
if (squint_core.truth_(or__23461__auto__9)) {
return or__23461__auto__9} else {
return item["id"]};

})();
const patch10 = patch_map1.get(id8);
if (squint_core.truth_(patch10)) {
return merge_patch(item, patch10)} else {
return item};

}), data);
const new_items11 = [];
patch_map1.forEach((function (patch, id) {
if (squint_core.not(base_ids5.has(id))) {
return new_items11.push(merge_patch(({}), patch));
};

}));
return Array.from(squint_core.concat(merged7, new_items11));
} else {
const id12 = `${table??''}${":singleton"}`;
const patch_change13 = overrides[id12];
if (squint_core.truth_(patch_change13)) {
return merge_patch(data, patch_change13.patch)} else {
return data};
};

};
var exports = ({"applyOverrides": apply_overrides});

export { merge_patch, apply_overrides, exports }
