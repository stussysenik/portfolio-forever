(ns portfolio.sections.cv
  "CV section logic — handles Convex subscriptions and timeline transformations.
   Ported from src/lib/sections/CvSection.svelte"
  (:require [portfolio.convex.client :as convex]))

(js* "import { api } from '$lib/app-shims';")

(defn format-date-range [start end]
  "Formats a date range string."
  (let [fmt (fn [d]
              (let [date (js/Date. d)]
                (.toLocaleDateString date "en-US" #js {:year "numeric" :month "short"})))]
    (if end
      (str (fmt start) " — " (fmt end))
      (str (fmt start) " — Present"))))

(defn get-entries-for-type [entries type]
  "Filters and sorts entries by type."
  (->> entries
       (.filter (fn [e] (and (= (aget e "type") type) (aget e "visible"))))
       (.sort (fn [a b] (- (aget a "order") (aget b "order"))))))

(defn get-sorted-sections [sections is-screen-pass]
  "Sorts and filters sections, optionally limiting for screen-pass."
  (let [sorted (->> sections
                    (.filter (fn [s] (aget s "visible")))
                    (.sort (fn [a b] (- (aget a "order") (aget b "order")))))]
    (if is-screen-pass
      (.slice sorted 0 2)
      sorted)))

(defn setup-cv-subscriptions [client on-data]
  "Sets up Convex subscription for the CV section."
  (let [api (js* "api")]
    (.onUpdate client (aget api "cv" "getVisibleCV") #js {}
               (fn [data] (when on-data (on-data data))))))
