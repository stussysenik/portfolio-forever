(ns portfolio.terminal.commands
  "Terminal command registry — ported from TS."
  (:require [portfolio.terminal.filesystem :as fs]
            [portfolio.terminal.github :as gh]))

(defn text [content] #js {:type "text" :content content})
(defn iframe [url title] #js {:type "iframe" :url url :title title})
(defn animation [id] #js {:type "animation" :id id})
(defn image [src alt] #js {:type "image" :src src :alt alt})
(defn error-msg [msg] (text (str "<span class=\"t-error\">" msg "</span>")))

(defn escape-html [s]
  (-> (str s)
      (.replace #"\&" "&amp;")
      (.replace #"\<" "&lt;")
      (.replace #"\>" "&gt;")
      (.replace #"\"" "&quot;")))

(defn pad [s len] (.padEnd (str s) len " "))

(def default-fortunes
  ["\"Any sufficiently advanced technology is indistinguishable from magic.\" — Arthur C. Clarke"
   "\"The best way to predict the future is to invent it.\" — Alan Kay"
   "\"Simplicity is the ultimate sophistication.\" — Leonardo da Vinci"
   "\"Talk is cheap. Show me the code.\" — Linus Torvalds"
   "\"First, solve the problem. Then, write the code.\" — John Johnson"
   "\"Code is like humor. When you have to explain it, it's bad.\" — Cory House"
   "\"The function of good software is to make the complex appear to be simple.\" — Grady Booch"
   "\"It's not a bug — it's an undocumented feature.\" — Anonymous"
   "\"Debugging is twice as hard as writing the code in the first place.\" — Brian Kernighan"
   "\"The only way to learn a new programming language is by writing programs in it.\" — Dennis Ritchie"
   "\"Design is not just what it looks like. Design is how it works.\" — Steve Jobs"
   "\"In the middle of difficulty lies opportunity.\" — Albert Einstein"
   "\"Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.\" — Antoine de Saint-Exupéry"
   "\"Make it work, make it right, make it fast.\" — Kent Beck"
   "\"The computer was born to solve problems that did not exist before.\" — Bill Gates"])

(defn create-shell-state []
  #js {:cwd "~" :history #js [] :inVim false})

(def default-ascii-logo
  (str "<span class=\"t-accent\">  ███████╗████████╗██╗   ██╗</span>\n"
       "<span class=\"t-accent\">  ██╔════╝╚══██╔══╝██║   ██║</span>\n"
       "<span class=\"t-accent\">  ███████╗   ██║   ██║   ██║</span>\n"
       "<span class=\"t-accent\">  ╚════██║   ██║   ██║   ██║</span>\n"
       "<span class=\"t-accent\">  ███████║   ██║   ╚██████╔╝</span>\n"
       "<span class=\"t-accent\">  ╚══════╝   ╚═╝    ╚═════╝</span>"))

(def default-whoami
  "<span class=\"t-info\">stussysenik</span> <span class=\"t-muted\">— Design Engineer & Creative Producer, Bed-Stuy BK</span>")

(def default-neofetch-fields
  [#js {:label "Role" :value "Design Engineer & Creative Producer"}
   #js {:label "Stack" :value "SvelteKit · TypeScript · AR/XR"}
   #js {:label "Location" :value "Bed-Stuy, Brooklyn"}
   #js {:label "Projects" :value "11 live works"}
   #js {:label "Themes" :value "4 (minimal, studio, terminal, b&w)"}
   #js {:label "Shell" :value "portfolio-terminal v2.0.0"}])

(def default-project-urls
  #js {"ipod" #js {:url "https://ipod-music.vercel.app" :title "iPod Emulator"}
       "ipod-emulator" #js {:url "https://ipod-music.vercel.app" :title "iPod Emulator"}
       "typewriter" #js {:url "https://clean-writer.vercel.app" :title "Typewriter"}
       "checklist" #js {:url "https://infinite-checklist.vercel.app" :title "Infinite Checklist"}
       "physics" #js {:url "https://ph213.vercel.app" :title "PH-213 Physics"}
       "dvd" #js {:url "https://dvd-video-animation.vercel.app" :title "DVD Corner"}
       "radio" #js {:url "https://wavelength-radio.vercel.app" :title "WAVELENGTH RADIO"}
       "wavelength" #js {:url "https://wavelength-radio.vercel.app" :title "WAVELENGTH RADIO"}
       "creative-block" #js {:url "https://creative-block.vercel.app" :title "Creative Block"}
       "spinning-wheel" #js {:url "https://spinning-wheel-filter.vercel.app" :title "Spinning Wheel AR"}
       "bboy" #js {:url "https://bboy-filter.vercel.app" :title "AR B-Boy Filter"}
       "uyr" #js {:url "https://uyr-problem.vercel.app" :title "UYR Problem"}
       "mymind" #js {:url "https://curate-your-own-network.stussysenik.com" :title "mymind.com Clone"}})

(def default-skills
  [#js {:pid "001" :name "TypeScript" :cpu 94 :status "running"}
   #js {:pid "002" :name "SvelteKit" :cpu 90 :status "running"}
   #js {:pid "003" :name "React" :cpu 85 :status "running"}
   #js {:pid "004" :name "AR/XR" :cpu 78 :status "running"}
   #js {:pid "005" :name "Design Systems" :cpu 88 :status "running"}
   #js {:pid "006" :name "WebGPU/Three.js" :cpu 72 :status "running"}
   #js {:pid "007" :name "Zig/WASM" :cpu 65 :status "learning"}
   #js {:pid "008" :name "Elixir/Phoenix" :cpu 60 :status "learning"}
   #js {:pid "009" :name "Swift/SwiftUI" :cpu 68 :status "running"}
   #js {:pid "010" :name "Python/ML" :cpu 70 :status "running"}
   #js {:pid "011" :name "Rails" :cpu 62 :status "running"}
   #js {:pid "012" :name "Color Science" :cpu 82 :status "running"}])

(def default-packages
  ["svelte@5.0.0" "sveltekit@2.49.1" "typescript@5.x" "vite@7.2.6"
   "playwright@1.57.0" "tailwind-css@4.x" "three.js@latest"
   "zig@0.13" "elixir@1.17" "phoenix@1.7" "rails@8.1"
   "swift@5.10" "python@3.12" "bun@latest" "node@22"])

(defn create-command-registry [data]
  (let [fortunes (or (when data (aget data "fortunes")) default-fortunes)
        ascii-logo (or (when data (aget data "asciiLogo")) default-ascii-logo)
        whoami-output (or (when data (aget data "whoamiOutput")) default-whoami)
        neofetch-fields (or (when data (aget data "neofetchFields")) default-neofetch-fields)
        url-map (js/Object.assign #js {} default-project-urls)
        _ (when (and data (aget data "projectUrls"))
            (doseq [p (aget data "projectUrls")]
              (aset url-map (.toLowerCase (aget p "name")) #js {:url (aget p "url") :title (aget p "name")})))
        skills (if (and data (aget data "skills"))
                 (map-indexed (fn [i s]
                                #js {:pid (.padStart (str (+ i 1)) 3 "0")
                                     :name (aget s "name")
                                     :cpu (aget s "proficiency")
                                     :status (if (>= (aget s "proficiency") 70) "running" "learning")})
                              (aget data "skills"))
                 default-skills)
        packages (if (and data (aget data "packages"))
                   (map (fn [p] (str (aget p "name") "@" (aget p "version"))) (aget data "packages"))
                   default-packages)
        commands (js/Object.create nil)]
    
    (js/Object.assign commands
      #js {:help #js {:tier 1 :desc "Show available commands"
                      :fn (fn [args state]
                            (let [lines (atom [])]
                              (doseq [[group cmds] [["UNIX ESSENTIALS" (filter #(<= (aget (aget commands %) "tier") 1) (js/Object.keys commands))]
                                                    ["DEV SHOWCASE" (filter #(= (aget (aget commands %) "tier") 2) (js/Object.keys commands))]
                                                    ["EASTER EGGS" (filter #(= (aget (aget commands %) "tier") 3) (js/Object.keys commands))]]]
                                (swap! lines conj (str "\n<span class=\"t-muted\">── " group " ──</span>"))
                                (doseq [name cmds]
                                  (let [cmd (aget commands name)]
                                    (swap! lines conj (str "  <span class=\"t-accent\">" (pad name 14) "</span> <span class=\"t-muted\">" (aget cmd "desc") "</span>")))))
                              #js [(text (.join (into-array @lines) "\n"))]))}
           
           :clear #js {:tier 1 :desc "Clear the terminal"
                       :fn (fn [args state] #js [(text "__CLEAR__")])}
           
           :ls #js {:tier 1 :desc "List directory contents"
                    :fn (fn [args state]
                          (let [detailed (or (.includes args "-la") (.includes args "-l") (.includes args "-al"))
                                target (or (first (filter #(not (.startsWith % "-")) args)) ".")
                                res (fs/resolve-path (aget state "cwd") target)
                                node (aget res "node")]
                            (if (or (not node) (not= (aget node "type") "dir"))
                              #js [(error-msg (str "ls: cannot access '" target "': No such directory"))]
                              (let [entries (fs/list-dir node)]
                                (if detailed
                                  (let [lines (map (fn [e]
                                                     (let [perm (if (aget e "isDir") "drwxr-xr-x" "-rw-r--r--")
                                                           cls (if (aget e "isDir") "t-accent" "t-muted")
                                                           suffix (if (aget e "isDir") "/" "")]
                                                       (str perm "  " (pad (or (aget e "size") "—") 6) " " (pad (or (aget e "modified") "—") 10) " <span class=\"" cls "\">" (aget e "name") suffix "</span>")))
                                                   entries)]
                                    #js [(text (.join (into-array lines) "\n"))])
                                  (let [items (map (fn [e]
                                                     (let [cls (if (aget e "isDir") "t-accent" "t-muted")
                                                           suffix (if (aget e "isDir") "/" "")]
                                                       (str "<span class=\"" cls "\">" (aget e "name") suffix "</span>")))
                                                   entries)]
                                    #js [(text (.join (into-array items) "    "))]))))))}
           
           :cd #js {:tier 1 :desc "Change directory"
                    :fn (fn [args state]
                          (let [target (or (aget args 0) "~")
                                res (fs/resolve-path (aget state "cwd") target)
                                node (aget res "node")]
                            (cond
                              (not node) #js [(error-msg (str "cd: no such directory: " target))]
                              (not= (aget node "type") "dir") #js [(error-msg (str "cd: not a directory: " target))]
                              :else (do (aset state "cwd" (aget res "resolvedPath")) #js []))))}
           
           :pwd #js {:tier 1 :desc "Print working directory"
                     :fn (fn [args state] #js [(text (.replace (.replace (str "<span class=\"t-accent\">/home/stussysenik/" (.replace (aget state "cwd") "~" "") "</span>") #"/+$" "") #"//+" "/"))])}
           
           :tree #js {:tier 1 :desc "Show directory tree"
                      :fn (fn [args state]
                            (let [target (or (aget args 0) ".")
                                  res (fs/resolve-path (aget state "cwd") target)
                                  node (aget res "node")]
                              (if (or (not node) (not= (aget node "type") "dir"))
                                #js [(error-msg (str "tree: '" target "' is not a directory"))]
                                (let [header (str "<span class=\"t-accent\">" (aget res "resolvedPath") "/</span>")]
                                  #js [(text (str header "\n" (fs/build-tree node)))]))))}
           
           :cat #js {:tier 1 :desc "Read file contents"
                     :fn (fn [args state]
                           (if (not (aget args 0))
                             #js [(error-msg "cat: missing file operand")]
                             (let [res (fs/resolve-path (aget state "cwd") (aget args 0))
                                   node (aget res "node")]
                               (cond
                                 (not node) #js [(error-msg (str "cat: " (aget args 0) ": No such file or directory"))]
                                 (= (aget node "type") "dir") #js [(error-msg (str "cat: " (aget args 0) ": Is a directory"))]
                                 (= (aget args 0) "cv.pdf") #js [(text (aget node "content")) (text "__NAV__/cv")]
                                 :else #js [(text (aget node "content"))]))))}
           
           :whoami #js {:tier 1 :desc "Display current user"
                        :fn (fn [args state] #js [(text whoami-output)])}
           
           :echo #js {:tier 1 :desc "Echo text to terminal"
                      :fn (fn [args state] #js [(text (escape-html (.join args " ")))])}
           
           :date #js {:tier 1 :desc "Show current date and time"
                      :fn (fn [args state] #js [(text (str "<span class=\"t-info\">" (.toString (js/Date.)) "</span>"))])}
           
           :history #js {:tier 1 :desc "Show command history"
                         :fn (fn [args state]
                               (if (= 0 (count (aget state "history")))
                                 #js [(text "<span class=\"t-muted\">No commands in history.</span>")]
                                 (let [lines (map-indexed (fn [i cmd] (str "  <span class=\"t-muted\">" (.padStart (str (+ i 1)) 4 " ") "</span>  " cmd)) (aget state "history"))]
                                   #js [(text (.join (into-array lines) "\n"))])))}
           
           :neofetch #js {:tier 2 :desc "System information"
                          :fn (fn [args state]
                                (let [uptime-days (js/Math.floor (/ (- (.getTime (js/Date.)) (.getTime (js/Date. "2026-01-01"))) 86400000))
                                      info (atom [(str "<span class=\"t-info\">stussysenik</span><span class=\"t-muted\">@</span><span class=\"t-info\">portfolio</span>")
                                                  (str "<span class=\"t-muted\">─────────────────────</span>")])
                                      _ (doseq [f neofetch-fields]
                                          (swap! info conj (str "<span class=\"t-accent\">" (pad (aget f "label") 9) "</span> <span class=\"t-muted\">" (aget f "value") "</span>")))
                                      _ (swap! info concat [(str "<span class=\"t-accent\">" (pad "Uptime" 9) "</span> <span class=\"t-muted\">" uptime-days " days (since Jan 2026)</span>")
                                                            (str "<span class=\"t-accent\">" (pad "Repos" 9) "</span> <span class=\"t-muted\">" (:public-repos gh/github-profile) " public</span>")
                                                            ""
                                                            "<span style=\"background:#f7768e;color:#f7768e;\">██</span><span style=\"background:#e0af68;color:#e0af68;\">██</span><span style=\"background:#9ece6a;color:#9ece6a;\">██</span><span style=\"background:#2ac3de;color:#2ac3de;\">██</span><span style=\"background:#7aa2f7;color:#7aa2f7;\">██</span><span style=\"background:#bb9af7;color:#bb9af7;\">██</span>"])
                                      logo-lines (.split ascii-logo "\n")
                                      combined (atom [])]
                                  (doseq [i (range (max (count logo-lines) (count @info)))]
                                    (let [line (if (< i (count logo-lines)) (aget logo-lines i) (pad "" 30))
                                          info-line (if (< i (count @info)) (nth @info i) "")]
                                      (swap! combined conj (str line "    " info-line))))
                                  #js [(text (str "\n" (.join (into-array @combined) "\n") "\n"))]))}
           
           :gh #js {:tier 2 :desc "GitHub CLI (repos, stats)"
                    :fn (fn [args state]
                          (let [sub (aget args 0)]
                            (cond
                              (= sub "repos")
                              (let [header (str "<span class=\"t-muted\">" (pad "REPO" 24) " " (pad "LANG" 12) " DESCRIPTION</span>")
                                    divider (str "<span class=\"t-muted\">" (.repeat "─" 72) "</span>")
                                    lines (map (fn [r]
                                                 (let [color (or (get gh/lang-colors (:language r)) "#888")
                                                       lang (str "<span style=\"color:" color "\">●</span> " (pad (:language r) 10))]
                                                   (str "<span class=\"t-accent\">" (pad (:name r) 24) "</span> " lang " <span class=\"t-muted\">" (:description r) "</span>")))
                                               gh/repos)]
                                #js [(text (.join (into-array (concat [header divider] lines)) "\n"))])
                              
                              (= sub "stats")
                              (let [langs (reduce (fn [acc r] (assoc acc (:language r) (inc (or (get acc (:language r)) 0)))) {} gh/repos)
                                    lang-lines (map (fn [[lang count]]
                                                      (let [color (or (get gh/lang-colors lang) "#888")
                                                            bar (str (.repeat "█" (* count 3)) (.repeat "░" (max 0 (- 15 (* count 3)))))]
                                                        (str "  <span style=\"color:" color "\">●</span> " (pad lang 14) " " bar " " count)))
                                                    (sort-by val > langs))]
                                #js [(text (.join (into-array (concat [(str "<span class=\"t-info\">" (:username gh/github-profile) "</span> <span class=\"t-muted\">— " (:bio gh/github-profile) "</span>")
                                                                       ""
                                                                       (str "<span class=\"t-accent\">Public repos:</span>  " (:public-repos gh/github-profile))
                                                                       (str "<span class=\"t-accent\">Location:</span>      " (:location gh/github-profile))
                                                                       (str "<span class=\"t-accent\">Website:</span>       " (:website gh/github-profile))
                                                                       ""
                                                                       "<span class=\"t-muted\">── LANGUAGES ──</span>"]
                                                                      lang-lines)) "\n"))])
                              :else #js [(text "<span class=\"t-muted\">Usage: gh repos | gh stats</span>")])))}
           
           :git #js {:tier 2 :desc "Show portfolio git log"
                     :fn (fn [args state]
                           (if (not= (aget args 0) "log")
                             #js [(text "<span class=\"t-muted\">Usage: git log</span>")]
                             (let [commits [{:hash "bbd958e" :msg "feat: 4-theme system, camera framing, footer BedStuy" :date "2026-03-28"}
                                            {:hash "287c38d" :msg "feat: terminal default theme, works simplification" :date "2026-03-27"}
                                            {:hash "ea355fa" :msg "docs: add badge bar and centered header to README" :date "2026-03-26"}
                                            {:hash "ec83993" :msg "docs: update README, DOCS, PROGRESS for spacing" :date "2026-03-25"}
                                            {:hash "0c5d11b" :msg "test: 317 Playwright tests — mobile works suite" :date "2026-03-24"}
                                            {:hash "8148cf4" :msg "feat: colored highlight backgrounds on homepage" :date "2026-03-23"}
                                            {:hash "cd98983" :msg "fix: nav polish — unified @ dropdown, email blue" :date "2026-03-22"}
                                            {:hash "c8b9a60" :msg "fix: scroll to top on /works page load" :date "2026-03-21"}]
                                   lines (map #(str "<span class=\"t-warning\">" (:hash %) "</span> <span class=\"t-muted\">(" (:date %) ")</span> " (:msg %)) commits)]
                               #js [(text (.join (into-array lines) "\n"))])))}
           
           :top #js {:tier 2 :desc "Skills as running processes"
                     :fn (fn [args state]
                           (let [header (str "<span class=\"t-muted\">" (pad "PID" 6) " " (pad "SKILL" 18) " " (pad "CPU%" 6) " " (pad "BAR" 20) " STATUS</span>")
                                 divider (str "<span class=\"t-muted\">" (.repeat "─" 65) "</span>")
                                 lines (map (fn [s]
                                              (let [filled (js/Math.round (/ (aget s "cpu") 5))
                                                    bar (str "<span class=\"t-accent\">" (.repeat "█" filled) "</span><span class=\"t-muted\">" (.repeat "░" (- 20 filled)) "</span>")
                                                    status-cls (if (= (aget s "status") "running") "t-success" "t-warning")]
                                                (str (pad (aget s "pid") 6) " <span class=\"t-info\">" (pad (aget s "name") 18) "</span> " (pad (str (aget s "cpu") "%") 6) " " bar " <span class=\"" status-cls "\">" (aget s "status") "</span>")))
                                            skills)]
                             #js [(text (.join (into-array (concat ["<span class=\"t-info\">top</span> <span class=\"t-muted\">— skill proficiency monitor</span>" "" header divider] lines)) "\n"))]))}
           
           :brew #js {:tier 2 :desc "Tech stack as packages"
                      :fn (fn [args state]
                            (if (and (> (count args) 0) (not= (aget args 0) "list"))
                              #js [(text "<span class=\"t-muted\">Usage: brew list</span>")]
                              (let [cols 3
                                    col-width 22
                                    rows (atom [])]
                                (loop [i 0]
                                  (when (< i (count packages))
                                    (let [slice (take cols (drop i packages))
                                          row (.join (into-array (map #(str "<span class=\"t-accent\">" (pad % col-width) "</span>") slice)) "")]
                                      (swap! rows conj row)
                                      (recur (+ i cols)))))
                                #js [(text (.join (into-array (concat [(str "<span class=\"t-muted\">" (count packages) " packages installed:</span>") ""] @rows)) "\n"))])))}
           
           :open #js {:tier 2 :desc "Open a project in browser"
                      :fn (fn [args state]
                            (if (not (aget args 0))
                              #js [(text "<span class=\"t-muted\">Usage: open &lt;project-name&gt; or open &lt;url&gt;</span>")]
                              (let [target (.toLowerCase (aget args 0))
                                    match (aget url-map target)]
                                (cond
                                  match #js [(text (str "<span class=\"t-muted\">Opening <span class=\"t-accent\">" (aget match "title") "</span>...</span>")) (iframe (aget match "url") (aget match "title"))]
                                  (.startsWith target "http") #js [(text (str "<span class=\"t-muted\">Opening <span class=\"t-accent\">" (aget args 0) "</span>...</span>")) (iframe (aget args 0) (aget args 0))]
                                  ((set ["works" "cv" "talks" "likes" "blog" "gifts" "process" "terminal"]) target) #js [(text (str "__NAV__/" target))]
                                  :else #js [(error-msg (str "open: '" target "' not found. Try: " (.join (.slice (js/Object.keys url-map) 0 5) ", ") "..."))]))))}
           
           :browse #js {:tier 2 :desc "Browse a URL in terminal"
                        :fn (fn [args state] (if (not (aget args 0)) #js [(text "<span class=\"t-muted\">Usage: browse &lt;url&gt; or browse &lt;project&gt;</span>")] ((aget (aget commands "open") "fn") args state)))}
           
           :wget #js {:tier 2 :desc "Download page info"
                      :fn (fn [args state]
                            (if (not (aget args 0))
                              #js [(text "<span class=\"t-muted\">Usage: wget &lt;url&gt;</span>")]
                              (let [url (aget args 0)
                                    timestamp (.toISOString (js/Date.))]
                                #js [(text (.join (into-array [(str "<span class=\"t-muted\">--" timestamp "--</span>")
                                                               (str "<span class=\"t-muted\">Resolving " url "...</span> <span class=\"t-success\">connected.</span>")
                                                               "<span class=\"t-muted\">HTTP request sent, awaiting response...</span> <span class=\"t-success\">200 OK</span>"
                                                               "<span class=\"t-muted\">Length:</span> <span class=\"t-info\">unspecified</span> <span class=\"t-muted\">[text/html]</span>"
                                                               "<span class=\"t-muted\">Saving to:</span> <span class=\"t-accent\">'index.html'</span>"
                                                               ""
                                                               "<span class=\"t-success\">index.html saved.</span> <span class=\"t-muted\">(portfolio terminal doesn't actually download files)</span>"
                                                               ""
                                                               (str "<span class=\"t-muted\">Try:</span> <span class=\"t-accent\">open " url "</span> <span class=\"t-muted\">to view it inline instead.</span>")]) "\n"))])))}
           
           :img #js {:tier 2 :desc "Display an image inline"
                     :fn (fn [args state]
                           (if (not (aget args 0))
                             #js [(text "<span class=\"t-muted\">Usage: img &lt;path&gt;</span>")]
                             (let [image-map {"logo.png" "/favicon.png" "preview.png" "/previews/curate-your-own-network.png"}
                                   src (or (get image-map (aget args 0)) (aget args 0))]
                               #js [(image src (aget args 0))])))}
           
           :matrix #js {:tier 3 :desc "Enter the Matrix"
                        :fn (fn [args state] #js [(animation "matrix")])}
           
           :cowsay #js {:tier 3 :desc "Cow says what?"
                        :fn (fn [args state]
                              (let [msg (if (> (count args) 0) (.join args " ") "moo")
                                    border (.repeat "_" (+ (count msg) 2))
                                    cow (str "\n " border "\n< " msg " >\n " (.repeat "-" (+ (count msg) 2)) "\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||")]
                                #js [(text (str "<span class=\"t-success\">" cow "</span>"))]))}
           
           :fortune #js {:tier 3 :desc "Random wisdom"
                         :fn (fn [args state]
                               (let [f (nth fortunes (js/Math.floor (* (js/Math.random) (count fortunes))))]
                                 #js [(text (str "\n<span class=\"t-info\">" f "</span>\n"))]))}
           
           :sudo #js {:tier 3 :desc "Superuser do"
                      :fn (fn [args state] #js [(text "<span class=\"t-error\">Permission denied.</span> <span class=\"t-muted\">Nice try. 🔒</span>")])}
           
           :vim #js {:tier 3 :desc "Open vim"
                     :fn (fn [args state]
                           (aset state "inVim" true)
                           #js [(text "<span class=\"t-warning\">You're now stuck in vim.</span>\n<span class=\"t-muted\">Type</span> <span class=\"t-accent\">:q!</span> <span class=\"t-muted\">to escape (if you can).</span>\n\n<span class=\"t-muted\">~\n~\n~\n~\n-- INSERT --</span>")])}
           
           :pipes #js {:tier 3 :desc "Pipes screensaver"
                       :fn (fn [args state] #js [(animation "pipes")])}
           
           :sl #js {:tier 3 :desc "Steam locomotive"
                    :fn (fn [args state]
                          (let [train "<span class=\"t-muted\">      ====        ________                ___________\n  _D _|  |_______/        \\__I_I_____===__|___________|\n   |(_)---  |   H\\________/ |   |        =|___ ___|\n   /     |  |   H  |  |     |   |         ||_| |_||\n  |      |  |   H  |__--------------------| [___] |\n  | ________|___H__/__|_____/[][]~\\_______|       |\n  |/ |   |-----------I_____I [][] []  D   |=======|__\n__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__\n |/-=|___|=    ||    ||    ||    |_____/~\\___/\n  \\_/      \\O=====O=====O=====O_/      \\_/</span>"]
                            #js [(text train)]))}
           
           :theme #js {:tier 3 :desc "Switch theme"
                       :fn (fn [args state]
                             (let [valid (set ["minimal" "studio" "terminal" "bw"])]
                               (if (or (not (aget args 0)) (not (valid (aget args 0))))
                                 #js [(text "<span class=\"t-muted\">Usage: theme &lt;minimal|studio|terminal|bw&gt;</span>")]
                                 #js [(text (str "__THEME__" (aget args 0)))])))}
           
           :welcome #js {:tier 3 :desc "Show welcome message"
                         :fn (fn [args state] #js [(text "__WELCOME__")])}
           
           :rm #js {:tier 3 :desc "Remove files"
                    :fn (fn [args state]
                          (if (and (.includes args "-rf") (.includes args "/"))
                            #js [(text "<span class=\"t-error\">Nice try.</span> <span class=\"t-muted\">This portfolio is production. 🏗️</span>")]
                            #js [(text "<span class=\"t-error\">rm: operation not permitted in portfolio terminal</span>")]))}
           
           :exit #js {:tier 3 :desc "Exit terminal"
                      :fn (fn [args state] #js [(text "<span class=\"t-muted\">There is no escape. You live here now.</span>\n<span class=\"t-muted\">Try</span> <span class=\"t-accent\">open works</span> <span class=\"t-muted\">to explore projects instead.</span>")])}
           
           :ssh #js {:tier 3 :desc "Connect via SSH"
                     :fn (fn [args state]
                           (let [host (or (aget args 0) "stussysenik.com")]
                             #js [(text (str "<span class=\"t-muted\">ssh: connect to host</span> <span class=\"t-accent\">" host "</span> <span class=\"t-muted\">port 22</span>\n<span class=\"t-success\">Connection established.</span>\n<span class=\"t-muted\">Welcome to stussysenik's portfolio server.</span>\n<span class=\"t-muted\">Last login: " (.toLocaleDateString (js/Date.)) " from 127.0.0.1</span>"))]))}
           
           :man #js {:tier 3 :desc "Manual pages"
                     :fn (fn [args state]
                           (if (not (aget args 0))
                             #js [(text "<span class=\"t-muted\">What manual page do you want?\nUsage: man &lt;command&gt;</span>")]
                             (let [cmd (aget commands (aget args 0))]
                               (if (not cmd)
                                 #js [(error-msg (str "No manual entry for " (aget args 0)))]
                                 #js [(text (str "<span class=\"t-info\">" (.toUpperCase (aget args 0)) "(1)</span>                    <span class=\"t-muted\">Portfolio Terminal Manual</span>\n\n<span class=\"t-accent\">NAME</span>\n       " (aget args 0) " — " (aget cmd "desc") "\n\n<span class=\"t-accent\">SYNOPSIS</span>\n       <span class=\"t-info\">" (aget args 0) "</span> [options] [arguments]\n\n<span class=\"t-accent\">DESCRIPTION</span>\n       Part of the portfolio terminal, tier " (aget cmd "tier") ".\n       Type <span class=\"t-accent\">help</span> for all available commands."))]))))}
           
           :curl #js {:tier 3 :desc "Fetch data"
                      :fn (fn [args state]
                            (if (not (aget args 0))
                              #js [(text "<span class=\"t-muted\">Usage: curl &lt;url&gt;</span>")]
                              #js [(text "<span class=\"t-muted\">  % Total    % Received</span>\n<span class=\"t-muted\">  100   256    100   256    0     0   1024      0 --:--:-- --:--:--</span>\n\n{\n  <span class=\"t-accent\">\"name\"</span>: <span class=\"t-success\">\"Stüssy Senik\"</span>,\n  <span class=\"t-accent\">\"role\"</span>: <span class=\"t-success\">\"Design Engineer & Creative Producer\"</span>,\n  <span class=\"t-accent\">\"location\"</span>: <span class=\"t-success\">\"Bed-Stuy, Brooklyn\"</span>,\n  <span class=\"t-accent\">\"status\"</span>: <span class=\"t-success\">\"available\"</span>,\n  <span class=\"t-accent\">\"repos\"</span>: <span class=\"t-warning\">54</span>,\n  <span class=\"t-accent\">\"vibes\"</span>: <span class=\"t-success\">\"immaculate\"</span>\n}")]))}})
    
    #js {:executeCommand (fn [input state]
                           (let [trimmed (.trim input)]
                             (if (= trimmed "")
                               #js []
                               (do
                                 (.push (aget state "history") trimmed)
                                 (if (aget state "inVim")
                                   (if (or (= trimmed ":q!") (= trimmed ":q") (= trimmed ":wq"))
                                     (do (aset state "inVim" false) #js [(text "<span class=\"t-success\">Escaped vim. You're free.</span>")])
                                     #js [(text "<span class=\"t-muted\">-- INSERT -- (type :q! to exit)</span>")])
                                   (let [parts (.split trimmed #"\s+")
                                         cmd-name (aget parts 0)
                                         args (.slice parts 1)
                                         command (aget commands cmd-name)]
                                     (if (not command)
                                       #js [(error-msg (str "command not found: " cmd-name ". Type <span class=\"t-accent\">help</span> for available commands."))]
                                       ((aget command "fn") args state))))))))
         :getCommandNames (fn [] (js/Object.keys commands))
         :getCommands (fn [] commands)
         :getCompletions (fn [input state]
                           (let [parts (.split input #"\s+")]
                             (if (<= (count parts) 1)
                               (let [prefix (or (aget parts 0) "")]
                                 (.filter (js/Object.keys commands) #(.startsWith % prefix)))
                               (let [partial (or (aget parts (- (count parts) 1)) "")
                                     last-slash (.lastIndexOf partial "/")
                                     dir-path (if (>= last-slash 0) (or (.substring partial 0 last-slash) ".") ".")
                                     prefix (if (>= last-slash 0) (.substring partial (+ last-slash 1)) partial)
                                     res (fs/resolve-path (aget state "cwd") dir-path)
                                     node (aget res "node")]
                                 (if (or (not node) (not= (aget node "type") "dir"))
                                   #js []
                                   (let [matches (filter #(.startsWith % prefix) (js/Object.keys (aget node "children")))
                                         mapped (map (fn [name]
                                                       (let [child (aget (aget node "children") name)
                                                             base (if (>= last-slash 0) (str dir-path "/" name) name)]
                                                         (if (= (aget child "type") "dir") (str base "/") base)))
                                                     matches)]
                                     (.slice (into-array mapped) 0 20)))))))}))

(def default-registry (create-command-registry nil))

(defn get-commands [] ((aget default-registry "getCommands")))
(defn execute-command [input state] ((aget default-registry "executeCommand") input state))
(defn get-command-names [] ((aget default-registry "getCommandNames")))
(defn get-completions [input state] ((aget default-registry "getCompletions") input state))