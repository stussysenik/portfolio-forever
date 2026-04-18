(ns portfolio.admin.staging
  "Clojure-driven staging layer for CMS changes.
   Allows batching updates before committing to Convex."
  (:require ["svelte/store" :refer [writable get]]))

(defonce store (writable (js/Map.)))

(defn- notify-previews [m]
  (when (exists? js/window)
    (let [changes (js/Object.create nil)]
      (.forEach m (fn [change id]
                    (aset changes id (.-patch change))))
      (let [iframes (.querySelectorAll js/document "iframe[src*=\"preview=true\"]")]
        (.forEach iframes (fn [iframe]
                            (let [win (.-contentWindow iframe)]
                              (when win
                                (.postMessage win #js {:type "admin:stagedChanges" :changes changes} "*")))))))))

(defn stage [table doc-id patch label]
  (let [id (str table ":" doc-id)]
    (.update store (fn [m]
                     (let [next-m (js/Map. m)
                           existing (.get next-m id)
                           new-patch (if existing
                                       (let [p (js/Object.assign #js {} (.-patch existing) patch)]
                                         ;; Special handling for sections array in pages
                                         (when (and (= table "pages") (aget patch "sections"))
                                           (aset p "sections" (aget patch "sections")))
                                         p)
                                       patch)
                           change #js {:id id
                                       :table table
                                       :docId doc-id
                                       :patch new-patch
                                       :label label}]
                       (.set next-m id change)
                       (notify-previews next-m)
                       next-m)))))

(defn unstage [id]
  (.update store (fn [m]
                   (let [next-m (js/Map. m)]
                     (.delete next-m id)
                     (notify-previews next-m)
                     next-m))))

(defn clear []
  (.set store (js/Map.))
  (notify-previews (js/Map.)))

(defn ^:async commit [client api]
  (js* "(async () => {
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
})()"))

(def exports
  #js {:subscribe (.-subscribe store)
       :stage stage
       :unstage unstage
       :clear clear
       :commit commit})
