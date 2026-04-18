(ns portfolio.utils.depth-filter
  "Section depth filtering — visual diagnostic for information density.
   Ported from src/lib/utils/depth-filter.ts")

(def screen-pass-sections #{"hero" "works" "cv"})

(defn filter-by-depth [sections depth]
  (if (= depth "5-min")
    (filterv #(contains? screen-pass-sections %) sections)
    sections))

  (defn is-screen-pass [depth] (= depth "5-min"))
  (defn is-deep-dive [depth] (= depth "15-min"))
  (defn is-full-archive [depth] (= depth "full"))