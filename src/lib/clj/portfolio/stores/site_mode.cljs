(ns portfolio.stores.site-mode
  "Site mode stores — navigation paradigm, feature flags, WIP banner.
   Ported from src/lib/stores/siteMode.ts
   Wraps Svelte stores for Clojure expressiveness while preserving Svelte reactivity."
  (:require [clojure.string :as str]
            ["svelte/store" :as svelte-store]))

(js* "import { goto, browser } from '$lib/app-shims';")

(def writable svelte-store/writable)
(def derived svelte-store/derived)
(def svelte-get svelte-store/get)

(defn deep-freeze [obj]
  (when (and obj (or (instance? js/Object obj) (instance? js/Array obj)))
    (js/Object.freeze obj)
    (let [props (js/Object.getOwnPropertyNames obj)]
      (doseq [prop props]
        (let [val (aget obj prop)]
          (when (and val (or (instance? js/Object val) (instance? js/Array val)) (not (js/Object.isFrozen val)))
            (deep-freeze val))))))
  obj)

(def wip-mode (writable 0))

;; Parametric WIP Configuration - All variables a demanding user might want
(def wip-params
  (writable {:banner-message "WIP — WEBSITE IS UNDER MAINTENANCE"
             :banner-position "top" ; "top" | "bottom" | "sticky"
             :banner-color "red"
             :show-badge true
             :badge-text "BETA"
             :hide-experiments-on-full true
             :block-sensitive-calls-on-preview true}))

(when (js* "browser")
  (let [saved-mode (.getItem js/localStorage "wipMode")]
    (when saved-mode
      (.set wip-mode (js/parseInt saved-mode 10))))
  (.subscribe wip-mode (fn [v] (.setItem js/localStorage "wipMode" (str v)))))

(def effective-wip-config
  (derived
   #js [wip-params wip-mode]
   (fn [vals]
     (let [params (aget vals 0)
           mode (aget vals 1)]
       (deep-freeze
        (js/Object.assign #js {} params #js {:enabled (> mode 0)
                                             :full-block (= mode 2)}))))))

;; Types (informational)
;; SiteMode: "one-page" | "multi-page" | "reader" | "disabled"
;; NavParadigm: "sidebar" | "drawer" | "hybrid"

(def site-mode (writable "multi-page"))

;; Local override for user toggle (r key) independent of admin setting
(def reader-override (writable nil))

;; Effective reader state: override takes precedence over site mode
(def is-reader-mode
  (derived
   #js [site-mode reader-override]
   (fn [vals]
     (let [mode (aget vals 0)
           override (aget vals 1)]
       (or override (= mode "reader"))))))

;; Staged overrides for preview mode
(def staged-overrides (writable #js {}))

;; Site config with overrides
(def base-site-config (writable #js {}))
(def effective-site-config
  (derived
   #js [base-site-config staged-overrides]
   (fn [vals]
     (let [base (aget vals 0)
           overrides (aget vals 1)
           site-patch (or (aget overrides "siteConfig:singleton") #js {})]
       (deep-freeze
        (if base
          (js/Object.assign #js {} base site-patch)
          #js {}))))))

;; Feature flags with overrides
(def base-feature-flags (writable (js/Map.)))
(def effective-feature-flags
  (derived
   #js [base-feature-flags staged-overrides wip-mode]
   (fn [vals]
     (let [base (aget vals 0)
           overrides (aget vals 1)
           wip (aget vals 2)
           result (js/Map. base)]
       ;; Unified WIP control over flags
       (if (> wip 0)
         (.set result "wip-banner" true)
         (.set result "wip-banner" false))
       ;; If WIP mode is 2 (full), we might want to disable experimental features
       (when (= wip 2)
         (.set result "pixel-engine" false))
       result))))

(def nav-paradigm (writable "sidebar"))

(def browser? (js* "browser"))

(when browser?
  (let [saved (.getItem js/localStorage "navParadigm")]
    (when (contains? #{"sidebar" "drawer" "hybrid"} saved)
      (.set nav-paradigm saved)))
  (.subscribe nav-paradigm (fn [v] (.setItem js/localStorage "navParadigm" v))))

;; WIP banner toggle — persisted in localStorage
(def wip-banner-dismissed (writable false))

(when browser?
  (let [saved (.getItem js/localStorage "wipBannerDismissed")]
    (when (= saved "true")
      (.set wip-banner-dismissed true)))
  (.subscribe wip-banner-dismissed (fn [v] (.setItem js/localStorage "wipBannerDismissed" (str v)))))

;; Preview mode: when true, this page is running inside an admin preview iframe.
(def preview-mode (writable false))

(when browser?
  (let [params (js/URLSearchParams. (aget js/window "location" "search"))]
    (when (= (.get params "preview") "true")
      (.set preview-mode true))))

;; Defensive blocker: returns true when Convex/Rust calls should be SUPPRESSED.
(def should-block-calls
  (derived
   #js [preview-mode effective-wip-config]
   (fn [vals]
     (let [preview (aget vals 0)
           wip-config (aget vals 1)]
       (or preview
           (and (aget wip-config "full-block")
                (aget wip-config "block-sensitive-calls-on-preview")))))))

(defn is-feature-enabled? [flags key]
  (if (.has flags key)
    (.get flags key)
    true)) ; default enabled

(defn redirect-if-one-page [section-id]
  (let [mode (svelte-get site-mode)]
    (if (or (= mode "one-page") (= mode "reader"))
      (do
        ((js* "goto") (str "/#" section-id) #js {:replaceState true})
        true)
      false)))
