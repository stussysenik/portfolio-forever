(ns portfolio.utils.overlap-detector
  "Overlap Detector — visual diagnostic for element overlap issues.
   Simplified for Squint compatibility — browser-only DOM scanning.")

(def min-size 10)
(def min-area 100)

(defn scan-overlaps []
  "Scans viewport for overlapping elements. Returns array of overlap hits.
   Browser-only — returns empty array in SSR."
  (when (and (exists? js/document) (exists? js/window))
    (let [vw (.-innerWidth js/window)
          vh (.-innerHeight js/window)
          all (.querySelectorAll js/document "*")
          candidates (atom [])]
      (loop [i 0]
        (when (< i (.-length all))
          (let [el (aget all i)]
            (when-not (.hasAttribute el "data-overlap-detector")
              (let [s (.getComputedStyle js/document el)
                    r (.getBoundingClientRect el)]
                (when (and (not= (.-display s) "none")
                           (not= (.-visibility s) "hidden")
                           (not= (.-opacity s) "0")
                           (>= (.-width r) min-size)
                           (>= (.-height r) min-size)
                           (>= (.-bottom r) 0)
                           (<= (.-top r) vh)
                           (>= (.-right r) 0)
                           (<= (.-left r) vw))
                  (swap! candidates conj #js {:el el :rect r}))))
            (recur (inc i)))))
      (let [hits (atom [])]
        (dotimes [i (count @candidates)]
          (dotimes [j (count @candidates)]
            (when (> j i)
              (let [a (nth @candidates i)
                    b (nth @candidates j)]
                (when-not (or (.contains (.-el a) (.-el b)) (.contains (.-el b) (.-el a)))
                  (let [aRect (.-rect a)
                        bRect (.-rect b)]
                    (when (and (< (.-left aRect) (.-right bRect))
                               (> (.-right aRect) (.-left bRect))
                               (< (.-top aRect) (.-bottom bRect))
                               (> (.-bottom aRect) (.-top bRect)))
                      (let [x (js/Math.max 0 (- (js/Math.min (.-right aRect) (.-right bRect)) (js/Math.max (.-left aRect) (.-left bRect))))
                            y (js/Math.max 0 (- (js/Math.min (.-bottom aRect) (.-bottom bRect)) (js/Math.max (.-top aRect) (.-top bRect))))
                            area (* x y)]
                        (when (>= area min-area)
                          (swap! hits conj #js {:elA (.-el a) :elB (.-el b) :area area :aRect aRect :bRect bRect}))))))))))
        @hits))))