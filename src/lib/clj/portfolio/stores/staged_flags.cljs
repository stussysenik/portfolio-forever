(ns portfolio.stores.staged-flags
  "Staged feature flag store — batch flag changes before committing to Convex.
   Ported from src/lib/stores/stagedFlags.ts
   Simplified JS interop for Squint compatibility."
  (:require ["svelte/store" :refer [writable]]))

(defn create-staged-flags-store []
  (let [store (writable (js/Map.))
]
    #js {:subscribe (.-subscribe store)
         :stage (fn [key enabled category label]
                  (.update store (fn [m]
                                   (let [result (js/Map. m)]
                                     (.set result key #js {:key key :enabled enabled :category category :label label})
                                     result))))
         :unstage (fn [key]
                    (.update store (fn [m]
                                     (let [result (js/Map. m)]
                                       (.delete result key)
                                       result))))
         :clear (fn [] (.set store (js/Map.)))
         :snapshot (fn [] (.get store))}))