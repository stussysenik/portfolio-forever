(ns portfolio.command-os.parser
  "Local NLP-lite parser for the command palette.
   Ported from src/lib/command-os/parser.ts
   Simplified regex handling for Squint compatibility.")

(def theme-aliases ["minimal" "studio" "terminal" "bw"])

(def preview-aliases
  {"mobile" 390 "phone" 390 "iphone" 390
   "tablet" 768 "ipad" 768
   "desktop" 1440 "laptop" 1440})

(defn parse-locally [input]
  "Parse a natural language command into a structured action map.
   Returns nil if no local match found."
  (let [raw (.trim (or input ""))
        lower (.toLowerCase raw)]
    (cond
      (empty? raw) nil

      (let [m (.match lower (js/RegExp "(?:^|\\b)(?:set|switch|use|change)\\s+theme\\s+(?:to\\s+)?([a-z-]+)$"))]
        (when m
          (let [tid (aget m 1)]
            (if (.includes theme-aliases tid)
              (clj->js {:success true :action "setTheme" :args {:themeId tid}})
              (clj->js {:success false :error (str "unknown theme \"" tid "\"") :suggestions theme-aliases})))))

      (.includes theme-aliases lower) (clj->js {:success true :action "setTheme" :args {:themeId lower}})

      (let [m (.match lower (js/RegExp "^(?:go to|goto|open|nav(?:igate)?\\s+to)\\s+(\\S+)$"))]
        (when m
          (let [p (aget m 1)
                path (if (.startsWith p "/") p (str "/" p))]
            (clj->js {:success true :action "navigateTo" :args {:path path}}))))

      (let [m (.match lower (js/RegExp "^(?:enable|disable|turn\\s+(on|off))\\s+(?:flag\\s+)?([a-z0-9-]+)$"))]
        (when m
          (let [enabled (.test lower (js/RegExp "enable|on"))]
            (clj->js {:success true :action "toggleFlag" :args {:flagId (aget m 2) :enabled enabled}}))))

      (let [m (.match lower (js/RegExp "^(?:enable|disable|show|hide|turn\\s+(on|off))\\s+(?:the\\s+)?wip(?:\\s+badge)?$"))]
        (when m
          (let [visible (.test lower (js/RegExp "^(?:enable|show|turn\\s+on)"))]
            (clj->js {:success true :action "setWipBadge" :args {:visible visible}}))))

      (.test lower (js/RegExp "^(?:save|commit|apply|publish)\\s*(?:changes)?$"))
      (clj->js {:success true :action "commitPending" :args {:confirm true}})

      (let [m (.match lower (js/RegExp "^(?:preview|viewport|breakpoint)\\s+(?:at\\s+)?(\\S+)$"))]
        (when m
          (let [v (aget m 1)
                width (or (get preview-aliases v) (js/parseInt v 10))]
            (if (and (>= width 280) (<= width 3840))
              (clj->js {:success true :action "previewAt" :args {:width width}})
              (clj->js {:success false :error (str "invalid viewport: \"" v "\". Use a number (280-3840) or: mobile, tablet, desktop")})))))

      (let [m (.match lower (js/RegExp "^(?:set\\s+)?font\\s+(?:to\\s+)?([a-z-]+)$"))]
        (when m
          (clj->js {:success true :action "setFont" :args {:fontId (aget m 1)}})))

      :else nil)))