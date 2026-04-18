# DESIGNSTACK.MD

## Vision
A data-driven, highly-composable administrative interface that mirrors the expressive and minimalist nature of the portfolio itself. The admin panel should feel like an "Inner POV" – a surgical tool for content and style manipulation.

## Core Principles
- **Data-Oriented:** UI is a projection of state. State is managed as immutable data structures where possible.
- **Expressiveness over Ceremony:** Use Clojure (Squint) for complex state transitions and data transformations.
- **Surgical Updates:** Minimize side effects; clearly separate staged changes from persisted state.
- **Visual Feedback:** Direct mapping between config and preview.

## Visual Language
- **Base:** Industrial / Minimalist (Carbon-inspired but more "raw").
- **Typography:** 
  - Interface: Inter / IBM Plex Sans.
  - Data/Monospaced: JetBrains Mono / IBM Plex Mono.
- **Color Palette:**
  - Backgrounds: High-contrast (Ink Black / Stark White).
  - Accents: Terminal Green (#00FF00), Studio Brown, Electric Blue.
  - Keylines: Subtle borders (1px) for structural separation.
- **Components:**
  - **Compartments:** Collapsible sections for focused editing.
  - **Chips:** Small, tactile status and mode indicators.
  - **Sheets:** Layered overlays for secondary tasks.

## Tech Stack
- **Framework:** Svelte 5 (Runes for reactivity, Snippets for composition).
- **Logic:** Clojure (Squint) for stores and data handling.
- **Styling:** CSS Variables + Vanilla CSS (Scoped).
- **Components:** Melt-UI for accessible primitives.
- **Backend:** Convex for real-time data and historical tracking.

## Admin Patterns
- **Staging Area:** A local-first draft system where changes are collected before being persisted.
- **Takeouts:** Exportable snapshots of the current configuration.
- **History Audit:** Utilizing the `adminHistory` table in Convex to show a timeline of changes.
- **Inline Preview:** Real-time synchronization between the "Builder" (Config) and "Preview" (Live Site).
