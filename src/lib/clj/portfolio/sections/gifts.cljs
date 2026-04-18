(ns portfolio.sections.gifts
  "Gifts section logic — handles registry configuration."
  (:require [portfolio.convex.client :as convex]))

(js* "import { api } from '$lib/app-shims';")

(defn setup-gifts-subscriptions [client callbacks]
  (let [on-config (aget callbacks "onConfig")
        api (js* "api")
        unsub (.onUpdate client (aget api "gifts" "getConfig") #js {}
                        (fn [data] (when on-config (on-config data))))]
    (fn [] (unsub))))
