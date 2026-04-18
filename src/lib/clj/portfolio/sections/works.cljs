(ns portfolio.sections.works
  "Works section logic — handles Convex subscriptions, project transformations, and view modes.
   Ported from src/lib/sections/WorksSection.svelte"
  (:require [portfolio.convex.client :as convex]))

(js* "import { api } from '$lib/app-shims';")

(defn override-vars [project]
  "Collect styleOverrides as inline CSS var declarations."
  (let [o (or (aget project "styleOverrides") #js {})]
    (->> [(when-let [v (aget o "accentColor")] (str "--works-stripe-color: " v))
          (when-let [v (aget o "httpColor")] (str "--works-http-color: " v))
          (when-let [v (aget o "secondaryHighlight")] (str "--works-secondary-highlight: " v))]
         (filterv some?)
         (clojure.string/join "; "))))

(defn use-static-preview? [project]
  (and (= (aget project "previewMode") "static")
       (not (empty? (aget project "preview")))))

(defn use-video-preview? [project]
  (and (= (aget project "previewMode") "video")
       (not (empty? (aget project "videoPreview")))))

(defn get-object-position [project]
  "Compute CSS object-position from focal point. Fallback: focal -> cam -> objectPosition -> 'center top'."
  (let [fx (aget project "focalX")
        fy (aget project "focalY")]
    (if (and (not (nil? fx)) (not (nil? fy)))
      (str fx "% " fy "%")
      (or (aget project "cam") (aget project "objectPosition") "center top"))))

(defn get-zoom-style [project]
  "Zoom transform when zoom > 1."
  (let [zoom (or (aget project "zoom") 1.0)]
    (if (<= zoom 1.0)
      ""
      (let [ox (or (aget project "focalX") 50)
            oy (or (aget project "focalY") 50)]
        (str "transform: scale(" zoom "); transform-origin: " ox "% " oy "%;")))))

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
