(ns portfolio.admin.agent-interface
  "Agent interface for CMS molding and administration.
   Exposes high-level administrative capabilities that can be invoked via agent skills.")

(defn- log-op [op-name details]
  (js/console.log (str "[CMS Agent] " op-name ":") details))

(defn mold-layout [page-id layout-type]
  (log-op "Mold Layout" #js {:page page-id :type layout-type})
  ;; Implementation would involve staging preset changes
  )

(defn update-typography [section-id font-params]
  (log-op "Update Typography" #js {:section section-id :params font-params})
  )

(defn sync-all-tabs []
  (log-op "Syncing all tabs" #js {})
  (when-let [sync-engine (js* "import('$lib/clj/portfolio/admin/sync_engine.mjs')")]
    (.then sync-engine (fn [mod]
                         (when (.-exports mod)
                           (.broadcast (.-exports mod) "sync" #js {:action "refresh"}))))))

(def exports
  #js {:moldLayout mold-layout
       :updateTypography update-typography
       :syncAllTabs sync-all-tabs})
