import * as squint_core from 'squint-cljs/core.js';
import * as convex from './../convex/client.mjs';
import * as portfolio_DOT_convex_DOT_client from './../convex/client.mjs';
import * as cv from './../data/cv.mjs';
import * as portfolio_DOT_data_DOT_cv from './../data/cv.mjs';
import { api } from '$lib/app-shims';;
var format_date_range = function (start, end) {
"Formats a date range string.";
const fmt1 = (function (d) {
if (squint_core.truth_((() => {
const or__23461__auto__2 = (d == null);
if (or__23461__auto__2) {
return or__23461__auto__2} else {
return (d === "present")};

})())) {
return "Present"} else {
const date3 = (new Date(d));
return date3.toLocaleDateString("en-US", ({"year": "numeric", "month": "short"}));
};

});
return `${fmt1(start)??''}${" — "}${fmt1(end)??''}`;

};
var get_cv_hiccup = function (is_screen_pass) {
"Returns the CV section as a Hiccup-like structure (data as code).";
const profile1 = cv.cv_data;
const work2 = squint_core.get(profile1, "workExperience");
const edu3 = squint_core.get(profile1, "education");
const awards4 = squint_core.get(profile1, "awards");
const langs5 = squint_core.get(profile1, "languages");
const skills6 = squint_core.get(profile1, "knowsAbout");
return ["section", ({"class": "cv-wrapper"}), ["header", ({"class": "cv-header"}), ["h1", ({"class": "cv-name"}), squint_core.get(profile1, "name")], ["p", ({"class": "cv-title"}), squint_core.get(profile1, "jobTitle")], ["p", ({"class": "cv-summary"}), squint_core.get(profile1, "summary")], ["div", ({"class": "cv-meta"}), ["span", ({"class": "cv-meta-item"}), squint_core.get(profile1, "location")], ["span", ({"class": "cv-meta-item"}), ["a", ({"href": `${"mailto:"}${squint_core.get(profile1, "email")??''}`}), squint_core.get(profile1, "email")]], ["span", ({"class": "cv-meta-item"}), ["a", ({"href": squint_core.get(profile1, "url"), "target": "_blank"}), squint_core.get(profile1, "url")]]]], ["div", ({"class": "cv-section"}), ["h2", ({"class": "cv-section-title"}), "Experience"], squint_core.into(["div", ({"class": "cv-entries"})], squint_core.map((function (entry) {
return ["div", ({"class": "cv-entry"}), ["div", ({"class": "cv-entry-header"}), ["h3", ({"class": "cv-entry-title"}), ((squint_core.truth_(squint_core.get(entry, "url"))) ? (["a", ({"href": squint_core.get(entry, "url"), "target": "_blank"}), squint_core.get(entry, "title")]) : (squint_core.get(entry, "title")))], ["span", ({"class": "cv-entry-dates"}), format_date_range(squint_core.get(entry, "startDate"), squint_core.get(entry, "endDate"))]], ["div", ({"class": "cv-entry-org"}), ["span", squint_core.get(entry, "organization")], ((squint_core.truth_(squint_core.get(entry, "location"))) ? (["span", ({"class": "cv-entry-location"}), squint_core.get(entry, "location")]) : (null))], ((squint_core.not(is_screen_pass)) ? (["div", ["p", ({"class": "cv-entry-description"}), squint_core.get(entry, "description")], ((squint_core.truth_(squint_core.seq(squint_core.get(entry, "highlights")))) ? (squint_core.into(["ul", ({"class": "cv-entry-highlights"})], squint_core.map((function (hl) {
return ["li", hl];

}), squint_core.get(entry, "highlights")))) : (null))]) : (null))];

}), work2))], ["div", ({"class": "cv-section"}), ["h2", ({"class": "cv-section-title"}), "Education"], squint_core.into(["div", ({"class": "cv-entries"})], squint_core.map((function (entry) {
return ["div", ({"class": "cv-entry"}), ["div", ({"class": "cv-entry-header"}), ["h3", ({"class": "cv-entry-title"}), squint_core.get(entry, "title")], ["span", ({"class": "cv-entry-dates"}), format_date_range(squint_core.get(entry, "startDate"), squint_core.get(entry, "endDate"))]], ["div", ({"class": "cv-entry-org"}), ["span", squint_core.get(entry, "organization")]]];

}), edu3))], ["div", ({"class": "cv-section"}), ["h2", ({"class": "cv-section-title"}), "Languages"], squint_core.into(["div", ({"class": "cv-languages"})], squint_core.map((function (lang) {
return ["span", ({"class": "cv-lang"}), squint_core.get(lang, "name"), " ", ["span", ({"class": "cv-lang-level"}), `${"("}${squint_core.get(lang, "level")??''}${")"}`]];

}), langs5))], ["div", ({"class": "cv-section"}), ["h2", ({"class": "cv-section-title"}), "Skills"], squint_core.into(["div", ({"class": "cv-skills"})], squint_core.map((function (skill) {
return ["span", ({"class": "cv-skill-tag"}), squint_core.get(skill, "name")];

}), skills6))]];

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

export { format_date_range, get_cv_hiccup, setup_cv_subscriptions }
