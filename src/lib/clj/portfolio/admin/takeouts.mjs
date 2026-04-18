import * as squint_core from 'squint-cljs/core.js';
var generate_takeout_data = function (site_config, pages, entries_by_table) {
return ({"exported-at": (new Date()).toISOString(), "site-config": site_config, "pages": pages, "content": entries_by_table});

};
var download_json = function (data, filename) {
const json_str1 = JSON.stringify(squint_core.clj__GT_js(data), null, 2);
const blob2 = (new Blob([json_str1], ({"type": "application/json"})));
const url3 = URL.createObjectURL(blob2);
const a4 = document.createElement("a");
a4.href = url3;
a4.download = filename;
document.body.appendChild(a4);
a4.click();
document.body.removeChild(a4);
return URL.revokeObjectURL(url3);

};
var takeout_all_BANG_ = function (site_config, pages, entries_by_table) {
const data1 = generate_takeout_data(site_config, pages, entries_by_table);
const date_str2 = squint_core.first((new Date()).toISOString().split("T"));
const filename3 = `portfolio-takeout-${date_str2??''}${".json"}`;
return download_json(data1, filename3);

};
var takeout_table_BANG_ = function (table_name, entries) {
const data1 = ({"exported-at": (new Date()).toISOString(), "table": table_name, "entries": entries});
const date_str2 = squint_core.first((new Date()).toISOString().split("T"));
const filename3 = `portfolio-${table_name??''}-${date_str2??''}${".json"}`;
return download_json(data1, filename3);

};

export { generate_takeout_data, download_json, takeout_all_BANG_, takeout_table_BANG_ }
