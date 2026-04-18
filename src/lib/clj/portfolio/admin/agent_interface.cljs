(ns portfolio.admin.agent-interface
  "Agent interface for CMS molding and administration.
   Exposes high-level administrative capabilities that can be invoked via agent skills.")

(defn- log-op [op-name details]
  (js/console.log (str "[CMS Agent] " op-name ":") details))

(defn- get-staging []
  (js* "import('$lib/clj/portfolio/admin/staging.mjs')"))

(defn- get-sync-engine []
  (js* "import('$lib/clj/portfolio/admin/sync_engine.mjs')"))

(defn mold-layout [page-id layout-type]
  (log-op "Mold Layout" #js {:page page-id :type layout-type})
  ;; Implementation: Apply preset layout configuration to page
  (when-let [staging-promise (get-staging)]
    (.then staging-promise (fn [mod]
                              (when (.-exports mod)
                                (let [staging-module (.-exports mod)]
                                  ;; Stage layout type change for the page
                                  (when (.-stage staging-module)
                                    (.call (.-stage staging-module) staging-module "pages" page-id #js {:layoutType layout-type} (str "Agent: Mold Layout - " layout-type)))
                                  (js/console.log "CMS Agent: Layout molded to" layout-type "for page" page-id))))))
  )

(defn update-typography [section-id font-params]
  (log-op "Update Typography" #js {:section section-id :params font-params})
  ;; Implementation: Update typography for a section
  (when-let [staging-promise (get-staging)]
    (.then staging-promise (fn [mod]
                              (when (.-exports mod)
                                (let [staging-module (.-exports mod)]
                                  (when (.-stage staging-module)
                                    ;; Find which page contains this section and update it
                                    (.call (.-stage staging-module) staging-module "pages" "typography-updates" #js {:sectionId section-id :typography font-params} (str "Agent: Typography Update - " section-id)))
                                  (js/console.log "CMS Agent: Typography updated for section" section-id))))))
  )

(defn sync-all-tabs []
  (log-op "Syncing all tabs" #js {})
  (when-let [sync-engine-promise (get-sync-engine)]
    (.then sync-engine-promise (fn [mod]
                         (when (.-exports mod)
                           (let [exports (.-exports mod)]
                             ;; Initialize if not already
                             (when (.-init exports)
                               (.call (.-init exports) exports))
                             ;; Broadcast sync message
                             (when (.-broadcast exports)
                               (.call (.-broadcast exports) exports "sync" #js {:action "refresh" :timestamp (js/Date.now)})
                               (js/console.log "CMS Agent: Sync broadcast sent to all tabs"))))))))

(def exports
  #js {:moldLayout mold-layout
       :updateTypography update-typography
       :syncAllTabs sync-all-tabs})
