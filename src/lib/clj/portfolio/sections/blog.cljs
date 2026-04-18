(ns portfolio.sections.blog
  "Blog section logic — handles Convex subscriptions and reactive data.
   Ported from src/lib/sections/BlogSection.svelte")

(js* "import { api } from '$lib/app-shims';")

(defn setup-blog-subscriptions [client callbacks]
  "Sets up Convex subscriptions for the blog section.
   callbacks: #js {:onPosts (fn [data] ...)}
   Returns a function to unsubscribe."
  (let [on-posts (aget callbacks "onPosts")
        api (js* "api")
        unsub (.onUpdate client (aget api "blog" "getVisiblePosts") #js {}
                        (fn [data] (when on-posts (on-posts data))))]
    (fn [] (unsub))))

(defn sort-posts [posts]
  "Sorts blog posts by publishedAt date descending."
  (if posts
    (.sort (into-array posts)
           (fn [a b]
             (- (js/Date.parse (aget b "publishedAt"))
                (js/Date.parse (aget a "publishedAt")))))
    #js []))

(defn get-all-tags [posts]
  "Extracts unique tags from all posts."
  (if posts
    (-> (reduce (fn [tags post]
                  (let [post-tags (or (aget post "tags") #js [])]
                    (reduce (fn [t tag] (conj t tag)) tags post-tags)))
                #{}
                posts)
        (sort)
        (into-array))
    #js []))

(defn filter-posts-by-tag [posts tag]
  "Filters posts by a specific tag."
  (if (and posts tag)
    (filter (fn [post]
              (let [post-tags (into #{} (or (aget post "tags") #js []))]
                (contains? post-tags tag)))
            posts)
    posts))
