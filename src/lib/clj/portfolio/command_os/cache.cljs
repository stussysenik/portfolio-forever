(ns portfolio.command-os.cache
  "LRU command cache for the command palette.
   Ported from src/lib/command-os/cache.ts")

(defn make-lru-cache [max-size]
  (let [map (atom (js/Map.))]
    #js {:get (fn [key] (let [m @map
                              v (.get m key)]
                          (when v
                            (.delete m key)
                            (.set m key v)
                            v)))
         :set (fn [key value] (let [m @map]
                                (when (.has m key) (.delete m key))
                                (.set m key value)
                                (when (> (.-size m) max-size)
                                  (.delete m (.next (.keys m))))
                                value))
         :clear (fn [] (reset! map (js/Map.)))
         :size (fn [] (.-size @map))}))

(def command-cache (make-lru-cache 20))