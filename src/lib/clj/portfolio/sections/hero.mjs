import * as squint_core from 'squint-cljs/core.js';
import * as convex from './../convex/client.mjs';
import * as portfolio_DOT_convex_DOT_client from './../convex/client.mjs';
import * as content from './../data/content.mjs';
import * as portfolio_DOT_data_DOT_content from './../data/content.mjs';
import { api } from '$lib/app-shims';;
var format_profile_data = function (data, default_profile) {
"Transforms Convex profile data into the format expected by the hero section.";
if (squint_core.truth_((() => {
const and__23501__auto__1 = data;
if (squint_core.truth_(and__23501__auto__1)) {
return data["profile"]} else {
return and__23501__auto__1};

})())) {
const p2 = data["profile"];
return ({"name": (() => {
const or__23461__auto__3 = p2["name"];
if (squint_core.truth_(or__23461__auto__3)) {
return or__23461__auto__3} else {
return default_profile["name"]};

})(), "taglines": (() => {
const or__23461__auto__4 = p2["taglines"];
if (squint_core.truth_(or__23461__auto__4)) {
return or__23461__auto__4} else {
return default_profile["taglines"]};

})(), "shortBio": (() => {
const or__23461__auto__5 = p2["shortBio"];
if (squint_core.truth_(or__23461__auto__5)) {
return or__23461__auto__5} else {
const or__23461__auto__6 = p2["summary"];
if (squint_core.truth_(or__23461__auto__6)) {
return or__23461__auto__6} else {
return default_profile["shortBio"]};
};

})(), "location": (() => {
const or__23461__auto__7 = p2["location"];
if (squint_core.truth_(or__23461__auto__7)) {
return or__23461__auto__7} else {
return default_profile["location"]};

})(), "available": ((!squint_core._EQ_(p2["available"], undefined)) ? (p2["available"]) : (default_profile["available"])), "sameAs": (() => {
const or__23461__auto__8 = p2["sameAs"];
if (squint_core.truth_(or__23461__auto__8)) {
return or__23461__auto__8} else {
return []};

})()});
} else {
return default_profile};

};
var setup_hero_subscriptions = function (client, callbacks) {
"Sets up Convex subscriptions for the hero section.\n   callbacks: #js {:onProfile (fn [data] ...) :onWorks (fn [data] ...) :onConfig (fn [data] ...)}\n   Returns a function to unsubscribe from all.";
const on_profile1 = callbacks["onProfile"];
const on_works2 = callbacks["onWorks"];
const on_config3 = callbacks["onConfig"];
const api4 = api;
const unsub_profile5 = client.onUpdate(api4["cv"]["getVisibleCV"], ({}), (function (data) {
if (squint_core.truth_(on_profile1)) {
return on_profile1(data);
};

}));
const unsub_works6 = client.onUpdate(api4["works"]["getVisibleWorks"], ({}), (function (data) {
if (squint_core.truth_(on_works2)) {
return on_works2(data);
};

}));
const unsub_config7 = client.onUpdate(api4["hero"]["getHeroConfig"], ({}), (function (data) {
if (squint_core.truth_(on_config3)) {
return on_config3(data);
};

}));
return function () {
unsub_profile5();
unsub_works6();
return unsub_config7();

};

};
var get_hero_config_derived = function (config) {
"Derives UI flags from hero config.";
return ({"showDonut": ((squint_core.truth_(config)) ? ((() => {
const or__23461__auto__1 = config["showAsciiDonut"];
if (squint_core.truth_(or__23461__auto__1)) {
return or__23461__auto__1} else {
return true};

})()) : (true)), "showWave": ((squint_core.truth_(config)) ? ((() => {
const or__23461__auto__2 = config["showAsciiWave"];
if (squint_core.truth_(or__23461__auto__2)) {
return or__23461__auto__2} else {
return false};

})()) : (false)), "layout": ((squint_core.truth_(config)) ? ((() => {
const or__23461__auto__3 = config["layout"];
if (squint_core.truth_(or__23461__auto__3)) {
return or__23461__auto__3} else {
return "default"};

})()) : ("default")), "archived": ((squint_core.truth_(config)) ? (((!squint_core._EQ_(config["archived"], undefined)) ? (config["archived"]) : (true))) : (true))});

};

export { format_profile_data, setup_hero_subscriptions, get_hero_config_derived }
