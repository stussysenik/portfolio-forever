(ns portfolio.sections.minor
  "Minor section logic — handles miscellaneous list entries."
  (:require [portfolio.convex.client :as convex]))

(js* "import { api } from '$lib/app-shims';")

(defn setup-minor-subscriptions [client callbacks]
  (let [on-minor (aget callbacks "onMinor")
        api (js* "api")
        unsub (.onUpdate client (aget api "minor" "getVisibleMinor") #js {}
                        (fn [data] (when on-minor (on-minor data))))]
    (fn [] (unsub))))
