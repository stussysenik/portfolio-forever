(ns portfolio.utils.section-typography
  "Section typography utilities.
   Ported from src/lib/utils/section-typography.ts")

(defn get-typography-style [config]
  "Build inline style string from section typography config."
  (let [t (and config (aget config "typography"))]
    (if (not t)
      ""
      (->> [(when-let [v (aget t "fontSize")] (str "font-size: " v "rem"))
            (when-let [v (aget t "fontWeight")] (str "font-weight: " v))
            (when-let [v (aget t "letterSpacing")] (str "letter-spacing: " v "em"))
            (when-let [v (aget t "lineHeight")] (str "line-height: " v))]
           (filterv some?)
           (clojure.string/join "; ")))))
