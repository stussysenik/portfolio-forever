(ns portfolio.stores.admin-drafts
  "Admin draft store — tracks uncommitted CMS changes keyed by document ID.
   Ported from src/lib/stores/adminDrafts.ts"
  (:require ["svelte/store" :refer [writable]]))

(defn init-draft [drafts id initial-data]
  (if (aget drafts id)
    drafts
    (let [cloned (js/JSON.parse (js/JSON.stringify initial-data))
          entry (js/Object.create nil)]
      (aset entry "original" cloned)
      (aset entry "current" cloned)
      (aset entry "isDirty" false)
      (let [result (js/Object.assign (js/Object.create nil) drafts)]
        (aset result id entry)
        result))))

(defn update-draft [drafts id updates]
  (let [draft (aget drafts id)]
    (if-not draft
      drafts
      (let [nextCurrent (js/Object.assign (js/Object.create nil) (.-current draft) updates)
            isDirty (not= (js/JSON.stringify nextCurrent) (js/JSON.stringify (.-original draft)))
            entry (js/Object.create nil)]
        (aset entry "original" (.-original draft))
        (aset entry "current" nextCurrent)
        (aset entry "isDirty" isDirty)
        (let [result (js/Object.assign (js/Object.create nil) drafts)]
          (aset result id entry)
          result)))))

(defn reset-draft [drafts id]
  (let [draft (aget drafts id)]
    (if-not draft
      drafts
      (let [reset (js/JSON.parse (js/JSON.stringify (.-original draft)))
            entry (js/Object.create nil)]
        (aset entry "original" (.-original draft))
        (aset entry "current" reset)
        (aset entry "isDirty" false)
        (let [result (js/Object.assign (js/Object.create nil) drafts)]
          (aset result id entry)
          result)))))

(defn commit-draft [drafts id]
  (let [draft (aget drafts id)]
    (if-not draft
      drafts
      (let [committed (js/JSON.parse (js/JSON.stringify (.-current draft)))
            entry (js/Object.create nil)]
        (aset entry "original" committed)
        (aset entry "current" (.-current draft))
        (aset entry "isDirty" false)
        (let [result (js/Object.assign (js/Object.create nil) drafts)]
          (aset result id entry)
          result)))))

(defn create-admin-drafts-store []
  (let [store (writable (js/Object.create nil))]
    (js/Object.freeze
      #js {:subscribe (.-subscribe store)
           :initDraft (fn [id initial-data]
                        (.update store (fn [drafts] (init-draft drafts id initial-data))))
           :updateDraft (fn [id updates]
                          (.update store (fn [drafts] (update-draft drafts id updates))))
           :resetDraft (fn [id]
                         (.update store (fn [drafts] (reset-draft drafts id))))
           :commitDraft (fn [id]
                          (.update store (fn [drafts] (commit-draft drafts id))))})))