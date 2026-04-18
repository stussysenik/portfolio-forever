import * as squint_core from 'squint-cljs/core.js';
import * as convex from './../convex/client.mjs';
import * as portfolio_DOT_convex_DOT_client from './../convex/client.mjs';
import { api } from '$lib/app-shims';;
var setup_labs_subscriptions = function (client, callbacks) {
"Sets up Convex subscriptions for the labs section.\n   callbacks: #js {:onLabs (fn [data] ...)}\n   Returns a function to unsubscribe.";
const on_labs1 = callbacks["onLabs"];
const api2 = api;
const unsub3 = client.onUpdate(api2["labs"]["getVisibleLabs"], ({}), (function (data) {
if (squint_core.truth_(on_labs1)) {
return on_labs1(data);
};

}));
return function () {
return unsub3();

};

};

export { setup_labs_subscriptions }
