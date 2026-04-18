import * as squint_core from 'squint-cljs/core.js';
import * as clojure_DOT_string from 'squint-cljs/src/squint/string.js';
import * as convex from './../convex/client.mjs';
import * as portfolio_DOT_convex_DOT_client from './../convex/client.mjs';
import { api } from '$lib/app-shims';;
var override_vars = function (project) {
"Collect styleOverrides as inline CSS var declarations.";
const o1 = (() => {
const or__23461__auto__2 = project["styleOverrides"];
if (squint_core.truth_(or__23461__auto__2)) {
return or__23461__auto__2} else {
return ({})};

})();
return clojure_DOT_string.join("; ", squint_core.filterv(squint_core.some_QMARK_, [(() => {
const temp__23126__auto__3 = o1["accentColor"];
if (squint_core.truth_(temp__23126__auto__3)) {
const v4 = temp__23126__auto__3;
return `${"--works-stripe-color: "}${v4??''}`;
};

})(), (() => {
const temp__23126__auto__5 = o1["httpColor"];
if (squint_core.truth_(temp__23126__auto__5)) {
const v6 = temp__23126__auto__5;
return `${"--works-http-color: "}${v6??''}`;
};

})(), (() => {
const temp__23126__auto__7 = o1["secondaryHighlight"];
if (squint_core.truth_(temp__23126__auto__7)) {
const v8 = temp__23126__auto__7;
return `${"--works-secondary-highlight: "}${v8??''}`;
};

})()]));

};
var use_static_preview_QMARK_ = function (project) {
return ((project["previewMode"] === "static") && squint_core.not(squint_core.empty_QMARK_(project["preview"])));

};
var use_video_preview_QMARK_ = function (project) {
return ((project["previewMode"] === "video") && squint_core.not(squint_core.empty_QMARK_(project["videoPreview"])));

};
var get_object_position = function (project) {
"Compute CSS object-position from focal point. Fallback: focal -> cam -> objectPosition -> 'center top'.";
const fx1 = project["focalX"];
const fy2 = project["focalY"];
if (squint_core.truth_((!(fx1 == null) && !(fy2 == null)))) {
return `${fx1??''}${"% "}${fy2??''}${"%"}`} else {
const or__23461__auto__3 = project["cam"];
if (squint_core.truth_(or__23461__auto__3)) {
return or__23461__auto__3} else {
const or__23461__auto__4 = project["objectPosition"];
if (squint_core.truth_(or__23461__auto__4)) {
return or__23461__auto__4} else {
return "center top"};
};
};

};
var get_zoom_style = function (project) {
"Zoom transform when zoom > 1.";
const zoom1 = (() => {
const or__23461__auto__2 = project["zoom"];
if (squint_core.truth_(or__23461__auto__2)) {
return or__23461__auto__2} else {
return 1};

})();
if ((zoom1 <= 1)) {
return ""} else {
const ox3 = (() => {
const or__23461__auto__4 = project["focalX"];
if (squint_core.truth_(or__23461__auto__4)) {
return or__23461__auto__4} else {
return 50};

})();
const oy5 = (() => {
const or__23461__auto__6 = project["focalY"];
if (squint_core.truth_(or__23461__auto__6)) {
return or__23461__auto__6} else {
return 50};

})();
return `${"transform: scale("}${zoom1??''}${"); transform-origin: "}${ox3??''}${"% "}${oy5??''}${"%;"}`;
};

};
var setup_works_subscriptions = function (client, callbacks) {
"Sets up Convex subscriptions for the works section.\n   callbacks: #js {:onWorks (fn [data] ...) :onThumbnails (fn [data] ...) :onSection (fn [data] ...)}\n   Returns a function to unsubscribe from all.";
const on_works1 = callbacks["onWorks"];
const on_thumbnails2 = callbacks["onThumbnails"];
const on_section3 = callbacks["onSection"];
const api4 = api;
const unsub_works5 = client.onUpdate(api4["works"]["getVisibleWorks"], ({}), (function (data) {
if (squint_core.truth_(on_works1)) {
return on_works1(data);
};

}));
const unsub_thumbnails6 = client.onUpdate(api4["thumbnails"]["getConfig"], ({"section": "works"}), (function (data) {
if (squint_core.truth_(on_thumbnails2)) {
return on_thumbnails2(data);
};

}));
const unsub_section7 = client.onUpdate(api4["sectionRegistry"]["getBySectionId"], ({"sectionId": "works"}), (function (data) {
if (squint_core.truth_(on_section3)) {
return on_section3(data);
};

}));
return function () {
unsub_works5();
unsub_thumbnails6();
return unsub_section7();

};

};

export { override_vars, use_static_preview_QMARK_, use_video_preview_QMARK_, get_object_position, get_zoom_style, setup_works_subscriptions }
