import * as squint_core from 'squint-cljs/core.js';
import * as convex from './../convex/client.mjs';
import * as portfolio_DOT_convex_DOT_client from './../convex/client.mjs';
import { api } from '$lib/app-shims';;
var setup_likes_subscriptions = function (client, callbacks) {
const on_likes1 = callbacks["onLikes"];
const api2 = api;
const unsub3 = client.onUpdate(api2["likes"]["getAllCategories"], ({}), (function (data) {
if (squint_core.truth_(on_likes1)) {
return on_likes1(data);
};

}));
return function () {
return unsub3();

};

};

export { setup_likes_subscriptions }
