import * as squint_core from 'squint-cljs/core.js';
var log_op = function (op_name, details) {
return console.log(`${"[CMS Agent] "}${op_name??''}${":"}`, details);

};
var get_staging = function () {
return import('$lib/clj/portfolio/admin/staging.mjs');

};
var get_sync_engine = function () {
return import('$lib/clj/portfolio/admin/sync_engine.mjs');

};
var mold_layout = function (page_id, layout_type) {
log_op("Mold Layout", ({"page": page_id, "type": layout_type}));
const temp__23126__auto__1 = get_staging();
if (squint_core.truth_(temp__23126__auto__1)) {
const staging_promise2 = temp__23126__auto__1;
return staging_promise2.then((function (mod) {
if (squint_core.truth_(mod.exports)) {
const staging_module3 = mod.exports;
if (squint_core.truth_(staging_module3.stage)) {
staging_module3.stage.call(staging_module3, "pages", page_id, ({"layoutType": layout_type}), `${"Agent: Mold Layout - "}${layout_type??''}`)};
return console.log("CMS Agent: Layout molded to", layout_type, "for page", page_id);
};

}));
};

};
var update_typography = function (section_id, font_params) {
log_op("Update Typography", ({"section": section_id, "params": font_params}));
const temp__23126__auto__1 = get_staging();
if (squint_core.truth_(temp__23126__auto__1)) {
const staging_promise2 = temp__23126__auto__1;
return staging_promise2.then((function (mod) {
if (squint_core.truth_(mod.exports)) {
const staging_module3 = mod.exports;
if (squint_core.truth_(staging_module3.stage)) {
staging_module3.stage.call(staging_module3, "pages", "typography-updates", ({"sectionId": section_id, "typography": font_params}), `${"Agent: Typography Update - "}${section_id??''}`)};
return console.log("CMS Agent: Typography updated for section", section_id);
};

}));
};

};
var sync_all_tabs = function () {
log_op("Syncing all tabs", ({}));
const temp__23126__auto__1 = get_sync_engine();
if (squint_core.truth_(temp__23126__auto__1)) {
const sync_engine_promise2 = temp__23126__auto__1;
return sync_engine_promise2.then((function (mod) {
if (squint_core.truth_(mod.exports)) {
const exports3 = mod.exports;
if (squint_core.truth_(exports3.init)) {
exports3.init.call(exports3)};
if (squint_core.truth_(exports3.broadcast)) {
exports3.broadcast.call(exports3, "sync", ({"action": "refresh", "timestamp": Date.now()}));
return console.log("CMS Agent: Sync broadcast sent to all tabs");
};
};

}));
};

};
var exports = ({"moldLayout": mold_layout, "updateTypography": update_typography, "syncAllTabs": sync_all_tabs});

export { mold_layout, update_typography, sync_all_tabs, exports }
