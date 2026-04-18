(ns portfolio.components.donut
  "High-trust Donut Engine — Ported with Fortran-grade precision and Ada-style safety.
   Canonical Clojure implementation for Portfolio Forever.")

(def width 80)
(def height 24)
(def buffer-size (* width height))
(def chars ".,-~:;=!*%#@")

;; Pure mathematical constants
(def pi 3.141592653589793)
(def tau (* 2.0 pi))

(defn create-buffers []
  "Ada-style robust buffer initialization"
  #js {:b (js/Uint8Array. buffer-size)
       :z (js/Float32Array. buffer-size)})

(defn- calculate-luminance [sin-i cos-j sin-a sin-j cos-a cos-b cos-i sin-b]
  "Fortran-inspired high-precision luminance calculation"
  (let [L (- (* (- (* sin-j sin-a) (* sin-i cos-j cos-a)) cos-b)
             (* sin-i cos-j sin-a)
             (* sin-j cos-a)
             (* cos-i cos-j sin-b))]
    (js/Math.floor (* 8 L))))

(defn compute-frame [buffers a b]
  "The core functional rendering loop"
  (let [b-arr (aget buffers "b")
        z-arr (aget buffers "z")
        sin-a (js/Math.sin a)
        cos-a (js/Math.cos a)
        sin-b (js/Math.sin b)
        cos-b (js/Math.cos b)]
    
    ;; Initial Clean State
    (.fill b-arr 32)
    (.fill z-arr 0)

    ;; Impeccable Double Loop (Torus Geometry)
    (loop [j 0.0]
      (when (< j tau)
        (let [sin-j (js/Math.sin j)
              cos-j (js/Math.cos j)]
          (loop [i 0.0]
            (when (< i tau)
              (let [sin-i (js/Math.sin i)
                    cos-i (js/Math.cos i)
                    h (+ cos-j 2.0)
                    d (/ 1.0 (+ (* sin-i h sin-a) (* sin-j cos-a) 5.0))
                    t (- (* sin-i h cos-a) (* sin-j sin-a))
                    
                    ;; Project to Screen
                    x (js/Math.floor (+ 40.0 (* 30.0 d (- (* cos-i h cos-b) (* t sin-b)))))
                    y (js/Math.floor (+ 12.0 (* 15.0 d (+ (* cos-i h sin-b) (* t cos-b)))))
                    o (+ x (* width y))
                    
                    ;; Lighting
                    n (calculate-luminance sin-i cos-j sin-a sin-j cos-a cos-b cos-i sin-b)]
                
                ;; Depth Buffer Check
                (when (and (>= y 0) (< y height) (>= x 0) (< x width) (> d (aget z-arr o)))
                  (aset z-arr o d)
                  (let [char-idx (js/Math.min (dec (count chars)) (js/Math.max 0 n))]
                    (aset b-arr o (.charCodeAt chars char-idx))))
                (recur (+ i 0.02)))))
          (recur (+ j 0.07)))))

    ;; Immutable String Assembly
    (clojure.string/join 
      "" 
      (map-indexed 
        (fn [idx v] 
          (str (js/String.fromCharCode v) 
               (when (zero? (mod (inc idx) width)) "\n")))
        b-arr))))
