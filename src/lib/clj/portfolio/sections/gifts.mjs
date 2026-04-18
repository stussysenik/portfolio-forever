import * as squint_core from 'squint-cljs/core.js';
import * as convex from './../convex/client.mjs';
import * as portfolio_DOT_convex_DOT_client from './../convex/client.mjs';
import { api } from '$lib/app-shims';;
var setup_gifts_subscriptions = function (client, callbacks) {
const on_config1 = callbacks["onConfig"];
const api2 = api;
const unsub3 = client.onUpdate(api2["gifts"]["getConfig"], ({}), (function (data) {
if (squint_core.truth_(on_config1)) {
return on_config1(data);
};

}));
return function () {
return unsub3();

};

};

export { setup_gifts_subscriptions }
