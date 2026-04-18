(ns portfolio.terminal.filesystem
  "Virtual filesystem — maps the portfolio as a Unix directory tree.
   Simplified for Squint compatibility.")

(defn make-file [content size modified]
  (clj->js {:type "file" :content content :size (or size "0.4K") :modified (or modified "Jan 2026")}))

(defn make-dir [children modified]
  (clj->js {:type "dir" :children (clj->js children) :modified (or modified "Jan 2026")}))

(def about-content "<span class=\"t-info\">Stüssy Senik</span>\n<span class=\"t-muted\">Design Engineer & Creative Producer</span>\n\nBuilding at the intersection of science, design,\ncinema, computation and code.\n\nBased in <span class=\"t-accent\">Bed-Stuy, Brooklyn</span>.\nVibe-coding since 2017.")

(def contact-content "<span class=\"t-accent\">GitHub</span>    github.com/stussysenik\n<span class=\"t-accent\">Email</span>     itsmxzou@gmail.com\n<span class=\"t-accent\">Web</span>       stussysenik.com\n<span class=\"t-accent\">Location</span>  NYC / Prague")

(def resume-content "<span class=\"t-info\">══════════════════════════════════════</span>\n<span class=\"t-info\">  STÜSSY SENIK — Creative Technologist</span>\n<span class=\"t-info\">══════════════════════════════════════</span>\n\n<span class=\"t-accent\">FOCUS</span>\n  DevEx & Experience Design Engineering\n  クリエイティブ・テクノロジスト\n\n<span class=\"t-accent\">STACK</span>\n  TypeScript · SvelteKit · React · Svelte 5\n  AR/XR · WebGPU · Three.js · Zig · WASM\n  Elixir/Phoenix · Rails · Swift · Python\n\n<span class=\"t-muted\">Type 'cat cv.pdf' for the full CV page.</span>")

(def filesystem
  (clj->js {:type "dir"
             :children {:about.txt {:type "file" :content about-content :size "0.4K" :modified "Jan 2026"}
                        :contact.nfo {:type "file" :content contact-content :size "0.2K" :modified "Jan 2026"}
                        :resume.txt {:type "file" :content resume-content :size "2.1K" :modified "Mar 2026"}
                        :works {:type "dir" :children {} :modified "Mar 2026"}
                        :projects {:type "dir" :children {} :modified "Mar 2026"}
                        :skills {:type "dir" :children {} :modified "Jan 2026"}}}))

(defn resolve-path [_cwd target]
  "Resolve a path in the virtual filesystem. Returns node and resolved path."
  (let [clean (.replace (.replace target " " "") "~" "")
        path (if (.startsWith clean "/") clean (str "/" clean))]
    #js {:node nil :resolvedPath path}))

(defn list-dir [dir]
  "List entries in a virtual directory."
  (when (and dir (= (aget dir "type") "dir"))
    (let [children (aget dir "children")]
      (mapv (fn [key]
              (let [node (aget children key)]
                #js {:name key
                     :isDir (= (aget node "type") "dir")
                     :size (aget node "size")
                     :modified (aget node "modified")}))
            (js/Object.keys children)))))