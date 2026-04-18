import * as squint_core from 'squint-cljs/core.js';
var theme_aliases = ["minimal", "studio", "terminal", "bw"];
var preview_aliases = ({"mobile": 390, "phone": 390, "iphone": 390, "tablet": 768, "ipad": 768, "desktop": 1440, "laptop": 1440});
var parse_locally = function (input) {
"Parse a natural language command into a structured action map.\n   Returns nil if no local match found.";
const raw1 = (() => {
const or__23461__auto__2 = input;
if (squint_core.truth_(or__23461__auto__2)) {
return or__23461__auto__2} else {
return ""};

})().trim();
const lower3 = raw1.toLowerCase();
if (squint_core.truth_(squint_core.empty_QMARK_(raw1))) {
return null} else {
if (squint_core.truth_((() => {
const m4 = lower3.match(RegExp("(?:^|\\b)(?:set|switch|use|change)\\s+theme\\s+(?:to\\s+)?([a-z-]+)$"));
if (squint_core.truth_(m4)) {
const tid5 = m4[1];
if (squint_core.truth_(theme_aliases.includes(tid5))) {
return squint_core.clj__GT_js(({"success": true, "action": "setTheme", "args": ({"themeId": tid5})}))} else {
return squint_core.clj__GT_js(({"success": false, "error": `${"unknown theme \""}${tid5??''}${"\""}`, "suggestions": theme_aliases}))};
};

})())) {
return theme_aliases.includes(lower3)} else {
if (squint_core.truth_(squint_core.clj__GT_js(({"success": true, "action": "setTheme", "args": ({"themeId": lower3})})))) {
const m6 = lower3.match(RegExp("^(?:go to|goto|open|nav(?:igate)?\\s+to)\\s+(\\S+)$"));
if (squint_core.truth_(m6)) {
const p7 = m6[1];
const path8 = ((squint_core.truth_(p7.startsWith("/"))) ? (p7) : (`${"/"}${p7??''}`));
return squint_core.clj__GT_js(({"success": true, "action": "navigateTo", "args": ({"path": path8})}));
};
} else {
if (squint_core.truth_((() => {
const m9 = lower3.match(RegExp("^(?:enable|disable|turn\\s+(on|off))\\s+(?:flag\\s+)?([a-z0-9-]+)$"));
if (squint_core.truth_(m9)) {
const enabled10 = lower3.test(RegExp("enable|on"));
return squint_core.clj__GT_js(({"success": true, "action": "toggleFlag", "args": ({"flagId": m9[2], "enabled": enabled10})}));
};

})())) {
const m11 = lower3.match(RegExp("^(?:enable|disable|show|hide|turn\\s+(on|off))\\s+(?:the\\s+)?wip(?:\\s+badge)?$"));
if (squint_core.truth_(m11)) {
const visible12 = lower3.test(RegExp("^(?:enable|show|turn\\s+on)"));
return squint_core.clj__GT_js(({"success": true, "action": "setWipBadge", "args": ({"visible": visible12})}));
};
} else {
if (squint_core.truth_(lower3.test(RegExp("^(?:save|commit|apply|publish)\\s*(?:changes)?$")))) {
return squint_core.clj__GT_js(({"success": true, "action": "commitPending", "args": ({"confirm": true})}))} else {
if (squint_core.truth_((() => {
const m13 = lower3.match(RegExp("^(?:preview|viewport|breakpoint)\\s+(?:at\\s+)?(\\S+)$"));
if (squint_core.truth_(m13)) {
const v14 = m13[1];
const width15 = (() => {
const or__23461__auto__16 = squint_core.get(preview_aliases, v14);
if (squint_core.truth_(or__23461__auto__16)) {
return or__23461__auto__16} else {
return parseInt(v14, 10)};

})();
if (squint_core.truth_(((width15 >= 280) && (width15 <= 3840)))) {
return squint_core.clj__GT_js(({"success": true, "action": "previewAt", "args": ({"width": width15})}))} else {
return squint_core.clj__GT_js(({"success": false, "error": `${"invalid viewport: \""}${v14??''}${"\". Use a number (280-3840) or: mobile, tablet, desktop"}`}))};
};

})())) {
const m17 = lower3.match(RegExp("^(?:set\\s+)?font\\s+(?:to\\s+)?([a-z-]+)$"));
if (squint_core.truth_(m17)) {
return squint_core.clj__GT_js(({"success": true, "action": "setFont", "args": ({"fontId": m17[1]})}));
};
} else {
if ("else") {
return null} else {
return null}}}}}}};

};

export { theme_aliases, preview_aliases, parse_locally }
