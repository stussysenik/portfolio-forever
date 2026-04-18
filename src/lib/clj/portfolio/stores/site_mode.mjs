import * as squint_core from 'squint-cljs/core.js';
import * as str from 'squint-cljs/src/squint/string.js';
import * as clojure_DOT_string from 'squint-cljs/src/squint/string.js';
import * as svelte_store from 'svelte/store';
import { goto, browser } from '$lib/app-shims';;
var writable = svelte_store.writable;
var derived = svelte_store.derived;
var svelte_get = svelte_store.get;
var deep_freeze = function (obj) {
if (squint_core.truth_((() => {
const and__23501__auto__1 = obj;
if (squint_core.truth_(and__23501__auto__1)) {
const or__23461__auto__2 = (() => {
const c__23426__auto__3 = Object;
const x__23427__auto__4 = obj;
const ret__23428__auto__5 = (x__23427__auto__4 instanceof c__23426__auto__3);
return ret__23428__auto__5;

})();
if (squint_core.truth_(or__23461__auto__2)) {
return or__23461__auto__2} else {
const c__23426__auto__6 = Array;
const x__23427__auto__7 = obj;
const ret__23428__auto__8 = (x__23427__auto__7 instanceof c__23426__auto__6);
return ret__23428__auto__8;
};
} else {
return and__23501__auto__1};

})())) {
Object.freeze(obj);
const props9 = Object.getOwnPropertyNames(obj);
for (let G__10 of squint_core.iterable(props9)) {
const prop11 = G__10;
const val12 = obj[prop11];
if (squint_core.truth_((() => {
const and__23501__auto__13 = val12;
if (squint_core.truth_(and__23501__auto__13)) {
const and__23501__auto__21 = (() => {
const or__23461__auto__14 = (() => {
const c__23426__auto__15 = Object;
const x__23427__auto__16 = val12;
const ret__23428__auto__17 = (x__23427__auto__16 instanceof c__23426__auto__15);
return ret__23428__auto__17;

})();
if (squint_core.truth_(or__23461__auto__14)) {
return or__23461__auto__14} else {
const c__23426__auto__18 = Array;
const x__23427__auto__19 = val12;
const ret__23428__auto__20 = (x__23427__auto__19 instanceof c__23426__auto__18);
return ret__23428__auto__20;
};

})();
if (squint_core.truth_(and__23501__auto__21)) {
return squint_core.not(Object.isFrozen(val12))} else {
return and__23501__auto__21};
} else {
return and__23501__auto__13};

})())) {
deep_freeze(val12)}
}};
return obj;

};
var wip_mode = writable(0);
var wip_params = writable(({"banner-message": "WIP — WEBSITE IS UNDER MAINTENANCE", "banner-position": "top", "banner-color": "red", "show-badge": true, "badge-text": "BETA", "hide-experiments-on-full": true, "block-sensitive-calls-on-preview": true}));
if (squint_core.truth_(browser)) {
let saved_mode1 = localStorage.getItem("wipMode");
if (squint_core.truth_(saved_mode1)) {
wip_mode.set(parseInt(saved_mode1, 10))};
wip_mode.subscribe((function (v) {
return localStorage.setItem("wipMode", `${v??''}`);

}))};
var effective_wip_config = derived([wip_params, wip_mode], (function (vals) {
const params1 = vals[0];
const mode2 = vals[1];
return deep_freeze(Object.assign(({}), params1, ({"enabled": (mode2 > 0), "full-block": (mode2 === 2)})));

}));
var site_mode = writable("multi-page");
var reader_override = writable(null);
var is_reader_mode = derived([site_mode, reader_override], (function (vals) {
const mode1 = vals[0];
const override2 = vals[1];
const or__23461__auto__3 = override2;
if (squint_core.truth_(or__23461__auto__3)) {
return or__23461__auto__3} else {
return (mode1 === "reader")};

}));
var staged_overrides = writable(({}));
var base_site_config = writable(({}));
var effective_site_config = derived([base_site_config, staged_overrides], (function (vals) {
const base1 = vals[0];
const overrides2 = vals[1];
const site_patch3 = (() => {
const or__23461__auto__4 = overrides2["siteConfig:singleton"];
if (squint_core.truth_(or__23461__auto__4)) {
return or__23461__auto__4} else {
return ({})};

})();
return deep_freeze(((squint_core.truth_(base1)) ? (Object.assign(({}), base1, site_patch3)) : (({}))));

}));
var base_feature_flags = writable((new Map()));
var effective_feature_flags = derived([base_feature_flags, staged_overrides, wip_mode], (function (vals) {
const base1 = vals[0];
const overrides2 = vals[1];
const wip3 = vals[2];
const result4 = (new Map(base1));
if ((wip3 > 0)) {
result4.set("wip-banner", true)} else {
result4.set("wip-banner", false)};
if ((wip3 === 2)) {
result4.set("pixel-engine", false)};
return result4;

}));
var nav_paradigm = writable("sidebar");
var browser_QMARK_ = browser;
if (squint_core.truth_(browser_QMARK_)) {
let saved2 = localStorage.getItem("navParadigm");
if (squint_core.truth_(squint_core.contains_QMARK_((new Set (["sidebar", "drawer", "hybrid"])), saved2))) {
nav_paradigm.set(saved2)};
nav_paradigm.subscribe((function (v) {
return localStorage.setItem("navParadigm", v);

}))};
var wip_banner_dismissed = writable(false);
if (squint_core.truth_(browser_QMARK_)) {
let saved3 = localStorage.getItem("wipBannerDismissed");
if ((saved3 === "true")) {
wip_banner_dismissed.set(true)};
wip_banner_dismissed.subscribe((function (v) {
return localStorage.setItem("wipBannerDismissed", `${v??''}`);

}))};
var preview_mode = writable(false);
if (squint_core.truth_(browser_QMARK_)) {
let params4 = (new URLSearchParams(window["location"]["search"]));
if ((params4.get("preview") === "true")) {
preview_mode.set(true)}};
var should_block_calls = derived([preview_mode, effective_wip_config], (function (vals) {
const preview1 = vals[0];
const wip_config2 = vals[1];
const or__23461__auto__3 = preview1;
if (squint_core.truth_(or__23461__auto__3)) {
return or__23461__auto__3} else {
const and__23501__auto__4 = wip_config2["full-block"];
if (squint_core.truth_(and__23501__auto__4)) {
return wip_config2["block-sensitive-calls-on-preview"]} else {
return and__23501__auto__4};
};

}));
var is_feature_enabled_QMARK_ = function (flags, key) {
if (squint_core.truth_(flags.has(key))) {
return flags.get(key)} else {
return true};

};
var redirect_if_one_page = function (section_id) {
const mode1 = svelte_get(site_mode);
if (squint_core.truth_((() => {
const or__23461__auto__2 = (mode1 === "one-page");
if (or__23461__auto__2) {
return or__23461__auto__2} else {
return (mode1 === "reader")};

})())) {
goto(`${"/#"}${section_id??''}`, ({"replaceState": true}));
return true;
} else {
return false};

};

export { effective_wip_config, derived, wip_banner_dismissed, should_block_calls, browser_QMARK_, site_mode, effective_feature_flags, wip_params, effective_site_config, base_site_config, is_reader_mode, base_feature_flags, writable, redirect_if_one_page, wip_mode, preview_mode, reader_override, nav_paradigm, staged_overrides, deep_freeze, is_feature_enabled_QMARK_, svelte_get }
