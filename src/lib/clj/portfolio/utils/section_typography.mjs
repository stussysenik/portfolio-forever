import * as squint_core from 'squint-cljs/core.js';
import * as clojure_DOT_string from 'squint-cljs/src/squint/string.js';
var get_typography_style = function (config) {
"Build inline style string from section typography config.";
const t1 = (() => {
const and__23501__auto__2 = config;
if (squint_core.truth_(and__23501__auto__2)) {
return config["typography"]} else {
return and__23501__auto__2};

})();
if (squint_core.not(t1)) {
return ""} else {
return clojure_DOT_string.join("; ", squint_core.filterv(squint_core.some_QMARK_, [(() => {
const temp__23126__auto__3 = t1["fontSize"];
if (squint_core.truth_(temp__23126__auto__3)) {
const v4 = temp__23126__auto__3;
return `${"font-size: "}${v4??''}rem`;
};

})(), (() => {
const temp__23126__auto__5 = t1["fontWeight"];
if (squint_core.truth_(temp__23126__auto__5)) {
const v6 = temp__23126__auto__5;
return `${"font-weight: "}${v6??''}`;
};

})(), (() => {
const temp__23126__auto__7 = t1["letterSpacing"];
if (squint_core.truth_(temp__23126__auto__7)) {
const v8 = temp__23126__auto__7;
return `${"letter-spacing: "}${v8??''}em`;
};

})(), (() => {
const temp__23126__auto__9 = t1["lineHeight"];
if (squint_core.truth_(temp__23126__auto__9)) {
const v10 = temp__23126__auto__9;
return `${"line-height: "}${v10??''}`;
};

})()]))};

};

export { get_typography_style }
