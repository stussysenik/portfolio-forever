(ns portfolio.stores.toast
  "Toast notification store — success, error, info alerts.
   Ported from src/lib/stores/toast.ts"
  (:require ["svelte/store" :refer [writable]]))

(defonce next-id (atom 0))

(defn create-toast-store []
  (let [store (writable #js [])
        update (aget store "update")
        dismiss (fn [id]
                  (update (fn [t] (.filter t (fn [toast] (not= (aget toast "id") id))))))
        add (fn [msg type]
              (let [id (swap! next-id inc)]
                (update (fn [t] (.concat t #js [#js {:id id :message msg :type (or type "info")}])))
                (js/setTimeout (fn [] (dismiss id)) 3000)))]
    #js {:subscribe (aget store "subscribe")
         :success (fn [msg] (add msg "success"))
         :error (fn [msg] (add msg "error"))
         :info (fn [msg] (add msg "info"))
         :add add
         :dismiss dismiss}))

(def toast (create-toast-store))
