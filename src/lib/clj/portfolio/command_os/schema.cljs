(ns portfolio.command-os.schema
  "Command palette schema — Anthropic tool spec generation.
   Ported from src/lib/command-os/schema.ts
   Generates JSON schema from the declarative action registry.")

(defn get-registry-schema [registry]
  "Generates Anthropic tool specs from the action registry map."
  (let [result (atom [])]
    (doseq [key (js/Object.keys registry)]
      (let [spec (aget registry key)
            params (.-parameters spec)
            properties (js/Object.create nil)
            required (atom [])]
        (doseq [pkey (js/Object.keys params)]
          (let [pdef (aget params pkey)
                prop (js/Object.create nil)]
            (when (:type pdef) (aset prop "type" (:type pdef)))
            (when (:description pdef) (aset prop "description" (:description pdef)))
            (when (:format pdef) (aset prop "format" (:format pdef)))
            (aset properties pkey prop)
            (when (:required pdef) (swap! required conj pkey))))
        (swap! result conj #js {:name (.-name spec)
                                :description (.-description spec)
                                :input_schema #js {:type "object"
                                                   :properties properties
                                                   :required (clj->js @required)}})))
    (clj->js @result)))

(defn get-registry-summary [registry]
  "Returns a simplified summary of available actions."
  (let [result (atom [])]
    (doseq [key (js/Object.keys registry)]
      (let [spec (aget registry key)]
        (swap! result conj #js {:name (.-name spec) :description (.-description spec)})))
    (clj->js @result)))