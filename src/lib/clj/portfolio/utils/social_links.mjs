import * as squint_core from 'squint-cljs/core.js';
var social_icon_map = ({"storygraph": "book-open", "dribbble": "palette", "github": "code", "x": "hash", "soundcloud": "music", "email": "mail", "linkedin": "briefcase", "instagram": "camera", "behance": "pen-tool", "imdb": "film", "letterboxd": "clapperboard"});
var get_social_icon = function (label) {
return squint_core.get(social_icon_map, string.lower_case(label), "link");

};
var social_url__GT_icon_class = function (url) {
if (squint_core.truth_(url.includes("github"))) {
return "github"} else {
if (squint_core.truth_(url.includes("linkedin"))) {
return "linkedin"} else {
if (squint_core.truth_(url.includes("instagram"))) {
return "instagram"} else {
if (squint_core.truth_(url.includes("soundcloud"))) {
return "soundcloud"} else {
if (squint_core.truth_(url.includes("imdb"))) {
return "imdb"} else {
if (squint_core.truth_(url.includes("x.com"))) {
return "x"} else {
if (squint_core.truth_(url.includes("twitter"))) {
return "x"} else {
if ("else") {
return "link"} else {
return null}}}}}}}};

};

export { social_icon_map, get_social_icon, social_url__GT_icon_class }
