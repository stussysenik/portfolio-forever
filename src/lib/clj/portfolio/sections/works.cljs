(ns portfolio.sections.works
  "Works section logic — handles Convex subscriptions, project transformations, and view modes.
   Ported from src/lib/sections/WorksSection.svelte"
  (:require [portfolio.convex.client :as convex]
            [portfolio.data.content :as data]))

(js* "import { api } from '$lib/app-shims';")

(defn use-static-preview? [project]
  (or (= (aget project "previewMode") "static")
      (and (aget project "preview") (not (aget project "videoPreview")))))

(defn use-video-preview? [project]
  (or (= (aget project "previewMode") "video")
      (and (aget project "videoPreview") (aget project "preview"))))

(defn get-object-position [project]
  (or (aget project "objectPosition")
      (let [fx (aget project "focalX")
            fy (aget project "focalY")]
        (if (and fx fy)
          (str fx "% " fy "%")
          "center top"))))

(defn get-zoom-style [project]
  (if-let [zoom (aget project "zoom")]
    (str "transform: scale(" zoom "); transform-origin: " (get-object-position project) ";")
    ""))

(defn override-vars [project]
  "Collect styleOverrides as inline CSS var declarations."
  (let [o (or (aget project "styleOverrides") #js {})]
    (->> [(when-let [v (aget o "accentColor")] (str "--works-stripe-color: " v))
          (when-let [v (aget o "httpColor")] (str "--works-http-color: " v))
          (when-let [v (aget o "secondaryHighlight")] (str "--works-secondary-highlight: " v))]
         (filterv some?)
         (clojure.string/join "; "))))

(def color-map
  {"orange" "#F97242"
   "cloud" "#EBEBEB"
   "ocean" "#BAF1F9"
   "gold" "#DAB230"
   "pink" "#FFC0CB"
   "electric-green" "#39FF14"
   "green" "#4CAF50"
   "yellow" "#FFEB3B"
   "red" "#F44336"})

(defn get-row-style [work]
  (let [featured (aget work "featured")
        style-overrides (aget work "styleOverrides")]
    (if-let [color (get color-map featured)]
      (str "--row-bg: " color)
      (if (and style-overrides (aget style-overrides "accentColor"))
        (str "--row-bg: " (aget style-overrides "accentColor"))
        ""))))

(defn format-work-date [work]
  (let [y (aget work "year")
        m (aget work "month")]
    (if (and y m)
      (str y "." (.padStart (str m) 2 "0"))
      (or y ""))))

(defn get-works-hiccup [projects display-mode grid-cols show-preview view-mode is-screen-pass]
  "Returns the works section as a Hiccup-like structure."
  (let [visible-projects (if is-screen-pass (.slice projects 0 11) projects)
        children (map (fn [p]
                        #js ["a" #js {:href (aget p "url")
                                      :target "_blank"
                                      :class "work-row"
                                      :style (get-row-style p)}
                             #js ["span" #js {:class "work-date"} (format-work-date p)]
                             #js ["span" #js {:class "work-title"} (aget p "title")]
                             #js ["span" #js {:class "work-link"} "visit"]])
                      visible-projects)
        div #js ["div" #js {:class "works-list"}]]
    (doseq [c children]
      (.push div c))
    #js ["section" #js {:class "works-list-container" :id "works"}
         #js ["header" #js {:class "table-header"}
              #js ["span" #js {:class "table-marker"} "◆"]
              #js ["h2" #js {:class "table-title"} "WORKS"]
              #js ["span" #js {:class "table-count"} (str "[" (count projects) "]")]]
         div]))

(defn setup-works-subscriptions [client callbacks]
  "Sets up Convex subscriptions for the works section.
   callbacks: #js {:onWorks (fn [data] ...) :onThumbnails (fn [data] ...) :onSection (fn [data] ...)}
   Returns a function to unsubscribe from all."
  (let [on-works (aget callbacks "onWorks")
        on-thumbnails (aget callbacks "onThumbnails")
        on-section (aget callbacks "onSection")
        api (js* "api")

        unsub-works (.onUpdate client (aget api "works" "getVisibleWorks") #js {}
                               (fn [data] (when on-works (on-works data))))
        unsub-thumbnails (.onUpdate client (aget api "thumbnails" "getConfig") #js {:section "works"}
                                    (fn [data] (when on-thumbnails (on-thumbnails data))))
        unsub-section (.onUpdate client (aget api "sectionRegistry" "getBySectionId") #js {:sectionId "works"}
                                 (fn [data] (when on-section (on-section data))))]
    (fn []
      (unsub-works)
      (unsub-thumbnails)
      (unsub-section))))
