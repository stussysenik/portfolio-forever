(ns portfolio.sections.labs
  "Labs section logic — handles Convex subscriptions for experiments."
  (:require [portfolio.convex.client :as convex]))

(js* "import { api } from '$lib/app-shims';")

(defn setup-labs-subscriptions [client callbacks]
  "Sets up Convex subscriptions for the labs section.
   callbacks: #js {:onLabs (fn [data] ...)}
   Returns a function to unsubscribe."
  (let [on-labs (aget callbacks "onLabs")
        api (js* "api")
        unsub (.onUpdate client (aget api "labs" "getVisibleLabs") #js {}
                        (fn [data] (when on-labs (on-labs data))))]
    (fn [] (unsub))))
