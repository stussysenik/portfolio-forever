(ns portfolio.command-os.registry
  "Command OS action registry — defines all palette actions with Zod schemas.
   Ported from src/lib/command-os/registry.ts
   Note: Zod schemas are referenced but the actual validation runs in JS land.
   This namespace provides the registry specification in Clojure data.")

(def action-registry
  "Declarative specification of all command palette actions.
   Each action has: name, description, parameters (as data), and a JS execution bridge."
  {:create-work {:name "createWork"
                 :description "Add a new project to the works page."
                 :parameters {:title {:type "string" :required true}
                              :url {:type "string" :format "url" :required true}
                              :category {:type "string"}
                              :link-label {:type "string"}
                              :visible {:type "boolean" :default true}}
                 :convex-mutation "works:createEntry"}
   :update-work {:name "updateWork"
                 :description "Edit an existing work entry by id. All fields are optional."
                 :parameters {:id {:type "string" :required true}
                              :title {:type "string"}
                              :url {:type "string" :format "url"}
                              :visible {:type "boolean"}}
                 :convex-mutation "works:updateEntry"}
   :delete-work {:name "deleteWork"
                 :description "Delete a work entry by id."
                 :parameters {:id {:type "string" :required true}}
                 :convex-mutation "works:deleteEntry"}
   :create-blog-post {:name "createBlogPost"
                      :description "Create a new blog post draft."
                      :parameters {:title {:type "string" :required true}
                                   :slug {:type "string" :pattern "^[a-z0-9-]+$" :required true}
                                   :excerpt {:type "string"}
                                   :content {:type "string"}
                                   :visible {:type "boolean" :default false}}
                      :convex-mutation "blog:createPost"}
   :set-theme {:name "setTheme"
               :description "Set the default site theme by theme id."
               :parameters {:theme-id {:type "string" :required true}}
               :convex-mutation "themes:setDefault"}
   :toggle-flag {:name "toggleFlag"
                 :description "Enable or disable a feature flag by id."
                 :parameters {:flag-id {:type "string" :required true}
                              :enabled {:type "boolean" :required true}}
                 :convex-mutation "siteConfig:setFeatureFlag"}
   :navigate-to {:name "navigateTo"
                 :description "Navigate to a SvelteKit route."
                 :parameters {:path {:type "string" :required true :pattern "^/"}}
                 :local true}
   :set-wip-badge {:name "setWipBadge"
                   :description "Show or hide the WIP banner."
                   :parameters {:visible {:type "boolean" :required true}}}
   :preview-at {:name "previewAt"
               :description "Set the preview pane viewport width."
               :parameters {:width {:type "number" :required true :min 280 :max 3840}}
               :local true}
   :commit-pending {:name "commitPending"
                    :description "Commit all staged changes to the database."
                    :parameters {:confirm {:type "boolean" :required true}}
                    :convex-mutation "batch"}})