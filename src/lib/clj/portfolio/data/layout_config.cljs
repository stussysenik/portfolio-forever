(ns portfolio.data.layout-config
  "Layout configuration — centralized feature flags and design tokens.
   Ported from src/lib/data/layout-config.ts")

(def layout-config
  {:show-wip-banner true
   :wip-banner-position "top"
   :wip-banner-message "WIP — WEBSITE IS UNDER MAINTENANCE"})

(def mobile-design-tokens
  {:hero-name-min-size 40
   :section-padding-mobile 24
   :content-max-width-mobile "100%"
   :valid-spacings [16 24 32 48 64 96 128 192]})