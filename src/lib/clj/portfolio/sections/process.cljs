(ns portfolio.sections.process
  "Process section logic — handles step definitions and SVG geometry computation."
  (:require [portfolio.data.content :as content]))

(defn get-phases []
  (map-indexed 
    (fn [idx step]
      #js {:label (:title step)
           :description (:description step)
           :order idx})
    content/process-steps))

(def rect-width 180)
(def rect-height 60)
(def rect-x 80)
(def phase-spacing 100)
(def first-y 20)
(def center-x (+ rect-x (/ rect-width 2)))
(def cycle-margin 60)
(def cycle-x 40)

(defn compute-geometry [phases-count]
  (let [last-phase-y (+ first-y (* (dec phases-count) phase-spacing))
        view-box-height (+ last-phase-y rect-height cycle-margin)]
    #js {:lastPhaseY last-phase-y
         :viewBoxHeight view-box-height
         :centerX center-x
         :firstMidY (+ first-y (/ rect-height 2))
         :cycleBottom (+ last-phase-y rect-height (- cycle-margin 20))}))
