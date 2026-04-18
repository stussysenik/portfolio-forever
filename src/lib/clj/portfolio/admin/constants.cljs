(ns portfolio.admin.constants
  "Admin constants — view modes, defaults, color palette, typography scales.
   Ported from src/lib/admin/constants.ts")

(def view-modes #{"grid" "case-study" "minimal-list"})

(defn strip-convex-meta [doc]
  "Strip Convex system fields (_id, _creationTime) before passing to mutations."
  (let [result (js/Object.assign #js {} doc)]
    (js/delete result "_id")
    (js/delete result "_creationTime")
    result))

(def defaults
  {:hero {:hero-name-size 3.5
          :hero-name-weight 400
          :hero-name-letter-spacing 0
          :hero-name-line-height 1.2
          :hero-name-text-wrap "wrap"}
   :site-config {:mode "multi-page"
                 :parallax-speed 0.5}})

(def line-height-scale [1 1.15 1.25 1.375 1.5 1.625 1.75 2])

(def font-size-scale
  [{:id "2xs" :rem 0.625} {:id "xs" :rem 0.75} {:id "sm" :rem 0.875}
   {:id "base" :rem 1} {:id "lg" :rem 1.125} {:id "xl" :rem 1.25}
   {:id "2xl" :rem 1.5} {:id "3xl" :rem 1.875} {:id "4xl" :rem 2.25}
   {:id "5xl" :rem 3} {:id "6xl" :rem 3.75} {:id "display" :rem 4.5}])

(def typography-defaults
  {:font-size 1
   :font-weight 400
   :letter-spacing 0
   :line-height 1.5})

(def named-colors
  ["orange" "green" "electric-green" "ocean" "gold" "pink" "cloud" "red" "yellow"])

(def color-css
  {"orange" "#F97242"
   "green" "#44D62C"
   "electric-green" "#44D62C"
   "ocean" "#B3EBF2"
   "gold" "#D2AF26"
   "pink" "#FFC5D3"
   "cloud" "#F0EEE9"
   "red" "#691424"
   "yellow" "#D2AF26"})

(def flag-categories
  [{:id "visual" :label "Visual" :flags ["pixel-engine" "ascii-donut" "parallax" "terminal-matrix"]}
   {:id "layout" :label "Layout" :flags ["view-transitions" "wip-banner" "elevator"]}
   {:id "system" :label "System" :flags ["os-desktop" "social-links" "command-palette"]}])

(defn format-relative-time [timestamp]
  (let [diff (- (js/Date.now) timestamp)
        mins (js/Math.floor (/ diff 60000))]
    (cond
      (< mins 1) "just now"
      (< mins 60) (str mins "m ago")
      :else (let [hours (js/Math.floor (/ mins 60))]
              (if (< hours 24)
                (str hours "h ago")
                (let [days (js/Math.floor (/ hours 24))]
                  (if (< days 30)
                    (str days "d ago")
                    (str (js/Math.floor (/ days 30)) "mo ago"))))))))