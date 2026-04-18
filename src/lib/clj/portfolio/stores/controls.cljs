(ns portfolio.stores.controls
  "Control theory stores — depth, theme, physics, embellishments.
   Ported from src/lib/stores/controls.ts
   Pure data definitions. Svelte store instances are created in JS land.")

(def depth-levels ["5-min" "15-min" "full"])
(def theme-modes ["minimalist" "brutalist" "night-vision"])
(def physics-modes ["frictionless" "spring" "string"])

(def parallax-multipliers {:spring 0.1 :frictionless 0 :string 0.25})
(def scroll-behaviors {:spring "smooth" :frictionless "auto" :string "smooth"})

(defn get-parallax-multiplier [mode] (get parallax-multipliers mode 0.1))
(defn get-scroll-behavior [mode] (get scroll-behaviors mode "smooth"))

(defn is-screen-pass? [depth] (= depth "5-min"))
(defn is-deep-dive? [depth] (= depth "15-min"))
(defn is-full-archive? [depth] (= depth "full"))
(defn is-night-vision? [theme] (= theme "night-vision"))
(defn is-brutalist? [theme] (= theme "brutalist"))
(defn is-fluid-string? [physics] (= physics "string"))
(defn is-frictionless? [physics] (= physics "frictionless"))