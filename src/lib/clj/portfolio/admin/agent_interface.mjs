import * as squint_core from 'squint-cljs/core.js';
var log_op = function (op_name, details) {
return console.log(`${"[CMS Agent] "}${op_name??''}${":"}`, details);

};
var mold_layout = function (page_id, layout_type) {
return log_op("Mold Layout", ({"page": page_id, "type": layout_type}));

};
var update_typography = function (section_id, font_params) {
return log_op("Update Typography", ({"section": section_id, "params": font_params}));

};
var sync_all_tabs = function () {
log_op("Syncing all tabs", ({}));
const temp__23126__auto__1 = import('$lib/clj/portfolio/admin/sync_engine.mjs');
if (squint_core.truth_(temp__23126__auto__1)) {
const sync_engine2 = temp__23126__auto__1;
return sync_engine2.then((function (mod) {
if (squint_core.truth_(mod.exports)) {
return mod.exports.broadcast("sync", ({"action": "refresh"}));
};

}));
};

};
var exports = ({"moldLayout": mold_layout, "updateTypography": update_typography, "syncAllTabs": sync_all_tabs});

export { mold_layout, update_typography, sync_all_tabs, exports }
