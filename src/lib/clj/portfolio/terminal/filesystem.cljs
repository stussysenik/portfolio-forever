(ns portfolio.terminal.filesystem
  "Virtual filesystem — maps the portfolio as a Unix directory tree.")

(def filesystem
  #js {:type "dir"
       :children #js {:about.txt #js {:type "file"
                                      :size "0.4K"
                                      :modified "Jan 2026"
                                      :content (str "<span class=\"t-info\">Stüssy Senik</span>\n"
                                                    "<span class=\"t-muted\">Design Engineer & Creative Producer</span>\n\n"
                                                    "Building at the intersection of science, design,\n"
                                                    "cinema, computation and code.\n\n"
                                                    "Based in <span class=\"t-accent\">Bed-Stuy, Brooklyn</span>.\n"
                                                    "Vibe-coding since 2017.")}
                      :contact.nfo #js {:type "file"
                                        :size "0.2K"
                                        :modified "Jan 2026"
                                        :content (str "<span class=\"t-accent\">GitHub</span>    github.com/stussysenik\n"
                                                      "<span class=\"t-accent\">Email</span>     itsmxzou@gmail.com\n"
                                                      "<span class=\"t-accent\">Web</span>       stussysenik.com\n"
                                                      "<span class=\"t-accent\">Location</span>  NYC / Prague")}
                      :resume.txt #js {:type "file"
                                       :size "2.1K"
                                       :modified "Mar 2026"
                                       :content (str "<span class=\"t-info\">══════════════════════════════════════</span>\n"
                                                     "<span class=\"t-info\">  STÜSSY SENIK — Creative Technologist</span>\n"
                                                     "<span class=\"t-info\">══════════════════════════════════════</span>\n\n"
                                                     "<span class=\"t-accent\">FOCUS</span>\n"
                                                     "  DevEx & Experience Design Engineering\n"
                                                     "  クリエイティブ・テクノロジスト\n\n"
                                                     "<span class=\"t-accent\">STACK</span>\n"
                                                     "  TypeScript · SvelteKit · React · Svelte 5\n"
                                                     "  AR/XR · WebGPU · Three.js · Zig · WASM\n"
                                                     "  Elixir/Phoenix · Rails · Swift · Python\n\n"
                                                     "<span class=\"t-accent\">HIGHLIGHTS</span>\n"
                                                     "  ▸ 54 public repositories on GitHub\n"
                                                     "  ▸ AI terminal tools (gemini-cli)\n"
                                                     "  ▸ Background agents coding system\n"
                                                     "  ▸ WebGL video-to-ASCII converter\n"
                                                     "  ▸ Zig + WebGPU pixel-scene showcase\n"
                                                     "  ▸ AR/XR filters and interactive experiences\n"
                                                     "  ▸ Physics visualizations & simulations\n\n"
                                                     "<span class=\"t-accent\">EDUCATION</span>\n"
                                                     "  ▸ Physics (PH-213 + computational)\n"
                                                     "  ▸ Self-directed CS + design\n\n"
                                                     "<span class=\"t-muted\">Type 'cat cv.pdf' for the full CV page.</span>")}
                      :cv.pdf #js {:type "file"
                                   :size "4.2K"
                                   :modified "Mar 2026"
                                   :content (str "<span class=\"t-muted\">Binary file — opening in browser...</span>\n"
                                                 "<span class=\"t-accent\">→ /cv</span>")}
                      :works #js {:type "dir"
                                  :modified "Mar 2026"
                                  :children #js {:ipod-emulator #js {:type "dir"
                                                                     :children #js {:README.md #js {:type "file" :size "0.3K" :modified "Feb 2026" :content (str "<span class=\"t-info\">iPod Emulator</span>\n<span class=\"t-muted\">Category: tool</span>\n<span class=\"t-accent\">URL:</span> https://ipod-music.vercel.app\nA faithful recreation of the classic iPod interface.")}}}
                                                 :typewriter #js {:type "dir"
                                                                  :children #js {:README.md #js {:type "file" :size "0.2K" :modified "Feb 2026" :content (str "<span class=\"t-info\">Typewriter</span>\n<span class=\"t-muted\">Category: tool</span>\n<span class=\"t-accent\">URL:</span> https://clean-writer.vercel.app\nA clean, distraction-free writing tool.")}}}
                                                 :checklist #js {:type "dir"
                                                                 :children #js {:README.md #js {:type "file" :size "0.2K" :modified "Feb 2026" :content (str "<span class=\"t-info\">Infinite Checklist</span>\n<span class=\"t-muted\">Category: tool</span>\n<span class=\"t-accent\">URL:</span> https://infinite-checklist.vercel.app\nA recursive checklist that goes as deep as you need.")}}}
                                                 :physics #js {:type "dir"
                                                               :children #js {:README.md #js {:type "file" :size "0.3K" :modified "Feb 2026" :content (str "<span class=\"t-info\">PH-213 Physics</span>\n<span class=\"t-muted\">Category: science</span>\n<span class=\"t-accent\">URL:</span> https://ph213.vercel.app\nInteractive physics visualizations — waves, electrostatics, circuits.")}}}
                                                 :dvd-corner #js {:type "dir"
                                                                  :children #js {:README.md #js {:type "file" :size "0.1K" :modified "Jan 2026" :content (str "<span class=\"t-info\">DVD Corner</span>\n<span class=\"t-muted\">Category: art</span>\n<span class=\"t-accent\">URL:</span> https://dvd-video-animation.vercel.app\nWill it hit the corner? Classic DVD screensaver.")}}}
                                                 :wavelength-radio #js {:type "dir"
                                                                        :children #js {:README.md #js {:type "file" :size "0.2K" :modified "Jan 2026" :content (str "<span class=\"t-info\">WAVELENGTH RADIO</span>\n<span class=\"t-muted\">Category: music</span>\n<span class=\"t-accent\">URL:</span> https://wavelength-radio.vercel.app\nInternet radio with a visual frequency display.")}}}
                                                 :creative-block #js {:type "dir"
                                                                      :children #js {:README.md #js {:type "file" :size "0.1K" :modified "Jan 2026" :content (str "<span class=\"t-info\">Creative Block</span>\n<span class=\"t-muted\">Category: art</span>\n<span class=\"t-accent\">URL:</span> https://creative-block.vercel.app\nInteractive generative art piece.")}}}
                                                 :spinning-wheel #js {:type "dir"
                                                                      :children #js {:README.md #js {:type "file" :size "0.2K" :modified "Jan 2026" :content (str "<span class=\"t-info\">Spinning Wheel AR Filter</span>\n<span class=\"t-muted\">Category: AR/XR</span>\n<span class=\"t-accent\">URL:</span> https://spinning-wheel-filter.vercel.app\nAugmented reality spinning wheel experience.")}}}
                                                 :bboy-filter #js {:type "dir"
                                                                   :children #js {:README.md #js {:type "file" :size "0.2K" :modified "Jan 2026" :content (str "<span class=\"t-info\">AR B-Boy Filter</span>\n<span class=\"t-muted\">Category: AR/XR</span>\n<span class=\"t-accent\">URL:</span> https://bboy-filter.vercel.app\nBreakdancing augmented reality filter.")}}}
                                                 :uyr-problem #js {:type "dir"
                                                                   :children #js {:README.md #js {:type "file" :size "0.2K" :modified "Feb 2026" :content (str "<span class=\"t-info\">UYR Problem</span>\n<span class=\"t-muted\">Category: tool</span>\n<span class=\"t-accent\">URL:</span> https://uyr-problem.vercel.app\nUtility for understanding your own problem space.")}}}
                                                 :mymind-clone #js {:type "dir"
                                                                    :children #js {:README.md #js {:type "file" :size "0.2K" :modified "Feb 2026" :content (str "<span class=\"t-info\">mymind.com Clone</span>\n<span class=\"t-muted\">Category: personal software</span>\n<span class=\"t-accent\">URL:</span> https://curate-your-own-network.stussysenik.com\nCurate your own network — personal curation tool.")}}}}}
                      :repos #js {:type "dir"
                                  :modified "Mar 2026"
                                  :children #js {:gemini-cli #js {:type "dir"
                                                                  :children #js {:README.md #js {:type "file" :size "0.3K" :modified "Mar 2026" :content (str "<span class=\"t-info\">gemini-cli</span> <span class=\"t-muted\">— geminicli.com</span>\nAn open-source AI agent that brings the power of\nGemini directly into your terminal.")}}}
                                                 :background-agents #js {:type "dir"
                                                                         :children #js {:README.md #js {:type "file" :size "0.3K" :modified "Mar 2026" :content (str "<span class=\"t-info\">background-agents</span> <span class=\"t-muted\">— backgroundagents.dev</span>\nAn open-source background agents coding system.")}}}
                                                 :video2ascii #js {:type "dir"
                                                                   :children #js {:README.md #js {:type "file" :size "0.3K" :modified "Mar 2026" :content (str "<span class=\"t-info\">video2ascii</span> <span class=\"t-muted\">— npm: video2ascii</span>\nWebGL-powered React Component for video to ASCII conversion.\n<span class=\"t-accent\">Language:</span> TypeScript")}}}
                                                 :zig-web-gpu #js {:type "dir"
                                                                   :children #js {:README.md #js {:type "file" :size "0.3K" :modified "Mar 2026" :content (str "<span class=\"t-info\">zig-web-gpu-graphics</span>\nZig + WebGPU pixel-scene showcase compiled to WASM.\nProcedural retro graphics and cinematic scene variations.\n<span class=\"t-accent\">Language:</span> Zig")}}}
                                                 :phoenix-math #js {:type "dir"
                                                                    :children #js {:README.md #js {:type "file" :size "0.3K" :modified "Mar 2026" :content (str "<span class=\"t-info\">phoenix-math-stream</span>\nPhoenix LiveView math streaming app with SymPy and NVIDIA NIM.\n<span class=\"t-accent\">Language:</span> Elixir")}}}
                                                 :bitchat #js {:type "dir"
                                                               :children #js {:README.md #js {:type "file" :size "0.2K" :modified "Mar 2026" :content (str "<span class=\"t-info\">bitchat</span>\nBluetooth mesh chat, IRC vibes.\n<span class=\"t-accent\">Language:</span> Swift")}}}
                                                 :ANE #js {:type "dir"
                                                           :children #js {:README.md #js {:type "file" :size "0.3K" :modified "Mar 2026" :content (str "<span class=\"t-info\">ANE</span>\nTraining neural networks on Apple Neural Engine\nvia reverse-engineered private APIs.\n<span class=\"t-accent\">Language:</span> Objective-C")}}}
                                                 :invoices #js {:type "dir"
                                                                :children #js {:README.md #js {:type "file" :size "0.2K" :modified "Mar 2026" :content (str "<span class=\"t-info\">invoices</span> <span class=\"t-muted\">— billable.me</span>\nInvoicing software with editable everything,\nprint to PDF and logo support.")}}}}}
                      :talks #js {:type "dir"
                                  :modified "Feb 2026"
                                  :children #js {:README.md #js {:type "file"
                                                                 :size "0.1K"
                                                                 :modified "Feb 2026"
                                                                 :content (str "<span class=\"t-muted\">Navigate to /talks for the full list.</span>\n<span class=\"t-accent\">→ /talks</span>")}}}
                      :blog #js {:type "dir"
                                 :modified "Mar 2026"
                                 :children #js {:README.md #js {:type "file"
                                                                :size "0.1K"
                                                                :modified "Mar 2026"
                                                                :content (str "<span class=\"t-muted\">Navigate to /blog for all posts.</span>\n<span class=\"t-accent\">→ /blog</span>")}}}
                      :secrets #js {:type "dir"
                                    :modified "???"
                                    :children #js {:hidden #js {:type "file"
                                                                :size "0.1K"
                                                                :modified "???"
                                                                :content (str "<span class=\"t-warning\">🔒 ACCESS DENIED</span>\n"
                                                                              "<span class=\"t-muted\">Just kidding. There are no secrets here.</span>\n"
                                                                              "<span class=\"t-muted\">...or are there?</span>\n\n"
                                                                              "Try: <span class=\"t-accent\">cowsay</span>, <span class=\"t-accent\">matrix</span>, <span class=\"t-accent\">fortune</span>, <span class=\"t-accent\">pipes</span>")}}}}})

(defn resolve-path [current-path target]
  (let [parts (if (or (.startsWith target "/") (.startsWith target "~"))
                (filter #(not= "" %) (.split (.replace target "~" "") "/"))
                (let [current-parts (filter #(not= "" %) (.split (.replace current-path "~" "") "/"))]
                  (concat current-parts (filter #(not= "" %) (.split target "/")))))
        resolved (atom [])]
    (doseq [part parts]
      (cond
        (= part "..") (swap! resolved pop)
        (not= part ".") (swap! resolved conj part)))
    
    (loop [node filesystem
           path-parts @resolved]
      (if (empty? path-parts)
        #js {:node node :resolvedPath (if (empty? @resolved) "~" (str "~/" (.join (into-array @resolved) "/")))}
        (let [part (first path-parts)]
          (if (or (not= (aget node "type") "dir") (not (aget (aget node "children") part)))
            #js {:node nil :resolvedPath (str "~/" (.join (into-array @resolved) "/"))}
            (recur (aget (aget node "children") part) (rest path-parts))))))))

(defn list-dir [node]
  (let [children (aget node "children")
        entries (map (fn [name]
                       (let [child (aget children name)]
                         #js {:name name
                              :isDir (= (aget child "type") "dir")
                              :size (if (= (aget child "type") "file") (aget child "size") "—")
                              :modified (or (aget child "modified") "—")}))
                     (js/Object.keys children))]
    (.sort (into-array entries)
           (fn [a b]
             (if (not= (aget a "isDir") (aget b "isDir"))
               (if (aget a "isDir") -1 1)
               (.localeCompare (aget a "name") (aget b "name")))))))

(defn build-tree
  ([node] (build-tree node "" true))
  ([node prefix is-last]
   (let [children (aget node "children")
         entries (js/Object.keys children)
         len (count entries)
         result (atom "")]
     (doseq [i (range len)]
       (let [name (aget entries i)
             child (aget children name)
             last? (= i (- len 1))
             connector (if last? "└── " "├── ")
             cls (if (= (aget child "type") "dir") "t-accent" "t-muted")
             suffix (if (= (aget child "type") "dir") "/" "")]
         (swap! result str prefix connector "<span class=\"" cls "\">" name suffix "</span>\n")
         (when (= (aget child "type") "dir")
           (let [new-prefix (str prefix (if last? "    " "│   "))]
             (swap! result str (build-tree child new-prefix last?))))))
     @result)))