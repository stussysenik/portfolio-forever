import * as squint_core from 'squint-cljs/core.js';
import * as convex from './../convex/client.mjs';
import * as portfolio_DOT_convex_DOT_client from './../convex/client.mjs';
import { api } from '$lib/app-shims';;
var setup_academia_subscriptions = function (client, callbacks) {
"Sets up Convex subscriptions for the academia section.\n   callbacks: #js {:onAcademia (fn [data] ...)}\n   Returns a function to unsubscribe.";
const on_academia1 = callbacks["onAcademia"];
const api2 = api;
const unsub3 = client.onUpdate(api2["academia"]["getVisibleAcademia"], ({}), (function (data) {
if (squint_core.truth_(on_academia1)) {
return on_academia1(data);
};

}));
return function () {
return unsub3();

};

};

export { setup_academia_subscriptions }
