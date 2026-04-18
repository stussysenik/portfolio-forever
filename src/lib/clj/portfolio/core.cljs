(ns portfolio.core
  "Portfolio Forever — Clojure abstraction layer around Svelte 5 + Convex.
   
   This is the entry point that re-exports all Clojure namespaces as a single
   ES module. Squint compiles each namespace to ESM JS, and this file provides
   a unified import surface for Svelte components.
   
   Architecture:
   ┌─────────────────────────────────────────┐
   │              Svelte Components            │
   ├─────────────────────────────────────────┤
   │     Clojure Abstraction Layer (this)     │
   │  data · utils · stores · terminal ·      │
   │  command-os · sections · admin · convex   │
   ├─────────────────────────────────────────┤
   │         Convex Backend (JS API)           │
   └─────────────────────────────────────────┘
   
   The Clojure layer wraps around the JS/TS implementation, providing
   Lisp macros, immutable data, functional composition, and REPL-driven
   development while compiling down to the same JS that Svelte consumes.")

;; Components layer
(require '[portfolio.components.donut :as components-donut])
(require '[portfolio.ui.impeccable :as impeccable])

;; Data layer
(require '[portfolio.data.content :as content])
(require '[portfolio.data.cv :as cv])
(require '[portfolio.data.labs :as labs])
(require '[portfolio.data.layout-config :as layout-config])

;; Utils layer
(require '[portfolio.utils.contrast :as contrast])
(require '[portfolio.utils.scroll-physics :as scroll-physics])
(require '[portfolio.utils.depth-filter :as depth-filter])
(require '[portfolio.utils.social-links :as social-links])
(require '[portfolio.utils.section-typography :as typography])
(require '[portfolio.utils.parse-math :as parse-math])
(require '[portfolio.utils.overlap-detector :as overlap])

;; Stores layer
(require '[portfolio.stores.controls :as controls])
(require '[portfolio.stores.site-mode :as site-mode])
(require '[portfolio.stores.toast :as toast])
(require '[portfolio.stores.staged-flags :as staged-flags])
(require '[portfolio.stores.admin-drafts :as admin-drafts])

;; Terminal subsystem
(require '[portfolio.terminal.commands :as commands])
(require '[portfolio.terminal.filesystem :as filesystem])
(require '[portfolio.terminal.github :as github])

;; Command OS subsystem
(require '[portfolio.command-os.cache :as cache])
(require '[portfolio.command-os.parser :as parser])
(require '[portfolio.command-os.registry :as registry])
(require'[portfolio.command-os.schema :as schema])

;; Sections subsystem
(require '[portfolio.sections.registry :as sections-registry])
(require '[portfolio.sections.index :as sections-index])
(require '[portfolio.sections.hero :as sections-hero])
(require '[portfolio.sections.works :as sections-works])
(require '[portfolio.sections.cv :as sections-cv])
(require '[portfolio.sections.blog :as sections-blog])
(require '[portfolio.sections.talks :as sections-talks])
(require '[portfolio.sections.academia :as sections-academia])
(require '[portfolio.sections.labs :as sections-labs])
(require '[portfolio.sections.gallery :as sections-gallery])
(require '[portfolio.sections.process :as sections-process])
(require '[portfolio.sections.likes :as sections-likes])
(require '[portfolio.sections.gifts :as sections-gifts])
(require '[portfolio.sections.minor :as sections-minor])
(require '[portfolio.sections.os :as sections-os])
(require '[portfolio.sections.terminal :as sections-terminal])

;; Utils
(require '[portfolio.utils.section-typography :as section-typography])
(require '[portfolio.utils.parse-math :as parse-math])

;; Stores
(require '[portfolio.stores.toast :as toast])

;; Admin subsystem
(require '[portfolio.admin.constants :as admin-constants])
(require '[portfolio.admin.staging :as admin-staging])

;; Convex client
(require '[portfolio.convex.client :as convex])