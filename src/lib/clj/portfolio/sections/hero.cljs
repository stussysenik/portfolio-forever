(ns portfolio.sections.hero
  "Hero section logic — handles Convex subscriptions and reactive data.
   Ported from src/lib/sections/HeroSection.svelte"
  (:require [portfolio.convex.client :as convex]
            [portfolio.data.content :as content]))

(js* "import { api } from '$lib/app-shims';")

(defn format-profile-data [data default-profile]
  "Transforms Convex profile data into the format expected by the hero section."
  (if (and data (aget data "profile"))
    (let [p (aget data "profile")]
      #js {:name (or (aget p "name") (aget default-profile "name"))
           :taglines (or (aget p "taglines") (aget default-profile "taglines"))
           :shortBio (or (aget p "shortBio") (aget p "summary") (aget default-profile "shortBio"))
           :location (or (aget p "location") (aget default-profile "location"))
           :available (if (not= (aget p "available") js/undefined) (aget p "available") (aget default-profile "available"))
           :sameAs (or (aget p "sameAs") #js [])})
    default-profile))

(defn setup-hero-subscriptions [client callbacks]
  "Sets up Convex subscriptions for the hero section.
   callbacks: #js {:onProfile (fn [data] ...) :onWorks (fn [data] ...) :onConfig (fn [data] ...)}
   Returns a function to unsubscribe from all."
  (let [on-profile (aget callbacks "onProfile")
        on-works (aget callbacks "onWorks")
        on-config (aget callbacks "onConfig")
        api (js* "api")
        
        unsub-profile (.onUpdate client (aget api "cv" "getVisibleCV") #js {}
                                 (fn [data] (when on-profile (on-profile data))))
        unsub-works (.onUpdate client (aget api "works" "getVisibleWorks") #js {}
                               (fn [data] (when on-works (on-works data))))
        unsub-config (.onUpdate client (aget api "hero" "getHeroConfig") #js {}
                                (fn [data] (when on-config (on-config data))))]
    (fn []
      (unsub-profile)
      (unsub-works)
      (unsub-config))))

(defn get-hero-config-derived [config]
  "Derives UI flags from hero config."
  #js {:showDonut (if config (or (aget config "showAsciiDonut") true) true)
       :showWave (if config (or (aget config "showAsciiWave") false) false)
       :layout (if config (or (aget config "layout") "default") "default")
       :archived (if config (if (not= (aget config "archived") js/undefined) (aget config "archived") true) true)})
