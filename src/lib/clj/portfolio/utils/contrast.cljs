(ns portfolio.utils.contrast
  "WCAG contrast utilities for accessible text on colored backgrounds.
   Ported from src/lib/utils/contrast.ts")

(def dark "#1a1a1a")
(def light "#ffffff")

(def featured-hex
  {"yellow" "#fff5c2"
   "green" "#cef3da"
   "electric-green" "#44D62C"
   "orange" "#F97242"
   "ocean" "#B3EBF2"
   "gold" "#D2AF26"
   "pink" "#FFC5D3"
   "cloud" "#F0EEE9"
   "red" "#691424"})

(defn hex->linear-rgb [hex]
  (let [h (.replace hex #"^#" "")
        full (if (= (.-length h) 3)
               (str (nth h 0) (nth h 0) (nth h 1) (nth h 1) (nth h 2) (nth h 2))
               h)
        r (/ (js/parseInt (.slice full 0 2) 16) 255)
        g (/ (js/parseInt (.slice full 2 4) 16) 255)
        b (/ (js/parseInt (.slice full 4 6) 16) 255)
        linearize (fn [c] (if (<= c 0.04045) (/ c 12.92) (js/Math.pow (/ (+ c 0.055) 1.055) 2.4)))]
    [(linearize r) (linearize g) (linearize b)]))

(defn relative-luminance [hex]
  (let [[r g b] (hex->linear-rgb hex)]
    (+ (* 0.2126 r) (* 0.7152 g) (* 0.0722 b))))

(defn contrast-ratio [l1 l2]
  (let [lighter (js/Math.max l1 l2)
        darker (js/Math.min l1 l2)]
    (/ (+ lighter 0.05) (+ darker 0.05))))

(defn get-contrast-color [bg-hex]
  (let [bg-lum (relative-luminance bg-hex)
        dark-ratio (contrast-ratio bg-lum (relative-luminance dark))
        light-ratio (contrast-ratio bg-lum (relative-luminance light))]
    (cond
      (>= dark-ratio 4.5) dark
      (>= light-ratio 4.5) light
      (> light-ratio dark-ratio) light
      :else dark)))

(defn get-highlight-text-color [featured]
  (when featured
    (when-let [bg (get featured-hex featured)]
      (get-contrast-color bg))))

(defn hex-to-rgb [hex] (hex->linear-rgb hex))
(defn get-luminance [hex] (relative-luminance hex))
(defn get-contrast-ratio [l1 l2] (contrast-ratio l1 l2))