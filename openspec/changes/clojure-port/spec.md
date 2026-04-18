# SPEC-001: 1:1 Clojure Abstraction Layer Completion

## 1. Goal
Complete the Clojure (Squint) abstraction layer to provide a 1:1 functional equivalent of the existing TypeScript/Svelte logic. This allows for Lisp-based orchestration and REPL-driven development while maintaining identical visual and functional output on the frontend.

## 2. Context
The project is a Svelte 5 + Convex portfolio. A partial Clojure port exists in `clj/`. The current app still uses TS/Svelte for most logic. The goal is to move all "judgment" and "orchestration" logic to Clojure.

## 3. Scope
- **Data Layer**: Ensure all static data in `clj/src/portfolio/data/` matches `src/lib/data/` (Main branch content).
- **Utils Layer**: Ensure all utility functions in `clj/src/portfolio/utils/` match `src/lib/utils/`.
- **Stores Layer**: Port Svelte store management logic to `clj/src/portfolio/stores/`.
- **Sections Layer**: Port component logic (Convex subscriptions, reactive state) for all 16 sections to Clojure.
- **Admin Layer**: Port admin state management to Clojure.
- **Verification**: 100% convergence in `tests/clojure/convergence.test.ts`.

## 4. Non-Goals
- Porting `.svelte` markup to Clojure (Squint doesn't support Svelte templates).
- Porting Convex backend functions to Clojure (they stay in TS/JS).
- Changing the visual design.

## 5. Implementation Strategy
1.  **Extract logic from Svelte components**: Identify `onMount`, `$state`, and `$derived` blocks that can be moved to Clojure.
2.  **Implement in Clojure**: Use Squint to compile Clojure to ESM.
3.  **Import in Svelte**: Replace TS logic with imports from `clj/out/`.
4.  **Convergence Testing**: Use the existing `convergence.test.ts` to ensure data parity.

## 6. Verification Plan
- **Unit Tests**: `bun run test:unit -- tests/clojure/convergence.test.ts`
- **Visual E2E**: `bun run test` (Playwright) to ensure no regressions.
- **Manual Verification**: Check `/` and `/admin` for functional parity.
