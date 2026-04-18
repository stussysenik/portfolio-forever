import * as squint_core from 'squint-cljs/core.js';
import { ConvexClient } from 'convex/browser';
import { env } from '$lib/app-shims';;
var client_atom = squint_core.atom(null);
var get_convex_client = function () {
const temp__23055__auto__1 = squint_core.deref(client_atom);
if (squint_core.truth_(temp__23055__auto__1)) {
const c2 = temp__23055__auto__1;
return c2;
} else {
const url3 = env["PUBLIC_CONVEX_URL"];
if (squint_core.not(url3)) {
return (new Error("PUBLIC_CONVEX_URL is not set"))} else {
const new_client4 = (new ConvexClient(url3));
squint_core.reset_BANG_(client_atom, new_client4);
return new_client4;
};
};

};

export { client_atom, get_convex_client }
