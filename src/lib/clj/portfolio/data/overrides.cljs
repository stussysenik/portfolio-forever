(ns portfolio.data.overrides
  "Data override layer — merges canonical Convex data with staged CMS changes.
   This allows real-time previews without committing to the database.")

(defn merge-patch [base patch]
  (if (and base patch)
    (let [result (js/Object.assign #js {} base patch)]
      ;; Handle special nested merging if needed (e.g. sections in pages)
      (when (and (aget base "sections") (aget patch "sections"))
        (aset result "sections" (aget patch "sections")))
      result)
    (or patch base)))

(defn apply-overrides [table data overrides]
  (if (js/Array.isArray data)
    ;; Handle arrays (worksEntries, blogPosts, etc.)
    (let [patch-map (js/Map.)]
      (.forEach (js/Object.keys overrides)
                (fn [id]
                  (let [parts (.split id ":")
                        t (aget parts 0)
                        doc-id (aget parts 1)]
                    (when (= t table)
                      (.set patch-map doc-id (.-patch (aget overrides id)))))))
      
      (let [base-ids (js/Set. (map #(or (aget % "_id") (aget % "id")) data))
            merged (map (fn [item]
                          (let [id (or (aget item "_id") (aget item "id"))
                                patch (.get patch-map id)]
                            (if patch
                              (merge-patch item patch)
                              item)))
                        data)
            ;; Add new items that aren't in base data yet
            new-items []]
        (.forEach patch-map (fn [patch id]
                              (when (not (.has base-ids id))
                                (.push new-items (merge-patch #js {} patch)))))
        (js/Array.from (concat merged new-items))))
    
    ;; Handle singletons (siteConfig, heroConfig)
    (let [id (str table ":singleton")
          patch-change (aget overrides id)]
      (if patch-change
        (merge-patch data (.-patch patch-change))
        data))))

(def exports
  #js {:applyOverrides apply-overrides})
