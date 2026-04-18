(ns portfolio.utils.scroll-physics
  "Scroll physics utilities — parallax multipliers and scroll behaviors.
   Ported from src/lib/utils/scroll-physics.ts
   Note: PhysicsMode type is defined here and re-exported for Svelte interop.")

(def parallax-multipliers
  {:spring 0.1
   :frictionless 0
   :string 0.25})

(def scroll-behaviors
  {:spring "smooth"
   :frictionless "auto"
   :string "smooth"})

(defn get-parallax-multiplier [mode]
  (get parallax-multipliers mode 0.1))

(defn get-scroll-behavior [mode]
  (get scroll-behaviors mode "smooth"))