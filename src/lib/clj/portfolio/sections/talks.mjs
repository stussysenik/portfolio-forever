import * as squint_core from 'squint-cljs/core.js';
import * as convex from './../convex/client.mjs';
import * as portfolio_DOT_convex_DOT_client from './../convex/client.mjs';
import { api } from '$lib/app-shims';;
var setup_talks_subscriptions = function (client, callbacks) {
"Sets up Convex subscriptions for the talks section.\n   callbacks: #js {:onTalks (fn [data] ...)}\n   Returns a function to unsubscribe.";
const on_talks1 = callbacks["onTalks"];
const api2 = api;
const unsub3 = client.onUpdate(api2["talks"]["getVisibleTalks"], ({}), (function (data) {
if (squint_core.truth_(on_talks1)) {
return on_talks1(data);
};

}));
return function () {
return unsub3();

};

};
var sort_talks = function (talks) {
"Sorts talks by date descending.";
if (squint_core.truth_(talks)) {
return squint_core.into_array(talks).sort((function (a, b) {
const year_diff1 = (b["year"] - a["year"]);
if (!(year_diff1 === 0)) {
return year_diff1} else {
return ((() => {
const or__23461__auto__2 = b["month"];
if (squint_core.truth_(or__23461__auto__2)) {
return or__23461__auto__2} else {
return 0};

})() - (() => {
const or__23461__auto__3 = a["month"];
if (squint_core.truth_(or__23461__auto__3)) {
return or__23461__auto__3} else {
return 0};

})())};

}))} else {
return []};

};

export { setup_talks_subscriptions, sort_talks }
