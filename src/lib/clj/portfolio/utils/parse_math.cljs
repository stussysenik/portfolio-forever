(ns portfolio.utils.parse-math
  "Math parsing utilities — splits strings into text and math segments.
   Ported from src/lib/utils/parseMath.ts")

(defn parse-math [input]
  "Split a string into text + math segments. Supports `$$...$$` block math
   and `$...$` inline math. `\\$` escapes a literal dollar sign."
  (if (not input)
    #js [#js {:type "text" :value ""}]
    (let [out #js []
          len (count input)]
      (loop [i 0
             buf ""]
        (if (>= i len)
          (do
            (when (not (empty? buf))
              (.push out #js {:type "text" :value buf}))
            (if (= (count out) 0)
              #js [#js {:type "text" :value ""}]
              out))
          (let [ch (nth input i)
                next-ch (when (< (inc i) len) (nth input (inc i)))]
            (cond
              ;; Escaped dollar sign
              (and (= ch "\\") (= next-ch "$"))
              (recur (+ i 2) (str buf "$"))

              ;; Block math $$...$$
              (and (= ch "$") (= next-ch "$"))
              (let [end (.indexOf input "$$" (+ i 2))]
                (if (= end -1)
                  (recur (+ i 2) (str buf "$$"))
                  (do
                    (when (not (empty? buf))
                      (.push out #js {:type "text" :value buf}))
                    (.push out #js {:type "math" :value (.slice input (+ i 2) end) :displayMode true})
                    (recur (+ end 2) ""))))

              ;; Inline math $...$
              (= ch "$")
              (let [end (loop [j (inc i)]
                          (if (>= j len)
                            -1
                            (let [c (nth input j)
                                  nc (when (< (inc j) len) (nth input (inc j)))]
                              (cond
                                (and (= c "\\") (= nc "$")) (recur (+ j 2))
                                (= c "$") j
                                :else (recur (inc j))))))]
                (if (= end -1)
                  (recur (inc i) (str buf "$"))
                  (do
                    (when (not (empty? buf))
                      (.push out #js {:type "text" :value buf}))
                    (.push out #js {:type "math" 
                                    :value (.replace (.slice input (inc i) end) (js/RegExp. "\\\\\\$" "g") "$") 
                                    :displayMode false})
                    (recur (inc end) ""))))

              :else
              (recur (inc i) (str buf ch)))))))))
