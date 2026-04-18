import * as squint_core from 'squint-cljs/core.js';
var parse_math = function (input) {
"Split a string into text + math segments. Supports `$$...$$` block math\n   and `$...$` inline math. `\\$` escapes a literal dollar sign.";
if (squint_core.not(input)) {
return [({"type": "text", "value": ""})]} else {
const out1 = [];
const len2 = squint_core.count(input);
let i3 = 0;
let buf4 = "";
while(true){
if ((i3 >= len2)) {
if (squint_core.not(squint_core.empty_QMARK_(buf4))) {
out1.push(({"type": "text", "value": buf4}))};
if ((squint_core.count(out1) === 0)) {
return [({"type": "text", "value": ""})]} else {
return out1};
} else {
const ch5 = squint_core.nth(input, i3);
const next_ch6 = ((((i3 + 1) < len2)) ? (squint_core.nth(input, (i3 + 1))) : (null));
if (squint_core.truth_(((ch5 === "\\") && (next_ch6 === "$")))) {
let G__7 = (i3 + 2);
let G__8 = `${buf4??''}${"$"}`;
i3 = G__7;
buf4 = G__8;
continue;
} else {
if (squint_core.truth_(((ch5 === "$") && (next_ch6 === "$")))) {
const end9 = input.indexOf("$$", (i3 + 2));
if ((end9 === -1)) {
let G__10 = (i3 + 2);
let G__11 = `${buf4??''}${"$$"}`;
i3 = G__10;
buf4 = G__11;
continue;
} else {
if (squint_core.not(squint_core.empty_QMARK_(buf4))) {
out1.push(({"type": "text", "value": buf4}))};
out1.push(({"type": "math", "value": input.slice((i3 + 2), end9), "displayMode": true}));
let G__12 = (end9 + 2);
let G__13 = "";
i3 = G__12;
buf4 = G__13;
continue;
};
} else {
if ((ch5 === "$")) {
const end14 = (() => {
let j15 = (i3 + 1);
while(true){
if ((j15 >= len2)) {
return -1} else {
const c16 = squint_core.nth(input, j15);
const nc17 = ((((j15 + 1) < len2)) ? (squint_core.nth(input, (j15 + 1))) : (null));
if (squint_core.truth_(((c16 === "\\") && (nc17 === "$")))) {
let G__18 = (j15 + 2);
j15 = G__18;
continue;
} else {
if ((c16 === "$")) {
return j15} else {
if ("else") {
let G__19 = (j15 + 1);
j15 = G__19;
continue;
} else {
return null}}};
};
;break;
}

})();
if ((end14 === -1)) {
let G__20 = (i3 + 1);
let G__21 = `${buf4??''}${"$"}`;
i3 = G__20;
buf4 = G__21;
continue;
} else {
if (squint_core.not(squint_core.empty_QMARK_(buf4))) {
out1.push(({"type": "text", "value": buf4}))};
out1.push(({"type": "math", "value": input.slice((i3 + 1), end14).replace((new RegExp("\\\\\\$", "g")), "$"), "displayMode": false}));
let G__22 = (end14 + 1);
let G__23 = "";
i3 = G__22;
buf4 = G__23;
continue;
};
} else {
if ("else") {
let G__24 = (i3 + 1);
let G__25 = `${buf4??''}${ch5??''}`;
i3 = G__24;
buf4 = G__25;
continue;
} else {
return null}}}};
};
;break;
}
;
};

};

export { parse_math }
