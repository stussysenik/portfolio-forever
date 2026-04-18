(ns portfolio.sections.terminal
  "Terminal section logic — handles command execution, history, and animations.
   Ported from src/lib/sections/TerminalSection.svelte"
  (:require [portfolio.convex.client :as convex]))

(js* "import { api } from '$lib/app-shims';")

(defn create-terminal-state []
  #js {:history #js []
       :commandHistory #js []
       :historyIndex -1
       :currentInput ""
       :tabSuggestions #js []
       :activeAnimation nil
       :expandedIframes (js/Set.)})

(defn process-output [lines state callbacks]
  "Processes command output lines and updates state."
  (let [new-entries #js []
        on-clear (aget callbacks "onClear")
        on-welcome (aget callbacks "onWelcome")
        on-nav (aget callbacks "onNav")
        on-theme (aget callbacks "onTheme")]
    
    (doseq [line lines]
      (let [type (aget line "type")
            content (aget line "content")]
        (cond
          (= type "text")
          (cond
            (= content "__CLEAR__") (when on-clear (on-clear))
            (= content "__WELCOME__") (when on-welcome (on-welcome))
            (.startsWith content "__NAV__") (when on-nav (on-nav (.replace content "__NAV__" "")))
            (.startsWith content "__THEME__") (when on-theme (on-theme (.replace content "__THEME__" "")))
            :else (.push new-entries #js {:type "output" :content content}))

          (or (= type "iframe") (= type "image"))
          (.push new-entries #js {:type "output" :lines #js [line]})

          (= type "animation")
          (set! (.-activeAnimation state) (aget line "id")))))
    
    (when (> (count new-entries) 0)
      (let [hist (aget state "history")
            updated (.concat hist new-entries)]
        (set! (.-history state) (if (> (count updated) 500)
                                 (.slice updated -500)
                                 updated))))))

(defn setup-terminal-subscriptions [client on-config]
  "Sets up Convex subscription for terminal config."
  (let [api (js* "api")]
    (.onUpdate client (aget api "terminal" "getTerminalConfig") #js {}
               (fn [data] (when on-config (on-config data))))))
