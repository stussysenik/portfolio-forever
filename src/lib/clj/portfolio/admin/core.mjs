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
var stage_page = function (page_id, patch, label) {
return staging.stage("pages", page_id, patch, label);

};
var stage_generic = function (table, doc_id, patch, label) {
return staging.stage(table, doc_id, patch, label);

};
var unstage = function (id) {
return staging.unstage(id);

};
var exports = ({"stage": staging.stage, "stageSiteConfig": stage_site_config, "stageHeroConfig": stage_hero_config, "stagePageSections": stage_page_sections, "stageWorkEntry": stage_work_entry, "unstage": unstage, "commit": staging.commit, "stageBlogPost": stage_blog_post, "stagePage": stage_page, "stageGeneric": stage_generic, "clear": staging.clear});

export { stage_hero_config, unstage, exports, stage_page_sections, stage_generic, stage_page, stage_blog_post, stage_work_entry, stage_site_config }
