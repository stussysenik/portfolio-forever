(ns portfolio.sections.academia
  "Academia section logic — handles Convex subscriptions for research papers."
  (:require [portfolio.convex.client :as convex]))

(js* "import { api } from '$lib/app-shims';")

(defn setup-academia-subscriptions [client callbacks]
  "Sets up Convex subscriptions for the academia section.
   callbacks: #js {:onAcademia (fn [data] ...)}
   Returns a function to unsubscribe."
  (let [on-academia (aget callbacks "onAcademia")
        api (js* "api")
        unsub (.onUpdate client (aget api "academia" "getVisibleAcademia") #js {}
                        (fn [data] (when on-academia (on-academia data))))]
    (fn [] (unsub))))
