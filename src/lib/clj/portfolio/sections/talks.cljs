(ns portfolio.sections.talks
  "Talks section logic — handles Convex subscriptions for speaking engagements."
  (:require [portfolio.convex.client :as convex]))

(js* "import { api } from '$lib/app-shims';")

(defn setup-talks-subscriptions [client callbacks]
  "Sets up Convex subscriptions for the talks section.
   callbacks: #js {:onTalks (fn [data] ...)}
   Returns a function to unsubscribe."
  (let [on-talks (aget callbacks "onTalks")
        api (js* "api")
        unsub (.onUpdate client (aget api "talks" "getVisibleTalks") #js {}
                        (fn [data] (when on-talks (on-talks data))))]
    (fn [] (unsub))))

(defn sort-talks [talks]
  "Sorts talks by date descending."
  (if talks
    (.sort (into-array talks)
           (fn [a b]
             (let [year-diff (- (aget b "year") (aget a "year"))]
               (if (not= year-diff 0)
                 year-diff
                 (- (or (aget b "month") 0) (or (aget a "month") 0))))))
    #js []))
