(ns portfolio.admin.core
  (:require [portfolio.admin.staging :as staging]
            [portfolio.stores.toast :as toast]))

(defn stage-work-entry [id patch]
  (staging/stage "worksEntries" id patch (str "Update Work: " (or (aget patch "title") id))))

(defn stage-blog-post [id patch]
  (staging/stage "blogPosts" id patch (str "Update Blog: " (or (aget patch "title") id))))

(defn stage-page-sections [page-id sections label]
  (staging/stage "pages" page-id #js {:sections sections} label))

(defn stage-site-config [patch label]
  (staging/stage "siteConfig" "singleton" patch label))

(defn stage-hero-config [patch label]
  (staging/stage "heroConfig" "singleton" patch label))

(def exports
  #js {:stageWorkEntry stage-work-entry
       :stageBlogPost stage-blog-post
       :stagePageSections stage-page-sections
       :stageSiteConfig stage-site-config
       :stageHeroConfig stage-hero-config
       :commit staging/commit
       :clear staging/clear})
