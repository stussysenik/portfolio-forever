(ns portfolio.ui.impeccable
  "Impeccable Design System — grounded in ui.sh standards.
   Enforces 12pt spacing, 12-column asymmetrical grids, and high-trust visual rhythm.")

(def grid-columns 12)
(def base-unit 12) ;; 12pt design grid

(defn px [units]
  (str (* units base-unit) "px"))

(defn rem [units]
  (str (* units 0.75) "rem")) ;; 12px = 0.75rem

;; Asymmetrical Layout Logic
(defn get-hero-layout [view-mode]
  (case view-mode
    "editorial" #js {:identity 5 :visual 7}
    "balanced"  #js {:identity 6 :visual 6}
    "focus"     #js {:identity 4 :visual 8}
    #js {:identity 5 :visual 7})) ;; Default to impeccable 5:7 split

;; Vertical Rhythm
(defn vertical-space [scale]
  (case scale
    :xs (rem 1)  ;; 12px
    :sm (rem 2)  ;; 24px
    :md (rem 4)  ;; 48px
    :lg (rem 8)  ;; 96px
    :xl (rem 12) ;; 144px
    (rem 4)))
