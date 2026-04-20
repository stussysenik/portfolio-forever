(ns portfolio.sections.ascii
  (:require [portfolio.data.content :as data]))

(defn get-ascii-hiccup []
  #js ["section" #js {:class "ascii-diagram-section"}
       #js ["header" #js {:class "section-header"}
            #js ["span" #js {:class "section-marker"} "◆"]
            #js ["h2" #js {:class "section-title"} "SYSTEM TOPOLOGY"]]
       
       #js ["div" #js {:class "ascii-container"}
            #js ["pre" #js {:class "ascii-art"}
                 (str "
    ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
    │     CORE A      │       │     CORE B      │       │     CORE C      │
    │   (Research)    │ ───▶  │  (Implementation)│ ───▶  │   (Deployment)  │
    └────────┬────────┘       └────────┬────────┘       └────────┬────────┘
             │                         │                         │
             ▼                         ▼                         ▼
    ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
    │      EDN        │       │     HICCUP      │       │     SVELTE      │
    │   (Structure)   │ ───▶  │     (View)      │ ───▶  │    (Runtime)    │
    └─────────────────┘       └─────────────────┘       └─────────────────┘
")]]])
