import * as squint_core from 'squint-cljs/core.js';
import { api } from '$lib/app-shims';;
var setup_blog_subscriptions = function (client, callbacks) {
"Sets up Convex subscriptions for the blog section.\n   callbacks: #js {:onPosts (fn [data] ...)}\n   Returns a function to unsubscribe.";
const on_posts1 = callbacks["onPosts"];
const api2 = api;
const unsub3 = client.onUpdate(api2["blog"]["getVisiblePosts"], ({}), (function (data) {
if (squint_core.truth_(on_posts1)) {
return on_posts1(data);
};

}));
return function () {
return unsub3();

};

};
var sort_posts = function (posts) {
"Sorts blog posts by publishedAt date descending.";
if (squint_core.truth_(posts)) {
return squint_core.into_array(posts).sort((function (a, b) {
return (Date.parse(b["publishedAt"]) - Date.parse(a["publishedAt"]));

}))} else {
return []};

};
var get_all_tags = function (posts) {
"Extracts unique tags from all posts.";
if (squint_core.truth_(posts)) {
return squint_core.into_array(squint_core.sort(squint_core.reduce((function (tags, post) {
const post_tags1 = (() => {
const or__23461__auto__2 = post["tags"];
if (squint_core.truth_(or__23461__auto__2)) {
return or__23461__auto__2} else {
return []};

})();
return squint_core.reduce((function (t, tag) {
return squint_core.conj(t, tag);

}), tags, post_tags1);

}), (new Set ([])), posts)))} else {
return []};

};
var filter_posts_by_tag = function (posts, tag) {
"Filters posts by a specific tag.";
if (squint_core.truth_((() => {
const and__23501__auto__1 = posts;
if (squint_core.truth_(and__23501__auto__1)) {
return tag} else {
return and__23501__auto__1};

})())) {
return squint_core.filter((function (post) {
const post_tags2 = squint_core.into((new Set ([])), (() => {
const or__23461__auto__3 = post["tags"];
if (squint_core.truth_(or__23461__auto__3)) {
return or__23461__auto__3} else {
return []};

})());
return squint_core.contains_QMARK_(post_tags2, tag);

}), posts)} else {
return posts};

};

export { setup_blog_subscriptions, sort_posts, get_all_tags, filter_posts_by_tag }
