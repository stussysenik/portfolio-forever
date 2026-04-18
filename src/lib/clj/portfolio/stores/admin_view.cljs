(ns portfolio.stores.admin-view
  (:require ["svelte/store" :refer [writable]]))

(defonce ^:export admin-view-store
  (let [initial-state {:currentView "dashboard"
                       :currentSubView nil}
        store (writable initial-state)]
    #js {:subscribe (.-subscribe store)
         :setView (fn [view sub-view]
                    (.set store {:currentView view :currentSubView sub-view}))
         :update (.-update store)}))
