(ns portfolio.ui.drag)

(defn make-draggable
  "Svelte action written in pure ClojureScript to handle drag interactions.
   Follows Svelte's action contract: takes a node, returns a cleanup object."
  [node _params]
  (let [state (atom {:dragging? false
                     :start-x 0
                     :start-y 0
                     :pos-x 0
                     :pos-y 0
                     :start-mouse-x 0
                     :start-mouse-y 0})
        
        update-transform
        (fn []
          (let [{:keys [pos-x pos-y]} @state]
            (set! (.-transform (.-style node)) (str "translate(" pos-x "px, " pos-y "px)"))))
        
        handle-pointer-down
        (fn [e]
          (swap! state assoc
                 :dragging? true
                 :start-mouse-x (.-clientX e)
                 :start-mouse-y (.-clientY e)
                 :start-x (:pos-x @state)
                 :start-y (:pos-y @state))
          (.setPointerCapture node (.-pointerId e))
          (set! (.-cursor (.-style node)) "grabbing")
          (set! (.-zIndex (.-style node)) "100")
          (when-let [container (.querySelector node ".donut-container")]
            (.add (.-classList container) "dragging")))
        
        handle-pointer-move
        (fn [e]
          (when (:dragging? @state)
            (let [curr @state
                  dx (- (.-clientX e) (:start-mouse-x curr))
                  dy (- (.-clientY e) (:start-mouse-y curr))]
              (swap! state assoc
                     :pos-x (+ (:start-x curr) dx)
                     :pos-y (+ (:start-y curr) dy))
              (update-transform))))
        
        handle-pointer-up
        (fn [e]
          (swap! state assoc :dragging? false)
          (.releasePointerCapture node (.-pointerId e))
          (set! (.-cursor (.-style node)) "grab")
          (set! (.-zIndex (.-style node)) "50")
          (when-let [container (.querySelector node ".donut-container")]
            (.remove (.-classList container) "dragging")))]
    
    (set! (.-cursor (.-style node)) "grab")
    (set! (.-touchAction (.-style node)) "none")
    (set! (.-userSelect (.-style node)) "none")
    (set! (.-position (.-style node)) "relative")
    (set! (.-zIndex (.-style node)) "50")
    
    (.addEventListener node "pointerdown" handle-pointer-down)
    (.addEventListener node "pointermove" handle-pointer-move)
    (.addEventListener node "pointerup" handle-pointer-up)
    (.addEventListener node "pointercancel" handle-pointer-up)
    
    #js {:destroy
         (fn []
           (.removeEventListener node "pointerdown" handle-pointer-down)
           (.removeEventListener node "pointermove" handle-pointer-move)
           (.removeEventListener node "pointerup" handle-pointer-up)
           (.removeEventListener node "pointercancel" handle-pointer-up))}))
