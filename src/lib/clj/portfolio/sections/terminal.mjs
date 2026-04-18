import * as squint_core from 'squint-cljs/core.js';
import * as convex from './../convex/client.mjs';
import * as portfolio_DOT_convex_DOT_client from './../convex/client.mjs';
import { api } from '$lib/app-shims';;
var create_terminal_state = function () {
return ({"history": [], "commandHistory": [], "historyIndex": -1, "currentInput": "", "tabSuggestions": [], "activeAnimation": null, "expandedIframes": (new Set())});

};
var process_output = function (lines, state, callbacks) {
"Processes command output lines and updates state.";
const new_entries1 = [];
const on_clear2 = callbacks["onClear"];
const on_welcome3 = callbacks["onWelcome"];
const on_nav4 = callbacks["onNav"];
const on_theme5 = callbacks["onTheme"];
for (let G__6 of squint_core.iterable(lines)) {
const line7 = G__6;
const type8 = line7["type"];
const content9 = line7["content"];
if ((type8 === "text")) {
if ((content9 === "__CLEAR__")) {
if (squint_core.truth_(on_clear2)) {
on_clear2()}} else {
if ((content9 === "__WELCOME__")) {
if (squint_core.truth_(on_welcome3)) {
on_welcome3()}} else {
if (squint_core.truth_(content9.startsWith("__NAV__"))) {
if (squint_core.truth_(on_nav4)) {
on_nav4(content9.replace("__NAV__", ""))}} else {
if (squint_core.truth_(content9.startsWith("__THEME__"))) {
if (squint_core.truth_(on_theme5)) {
on_theme5(content9.replace("__THEME__", ""))}} else {
if ("else") {
new_entries1.push(({"type": "output", "content": content9}))} else {
}}}}}} else {
if (squint_core.truth_((() => {
const or__23461__auto__10 = (type8 === "iframe");
if (or__23461__auto__10) {
return or__23461__auto__10} else {
return (type8 === "image")};

})())) {
new_entries1.push(({"type": "output", "lines": [line7]}))} else {
if ((type8 === "animation")) {
state.activeAnimation = line7["id"]} else {
}}}
};
if ((squint_core.count(new_entries1) > 0)) {
const hist11 = state["history"];
const updated12 = hist11.concat(new_entries1);
return state.history = (((squint_core.count(updated12) > 500)) ? (updated12.slice(-500)) : (updated12));
};

};
var setup_terminal_subscriptions = function (client, on_config) {
"Sets up Convex subscription for terminal config.";
const api1 = api;
return client.onUpdate(api1["terminal"]["getTerminalConfig"], ({}), (function (data) {
if (squint_core.truth_(on_config)) {
return on_config(data);
};

}));

};

export { create_terminal_state, process_output, setup_terminal_subscriptions }
