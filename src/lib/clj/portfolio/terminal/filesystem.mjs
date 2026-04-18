import * as squint_core from 'squint-cljs/core.js';
var make_file = function (content, size, modified) {
return squint_core.clj__GT_js(({"type": "file", "content": content, "size": (() => {
const or__23461__auto__1 = size;
if (squint_core.truth_(or__23461__auto__1)) {
return or__23461__auto__1} else {
return "0.4K"};

})(), "modified": (() => {
const or__23461__auto__2 = modified;
if (squint_core.truth_(or__23461__auto__2)) {
return or__23461__auto__2} else {
return "Jan 2026"};

})()}));

};
var make_dir = function (children, modified) {
return squint_core.clj__GT_js(({"type": "dir", "children": squint_core.clj__GT_js(children), "modified": (() => {
const or__23461__auto__1 = modified;
if (squint_core.truth_(or__23461__auto__1)) {
return or__23461__auto__1} else {
return "Jan 2026"};

})()}));

};
var about_content = "<span class=\"t-info\">Stüssy Senik</span>\n<span class=\"t-muted\">Design Engineer & Creative Producer</span>\n\nBuilding at the intersection of science, design,\ncinema, computation and code.\n\nBased in <span class=\"t-accent\">Bed-Stuy, Brooklyn</span>.\nVibe-coding since 2017.";
var contact_content = "<span class=\"t-accent\">GitHub</span>    github.com/stussysenik\n<span class=\"t-accent\">Email</span>     itsmxzou@gmail.com\n<span class=\"t-accent\">Web</span>       stussysenik.com\n<span class=\"t-accent\">Location</span>  NYC / Prague";
var resume_content = "<span class=\"t-info\">══════════════════════════════════════</span>\n<span class=\"t-info\">  STÜSSY SENIK — Creative Technologist</span>\n<span class=\"t-info\">══════════════════════════════════════</span>\n\n<span class=\"t-accent\">FOCUS</span>\n  DevEx & Experience Design Engineering\n  クリエイティブ・テクノロジスト\n\n<span class=\"t-accent\">STACK</span>\n  TypeScript · SvelteKit · React · Svelte 5\n  AR/XR · WebGPU · Three.js · Zig · WASM\n  Elixir/Phoenix · Rails · Swift · Python\n\n<span class=\"t-muted\">Type 'cat cv.pdf' for the full CV page.</span>";
var filesystem = squint_core.clj__GT_js(({"type": "dir", "children": ({"about.txt": ({"type": "file", "content": about_content, "size": "0.4K", "modified": "Jan 2026"}), "contact.nfo": ({"type": "file", "content": contact_content, "size": "0.2K", "modified": "Jan 2026"}), "resume.txt": ({"type": "file", "content": resume_content, "size": "2.1K", "modified": "Mar 2026"}), "works": ({"type": "dir", "children": ({}), "modified": "Mar 2026"}), "projects": ({"type": "dir", "children": ({}), "modified": "Mar 2026"}), "skills": ({"type": "dir", "children": ({}), "modified": "Jan 2026"})})}));
var resolve_path = function (_cwd, target) {
"Resolve a path in the virtual filesystem. Returns node and resolved path.";
const clean1 = target.replace(" ", "").replace("~", "");
const path2 = ((squint_core.truth_(clean1.startsWith("/"))) ? (clean1) : (`${"/"}${clean1??''}`));
return ({"node": null, "resolvedPath": path2});

};
var list_dir = function (dir) {
"List entries in a virtual directory.";
if (squint_core.truth_((() => {
const and__23501__auto__1 = dir;
if (squint_core.truth_(and__23501__auto__1)) {
return (dir["type"] === "dir")} else {
return and__23501__auto__1};

})())) {
const children2 = dir["children"];
return squint_core.mapv((function (key) {
const node3 = children2[key];
return ({"name": key, "isDir": (node3["type"] === "dir"), "size": node3["size"], "modified": node3["modified"]});

}), Object.keys(children2));
};

};

export { make_file, make_dir, about_content, contact_content, resume_content, filesystem, resolve_path, list_dir }
