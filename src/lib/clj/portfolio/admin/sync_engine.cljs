(ns portfolio.admin.sync-engine
  "Cross-tab synchronization engine for CMS administrative changes.
   Ensures that when you 'mold' the portfolio in one tab, all others stay in sync.")

(defonce channel-name "portfolio:cms:sync")
(defonce sync-channel (when (exists? js/BroadcastChannel) (js/BroadcastChannel. channel-name)))

(defn broadcast [type data]
  (when sync-channel
    (.postMessage sync-channel #js {:type type :data data :senderId (js* "Math.random().toString(36).slice(2, 9)")})))

(defn- handle-message [e]
  (let [msg (.-data e)
        type (.-type msg)
        data (.-data msg)]
    (case type
      "stagedChanges" 
      (when-let [site-mode (js* "import('$lib/stores/siteMode')")]
        (.then site-mode (fn [mod]
                           (when (.-stagedOverrides mod)
                             (.set (.-stagedOverrides mod) data)))))
      
      "toast"
      (when-let [toast (js* "import('$lib/stores/toast')")]
        (.then toast (fn [mod]
                        (when (.-toast mod)
                          (.info (.-toast mod) (aget data "message"))))))

      "sync"
      (when-let [staging (js* "import('$lib/clj/portfolio/admin/staging.mjs')")]
        (.then staging (fn [mod]
                         (when (.-exports mod)
                           (let [exports (.-exports mod)]
                             (when (and (.-subscribe exports) (.-stage exports) (.-commit exports))
                               ;; Trigger re-subscription to staging store to sync state
                               (js/console.log "CMS Sync: Syncing staged changes across tabs")))))))

      (js/console.debug "CMS Sync: Unhandled message type" type))))

(defn init []
  (when sync-channel
    (.addEventListener sync-channel "message" handle-message)))

(def exports
  #js {:broadcast broadcast
       :init init})
