import * as squint_core from 'squint-cljs/core.js';
var channel_name = "portfolio:cms:sync";
var sync_channel = (((typeof BroadcastChannel !== 'undefined')) ? ((new BroadcastChannel(channel_name))) : (null));
var broadcast = function (type, data) {
if (squint_core.truth_(sync_channel)) {
return sync_channel.postMessage(({"type": type, "data": data, "senderId": Math.random().toString(36).slice(2, 9)}));
};

};
var handle_message = function (e) {
const msg1 = e.data;
const type2 = msg1.type;
const data3 = msg1.data;
const G__14 = type2;
switch (G__14) {case "stagedChanges":
const temp__23126__auto__6 = import('$lib/stores/siteMode');
if (squint_core.truth_(temp__23126__auto__6)) {
const site_mode7 = temp__23126__auto__6;
return site_mode7.then((function (mod) {
if (squint_core.truth_(mod.stagedOverrides)) {
return mod.stagedOverrides.set(data3);
};

}));
};

break;
case "toast":
const temp__23126__auto__8 = import('$lib/stores/toast');
if (squint_core.truth_(temp__23126__auto__8)) {
const toast9 = temp__23126__auto__8;
return toast9.then((function (mod) {
if (squint_core.truth_(mod.toast)) {
return mod.toast.info(data3["message"]);
};

}));
};

break;
default:
return console.debug("CMS Sync: Unhandled message type", type2)};

};
var init = function () {
if (squint_core.truth_(sync_channel)) {
return sync_channel.addEventListener("message", handle_message);
};

};
var exports = ({"broadcast": broadcast, "init": init});

export { channel_name, sync_channel, broadcast, init, exports }
