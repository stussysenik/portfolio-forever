(ns portfolio.sections.gallery
  "Gallery section logic — handles filtering, categorization, and media type detection."
  (:require [portfolio.convex.client :as convex]))

(js* "import { api } from '$lib/app-shims';")

(defn setup-gallery-subscriptions [client callbacks]
  (let [on-items (aget callbacks "onItems")
        api (js* "api")
        unsub (.onUpdate client (aget api "gallery" "getVisibleGallery") #js {}
                        (fn [data] (when on-items (on-items data))))]
    (fn [] (unsub))))

(defn is-video [item]
  (let [mux-id (aget item "muxPlaybackId")
        url (or (aget item "fullUrl") (aget item "thumbnailUrl") "")]
    (or (not (nil? mux-id))
        (let [ext (-> url (.split ".") (.pop) (.toLowerCase))]
          (contains? #{"mp4" "webm" "mov" "avi"} ext)))))

(defn filter-items [items active-filter]
  (if (= active-filter "all")
    items
    (filter (fn [item]
              (let [cats (let [c (aget item "category")]
                           (if (js/Array.isArray c) c #js [c]))]
                (some #(= % active-filter) cats)))
            items)))
