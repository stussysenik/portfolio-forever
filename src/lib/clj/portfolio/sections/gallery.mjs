import * as squint_core from 'squint-cljs/core.js';
import * as convex from './../convex/client.mjs';
import * as portfolio_DOT_convex_DOT_client from './../convex/client.mjs';
import { api } from '$lib/app-shims';;
var setup_gallery_subscriptions = function (client, callbacks) {
const on_items1 = callbacks["onItems"];
const api2 = api;
const unsub3 = client.onUpdate(api2["gallery"]["getVisibleGallery"], ({}), (function (data) {
if (squint_core.truth_(on_items1)) {
return on_items1(data);
};

}));
return function () {
return unsub3();

};

};
var is_video = function (item) {
const mux_id1 = item["muxPlaybackId"];
const url2 = (() => {
const or__23461__auto__3 = item["fullUrl"];
if (squint_core.truth_(or__23461__auto__3)) {
return or__23461__auto__3} else {
const or__23461__auto__4 = item["thumbnailUrl"];
if (squint_core.truth_(or__23461__auto__4)) {
return or__23461__auto__4} else {
return ""};
};

})();
const or__23461__auto__5 = !(mux_id1 == null);
if (or__23461__auto__5) {
return or__23461__auto__5} else {
const ext6 = url2.split(".").pop().toLowerCase();
return squint_core.contains_QMARK_((new Set (["mp4", "webm", "mov", "avi"])), ext6);
};

};
var filter_items = function (items, active_filter) {
if ((active_filter === "all")) {
return items} else {
return squint_core.filter((function (item) {
const cats1 = (() => {
const c2 = item["category"];
if (squint_core.truth_(Array.isArray(c2))) {
return c2} else {
return [c2]};

})();
return squint_core.some((function (_PERCENT_1) {
return squint_core._EQ_(_PERCENT_1, active_filter);

}), cats1);

}), items)};

};

export { setup_gallery_subscriptions, is_video, filter_items }
