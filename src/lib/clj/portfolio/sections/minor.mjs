import * as squint_core from 'squint-cljs/core.js';
import * as convex from './../convex/client.mjs';
import * as portfolio_DOT_convex_DOT_client from './../convex/client.mjs';
import { api } from '$lib/app-shims';;
var setup_minor_subscriptions = function (client, callbacks) {
const on_minor1 = callbacks["onMinor"];
const api2 = api;
const unsub3 = client.onUpdate(api2["minor"]["getVisibleMinor"], ({}), (function (data) {
if (squint_core.truth_(on_minor1)) {
return on_minor1(data);
};

}));
return function () {
return unsub3();

};

};

export { setup_minor_subscriptions }
