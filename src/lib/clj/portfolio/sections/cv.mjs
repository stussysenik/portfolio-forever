import * as squint_core from 'squint-cljs/core.js';
import * as convex from './../convex/client.mjs';
import * as portfolio_DOT_convex_DOT_client from './../convex/client.mjs';
import { api } from '$lib/app-shims';;
var format_date_range = function (start, end) {
"Formats a date range string.";
const fmt1 = (function (d) {
const date2 = (new Date(d));
return date2.toLocaleDateString("en-US", ({"year": "numeric", "month": "short"}));

});
if (squint_core.truth_(end)) {
return `${fmt1(start)??''}${" — "}${fmt1(end)??''}`} else {
return `${fmt1(start)??''}${" — Present"}`};

};
var get_entries_for_type = function (entries, type) {
"Filters and sorts entries by type.";
return (function (a, b) {
return (a["order"] - b["order"]);

}).sort((function (e) {
return (squint_core._EQ_(e["type"], type) && e["visible"]);

}).filter(entries));

};
var get_sorted_sections = function (sections, is_screen_pass) {
"Sorts and filters sections, optionally limiting for screen-pass.";
const sorted1 = (function (a, b) {
return (a["order"] - b["order"]);

}).sort((function (s) {
return s["visible"];

}).filter(sections));
if (squint_core.truth_(is_screen_pass)) {
return sorted1.slice(0, 2)} else {
return sorted1};

};
var setup_cv_subscriptions = function (client, on_data) {
"Sets up Convex subscription for the CV section.";
const api1 = api;
return client.onUpdate(api1["cv"]["getVisibleCV"], ({}), (function (data) {
if (squint_core.truth_(on_data)) {
return on_data(data);
};

}));

};

export { format_date_range, get_entries_for_type, get_sorted_sections, setup_cv_subscriptions }
