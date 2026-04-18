(ns portfolio.terminal.commands
  "Terminal command registry — ported from TS.
   Simplified for Squint compatibility — uses defn and JS interop directly.")

(defn text [content] #js {:type "text" :content content})
(defn error-msg [msg] (text (str "<span class=\"t-error\">" msg "</span>")))

(def default-fortunes
  ["\"Any sufficiently advanced technology is indistinguishable from magic.\" — Arthur C. Clarke"
   "\"The best way to predict the future is to invent it.\" — Alan Kay"
   "\"Simplicity is the ultimate sophistication.\" — Leonardo da Vinci"
   "\"Talk is cheap. Show me the code.\" — Linus Torvalds"
   "\"Make it work, make it right, make it fast.\" — Kent Beck"
   "\"Design is not just what it looks like. Design is how it works.\" — Steve Jobs"
   "\"In the middle of difficulty lies opportunity.\" — Albert Einstein"])

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
  [{:label "Role" :value "Design Engineer & Creative Producer"}
   {:label "Stack" :value "SvelteKit · TypeScript · AR/XR"}
   {:label "Location" :value "Bed-Stuy, Brooklyn"}
   {:label "Projects" :value "11 live works"}
   {:label "Themes" :value "4 (minimal, studio, terminal, b&w)"}
   {:label "Shell" :value "portfolio-terminal v2.0.0"}])

(def default-skills
  [{:pid "001" :name "TypeScript" :cpu 94 :status "running"}
   {:pid "002" :name "SvelteKit" :cpu 90 :status "running"}
   {:pid "003" :name "React" :cpu 85 :status "running"}
   {:pid "004" :name "AR/XR" :cpu 78 :status "running"}
   {:pid "005" :name "Design Systems" :cpu 88 :status "running"}
   {:pid "006" :name "WebGPU/Three.js" :cpu 72 :status "running"}
   {:pid "007" :name "Zig/WASM" :cpu 65 :status "learning"}
   {:pid "008" :name "Elixir/Phoenix" :cpu 60 :status "learning"}
   {:pid "009" :name "Swift/SwiftUI" :cpu 68 :status "running"}
   {:pid "010" :name "Python/ML" :cpu 70 :status "running"}
   {:pid "011" :name "Rails" :cpu 62 :status "running"}
   {:pid "012" :name "Color Science" :cpu 82 :status "running"}])

(def default-packages
  ["svelte@5.0.0" "sveltekit@2.49.1" "typescript@5.x" "vite@7.2.6"
   "playwright@1.57.0" "tailwind-css@4.x" "three.js@latest"
   "zig@0.13" "elixir@1.17" "phoenix@1.7" "rails@8.1"
   "swift@5.10" "python@3.12" "bun@latest" "node@22"])

(defn pad [s len] (.padEnd (str s) len " "))

(defn fortune-cmd [fortunes]
  (let [f (nth fortunes (js/Math.floor (* (js/Math.random) (count fortunes))))]
    (text (str "\n<span class=\"t-info\">" f "</span>\n"))))

(defn whoami-cmd [output] (text output))

(defn date-cmd [] (text (str "<span class=\"t-info\">" (.toString (js/Date.)) "</span>")))

(defn echo-cmd [args] (text (.join args " ")))

(defn cowsay-cmd [args]
  (let [msg (or (.join args " ") "moo")
        border (apply str (repeat (+ (count msg) 2) "_"))]
    (text (str "<span class=\"t-success\">\n " border "\n< " msg " >\n " (.replace border #"_" "-") "\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||</span>"))))

(defn help-cmd [commands]
  (let [lines (atom [(str "\n<span class=\"t-muted\">── COMMANDS ──</span>")])]
    (doseq [name (js/Object.keys commands)]
      (let [cmd (aget commands name)]
        (swap! lines conj (str "  <span class=\"t-accent\">" (pad name 14) "</span> <span class=\"t-muted\">" (.-desc cmd) "</span>"))))
    (text (.join @lines "\n"))))

(defn create-command-registry [data]
  (let [fortunes (or (:fortunes data) default-fortunes)
        commands (js/Object.create nil)]
    (js/Object.assign commands
      #js {:help #js {:tier 1 :desc "Show available commands" :fn (fn [args state] (help-cmd commands))}
           :clear #js {:tier 1 :desc "Clear the terminal" :fn (fn [args state] (array #js {:type "text" :content "__CLEAR__"}))}
           :whoami #js {:tier 1 :desc "Display current user" :fn (fn [args state] (whoami-cmd (or (:whoami-output data) default-whoami)))}
           :date #js {:tier 1 :desc "Show current date and time" :fn (fn [args state] (date-cmd))}
           :echo #js {:tier 1 :desc "Echo text to terminal" :fn (fn [args state] (echo-cmd args))}
           :fortune #js {:tier 3 :desc "Random wisdom" :fn (fn [args state] (fortune-cmd fortunes))}
           :cowsay #js {:tier 3 :desc "Cow says what?" :fn (fn [args state] (cowsay-cmd args))}})
    #js {:executeCommand (fn [input state]
                            (let [trimmed (.trim input)]
                              (if (empty? trimmed)
                                (array)
                                (do (.push (.-history state) trimmed)
                                    (let [parts (.split trimmed #"\s+")
                                          cmd (aget parts 0)
                                          args (.slice parts 1)]
                                      (if-let [command (aget commands cmd)]
                                        ((.-fn command) args state)
                                        (array (error-msg (str "command not found: " cmd ". Type <span class=\"t-accent\">help</span> for available commands.")))))))))
         :getCommandNames (fn [] (js/Object.keys commands))
         :getCommands (fn [] commands)}))