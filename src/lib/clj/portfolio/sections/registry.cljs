(ns portfolio.sections.registry
  "Section registry — maps section IDs to their metadata and rendering config.
   Ported from src/lib/sections/registry.ts
   The authoritative section type definitions and categorization.")

(def section-categories
  {:content #{"hero" "works-grid" "blog-feed" "cv" "timeline" "academia"}
   :media #{"gallery" "terminal"}
   :layout #{"process" "gifts" "os" "likes" "minor" "labs"}})

(def section-registry
  [{:id "hero" :label "Home" :route "/" :category "content"
    :view-mode "grid" :animation-bg "none" :animation-speed 1 :animation-opacity 0.5 :immune false}
   {:id "works-grid" :label "Works" :route "/works" :category "content"
    :view-mode "grid" :animation-bg "none" :animation-speed 1 :animation-opacity 0.5 :immune false}
   {:id "timeline" :label "Talks" :route "/talks" :category "content"
    :view-mode "grid" :animation-bg "none" :animation-speed 1 :animation-opacity 0.5 :immune false}
   {:id "terminal" :label "Terminal" :route "/terminal" :category "media"
    :view-mode "terminal" :animation-bg "none" :animation-speed 1 :animation-opacity 0.5 :immune false}
   {:id "cv" :label "CV" :route "/cv" :category "content"
    :view-mode "timeline" :animation-bg "none" :animation-speed 1 :animation-opacity 0.5 :immune false}
   {:id "academia" :label "Re:mix" :route "/academia" :category "content"
    :view-mode "grid" :animation-bg "none" :animation-speed 1 :animation-opacity 0.5 :immune false}
   {:id "blog-feed" :label "Blog" :route "/blog" :category "content"
    :view-mode "list" :animation-bg "none" :animation-speed 1 :animation-opacity 0.5 :immune false}
   {:id "process" :label "Process" :route "/process" :category "layout"
    :view-mode "cycle" :animation-bg "none" :animation-speed 1 :animation-opacity 0.5 :immune false}
   {:id "gallery" :label "Gallery" :route "/gallery" :category "media"
    :view-mode "mosaic" :animation-bg "none" :animation-speed 1 :animation-opacity 0.5 :immune false}
   {:id "likes" :label "Likes" :route "/likes" :category "layout"
    :view-mode "list" :animation-bg "none" :animation-speed 1 :animation-opacity 0.5 :immune false}
   {:id "minor" :label "Minor" :route "/minor" :category "layout"
    :view-mode "list" :animation-bg "none" :animation-speed 1 :animation-opacity 0.5 :immune false}
   {:id "labs" :label "Labs" :route "/labs" :category "layout"
    :view-mode "list" :animation-bg "none" :animation-speed 1 :animation-opacity 0.5 :immune false}
   {:id "gifts" :label "Gifts" :route "/gifts" :category "layout"
    :view-mode "list" :animation-bg "none" :animation-speed 1 :animation-opacity 0.5 :immune false}
   {:id "os" :label "OS" :route "/os" :category "layout"
    :view-mode "desktop" :animation-bg "none" :animation-speed 1 :animation-opacity 0.5 :immune false}])

(defn get-section [id]
  (first (filterv #(= (:id %) id) section-registry)))

(defn get-sections-by-category [category]
  (filterv #(= (:category %) category) section-registry))

(defn section-routes []
  (mapv #(select-keys % [:id :label :route]) section-registry))