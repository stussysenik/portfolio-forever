import * as squint_core from 'squint-cljs/core.js';
import * as staging from './staging.mjs';
import * as portfolio_DOT_admin_DOT_staging from './staging.mjs';
import * as toast from './../stores/toast.mjs';
import * as portfolio_DOT_stores_DOT_toast from './../stores/toast.mjs';
var stage_work_entry = function (id, patch) {
return staging.stage("worksEntries", id, patch, `${"Update Work: "}${(() => {
const or__23461__auto__1 = patch["title"];
if (squint_core.truth_(or__23461__auto__1)) {
return or__23461__auto__1} else {
return id};

})()??''}`);

};
var stage_blog_post = function (id, patch) {
return staging.stage("blogPosts", id, patch, `${"Update Blog: "}${(() => {
const or__23461__auto__1 = patch["title"];
if (squint_core.truth_(or__23461__auto__1)) {
return or__23461__auto__1} else {
return id};

})()??''}`);

};
var stage_page_sections = function (page_id, sections, label) {
return staging.stage("pages", page_id, ({"sections": sections}), label);

};
var stage_site_config = function (patch, label) {
return staging.stage("siteConfig", "singleton", patch, label);

};
var stage_hero_config = function (patch, label) {
return staging.stage("heroConfig", "singleton", patch, label);

};
var exports = ({"stageWorkEntry": stage_work_entry, "stageBlogPost": stage_blog_post, "stagePageSections": stage_page_sections, "stageSiteConfig": stage_site_config, "stageHeroConfig": stage_hero_config, "commit": staging.commit, "clear": staging.clear});

export { stage_work_entry, stage_blog_post, stage_page_sections, stage_site_config, stage_hero_config, exports }
