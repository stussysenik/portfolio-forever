(ns portfolio.sections.os
  "OS section logic — handles desktop environment state and windows."
  (:require [portfolio.convex.client :as convex]))

(js* "import { api } from '$lib/app-shims';")

(defn setup-os-subscriptions [client callbacks]
  (let [on-config (aget callbacks "onConfig")
        api (js* "api")
        unsub (.onUpdate client (aget api "os" "getConfig") #js {}
                        (fn [data] (when on-config (on-config data))))]
    (fn [] (unsub))))
