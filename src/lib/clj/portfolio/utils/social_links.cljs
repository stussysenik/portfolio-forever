(ns portfolio.utils.social-links
  "Social link utilities — icon resolution and URL helpers.
   Ported from src/lib/utils/social-links.ts")

(def social-icon-map
  {"soundcloud" "music"
   "imdb" "film"
   "github" "code"
   "linkedin" "briefcase"
   "instagram" "camera"
   "x" "hash"
   "dribbble" "palette"
   "behance" "pen-tool"
   "letterboxd" "clapperboard"
   "storygraph" "book-open"
   "email" "mail"})

(defn get-social-icon [label]
  (get social-icon-map (string/lower-case label) "link"))

(defn social-url->icon-class [url]
  (cond
    (.includes url "github") "github"
    (.includes url "linkedin") "linkedin"
    (.includes url "instagram") "instagram"
    (.includes url "soundcloud") "soundcloud"
    (.includes url "imdb") "imdb"
    (.includes url "x.com") "x"
    (.includes url "twitter") "x"
    :else "link"))