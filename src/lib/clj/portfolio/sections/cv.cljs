(ns portfolio.sections.cv
  "CV section logic — handles Convex subscriptions and timeline transformations.
   Ported from src/lib/sections/CvSection.svelte"
  (:require [portfolio.convex.client :as convex]
            [portfolio.data.cv :as cv]))

(js* "import { api } from '$lib/app-shims';")

(defn format-date-range [start end]
  "Formats a date range string."
  (let [fmt (fn [d]
              (if (or (nil? d) (= d "present"))
                "Present"
                (let [date (js/Date. d)]
                  (.toLocaleDateString date "en-US" #js {:year "numeric" :month "short"}))))]
    (str (fmt start) " — " (fmt end))))

(defn get-cv-hiccup [is-screen-pass]
  "Returns the CV section as a Hiccup-like structure (data as code)."
  (let [profile cv/cv-data
        work (:workExperience profile)
        edu (:education profile)
        awards (:awards profile)
        langs (:languages profile)
        skills (:knowsAbout profile)]
    #js [:section {:class "cv-wrapper"}
         [:header {:class "cv-header"}
          [:h1 {:class "cv-name"} (:name profile)]
          [:p {:class "cv-title"} (:jobTitle profile)]
          [:p {:class "cv-summary"} (:summary profile)]
          [:div {:class "cv-meta"}
           [:span {:class "cv-meta-item"} (:location profile)]
           [:span {:class "cv-meta-item"} [:a {:href (str "mailto:" (:email profile))} (:email profile)]]
           [:span {:class "cv-meta-item"} [:a {:href (:url profile) :target "_blank"} (:url profile)]]]]

         ;; Experience
         [:div {:class "cv-section"}
          [:h2 {:class "cv-section-title"} "Experience"]
          (into [:div {:class "cv-entries"}]
                (map (fn [entry]
                       [:div {:class "cv-entry"}
                        [:div {:class "cv-entry-header"}
                         [:h3 {:class "cv-entry-title"}
                          (if (:url entry)
                            [:a {:href (:url entry) :target "_blank"} (:title entry)]
                            (:title entry))]
                         [:span {:class "cv-entry-dates"} (format-date-range (:startDate entry) (:endDate entry))]]
                        [:div {:class "cv-entry-org"}
                         [:span (:organization entry)]
                         (when (:location entry) [:span {:class "cv-entry-location"} (:location entry)])]
                        (when (not is-screen-pass)
                          [:div
                           [:p {:class "cv-entry-description"} (:description entry)]
                           (when (seq (:highlights entry))
                             (into [:ul {:class "cv-entry-highlights"}]
                                   (map (fn [hl] [:li hl]) (:highlights entry))))])])
                     work))]

         ;; Education
         [:div {:class "cv-section"}
          [:h2 {:class "cv-section-title"} "Education"]
          (into [:div {:class "cv-entries"}]
                (map (fn [entry]
                       [:div {:class "cv-entry"}
                        [:div {:class "cv-entry-header"}
                         [:h3 {:class "cv-entry-title"} (:title entry)]
                         [:span {:class "cv-entry-dates"} (format-date-range (:startDate entry) (:endDate entry))]]
                        [:div {:class "cv-entry-org"}
                         [:span (:organization entry)]]])
                     edu))]

         ;; Languages
         [:div {:class "cv-section"}
          [:h2 {:class "cv-section-title"} "Languages"]
          (into [:div {:class "cv-languages"}]
                (map (fn [lang]
                       [:span {:class "cv-lang"} (:name lang) " " [:span {:class "cv-lang-level"} (str "(" (:level lang) ")")]])
                     langs))]

         ;; Skills
         [:div {:class "cv-section"}
          [:h2 {:class "cv-section-title"} "Skills"]
          (into [:div {:class "cv-skills"}]
                (map (fn [skill] [:span {:class "cv-skill-tag"} (:name skill)])
                     skills))]]))

(defn setup-cv-subscriptions [client on-data]
  "Sets up Convex subscription for the CV section."
  (let [api (js* "api")]
    (.onUpdate client (aget api "cv" "getVisibleCV") #js {}
               (fn [data] (when on-data (on-data data))))))

