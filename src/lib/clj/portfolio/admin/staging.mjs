import * as squint_core from 'squint-cljs/core.js';
import { writable, get } from 'svelte/store';
var store = writable((new Map()));
var notify_previews = function (m) {
if ((typeof window !== 'undefined')) {
const changes1 = Object.create(null);
m.forEach((function (change, id) {
return (changes1[id] = change.patch);

}));
const iframes2 = document.querySelectorAll("iframe[src*=\"preview=true\"]");
return iframes2.forEach((function (iframe) {
const win3 = iframe.contentWindow;
if (squint_core.truth_(win3)) {
return win3.postMessage(({"type": "admin:stagedChanges", "changes": changes1}), "*");
};

}));
};

};
var stage = function (table, doc_id, patch, label) {
const id1 = `${table??''}${":"}${doc_id??''}`;
return store.update((function (m) {
const next_m2 = (new Map(m));
const existing3 = next_m2.get(id1);
const new_patch4 = ((squint_core.truth_(existing3)) ? ((() => {
const p5 = Object.assign(({}), existing3.patch, patch);
if (squint_core.truth_(((table === "pages") && patch["sections"]))) {
(p5["sections"] = patch["sections"])};
return p5;

})()) : (patch));
const change6 = ({"id": id1, "table": table, "docId": doc_id, "patch": new_patch4, "label": label});
next_m2.set(id1, change6);
notify_previews(next_m2);
return next_m2;

}));

};
var unstage = function (id) {
return store.update((function (m) {
const next_m1 = (new Map(m));
next_m1.delete(id);
notify_previews(next_m1);
return next_m1;

}));

};
var clear = function () {
store.set((new Map()));
return notify_previews((new Map()));

};
var commit = async function (client, api) {
return (async () => {
    const m = get(store);
    let committed = 0;
    for (const [id, change] of m) {
        const { table, patch, docId } = change;
        let mutation = null;
        if (table === 'siteConfig') mutation = api.siteConfig.upsert;
        else if (table === 'heroConfig') mutation = api.hero.upsertHeroConfig;
        else if (table === 'pages') mutation = api.pages.upsert;
        else if (table === 'worksEntries') mutation = api.works.updateEntry;
        else if (table === 'blogPosts') mutation = api.blog.updatePost;

        if (mutation) {
            if (table === 'siteConfig' || table === 'heroConfig') {
                await client.mutation(mutation, patch);
            } else {
                await client.mutation(mutation, { id: docId, ...patch });
            }
            committed++;
        } else {
            console.warn('No mutation for table:', table);
        }
    }
    clear();
    return committed;
})();

};
var exports = ({"subscribe": store.subscribe, "stage": stage, "unstage": unstage, "clear": clear, "commit": commit});

export { store, stage, unstage, clear, commit, exports }
