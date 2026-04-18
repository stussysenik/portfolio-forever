(ns portfolio.sections.likes
  "Likes section logic — handles categorized interest lists."
  (:require [portfolio.convex.client :as convex]))

(js* "import { api } from '$lib/app-shims';")

(defn setup-likes-subscriptions [client callbacks]
  (let [on-likes (aget callbacks "onLikes")
        api (js* "api")
        unsub (.onUpdate client (aget api "likes" "getAllCategories") #js {}
                        (fn [data] (when on-likes (on-likes data))))]
    (fn [] (unsub))))
