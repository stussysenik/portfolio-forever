(ns portfolio.convex.client
  "Convex client singleton — provides a Clojure-idiomatic interface to Convex.
   Ported from src/lib/convex.ts"
  (:require ["convex/browser" :refer [ConvexClient]]))

(js* "import { env } from '$lib/app-shims';")

(defonce client-atom (atom nil))

(defn get-convex-client []
  (if-let [c @client-atom]
    c
    (let [url (aget (js* "env") "PUBLIC_CONVEX_URL")]
      (if (not url)
        (js/Error. "PUBLIC_CONVEX_URL is not set")
        (let [new-client (ConvexClient. url)]
          (reset! client-atom new-client)
          new-client)))))
