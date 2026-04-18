(ns portfolio.admin.takeouts
  "Logic for generating and downloading site takeouts (backups).")

(defn generate-takeout-data [site-config pages entries-by-table]
  {:exported-at (.toISOString (js/Date.))
   :site-config site-config
   :pages pages
   :content entries-by-table})

(defn download-json [data filename]
  (let [json-str (js/JSON.stringify (clj->js data) nil 2)
        blob (js/Blob. #js [json-str] #js {:type "application/json"})
        url (.createObjectURL js/URL blob)
        a (.createElement js/document "a")]
    (set! (.-href a) url)
    (set! (.-download a) filename)
    (.appendChild (.-body js/document) a)
    (.click a)
    (.removeChild (.-body js/document) a)
    (.revokeObjectURL js/URL url)))

(defn ^:export takeout-all! [site-config pages entries-by-table]
  (let [data (generate-takeout-data site-config pages entries-by-table)
        date-str (first (.split (.toISOString (js/Date.)) "T"))
        filename (str "portfolio-takeout-" date-str ".json")]
    (download-json data filename)))

(defn ^:export takeout-table! [table-name entries]
  (let [data {:exported-at (.toISOString (js/Date.))
              :table table-name
              :entries entries}
        date-str (first (.split (.toISOString (js/Date.)) "T"))
        filename (str "portfolio-" table-name "-" date-str ".json")]
    (download-json data filename)))
