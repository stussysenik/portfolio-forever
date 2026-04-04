# OpenSpec: Control Theory Architecture

## 1. System Thesis
The portfolio is no longer a static HTML stream or an "archive of vibes". It is a dynamic, closed-loop state machine structured around **Control Theory**.

Instead of routing users to twenty different pages, the architecture dynamically hydrates, mutates, and collapses data structures based on the *Controls* (Knobs) the user feeds into the system. This allows the application to serve as an instant, high-density screen-pass for a recruiter (e.g., at Windmill), or morph into an expansive, physics-driven, brutalist showcase of SVG string-math for a creative art director.

---

## 2. The Inputs (Controls Array)

The global state is managed by specific inputs. Modifying any input strictly re-renders the DOM outputs and mutates the `<Embellishments>` physics loops.

### 2.1 The Depth Slider (`<TimeDepthController>`)
Recruiters demand evidence density as fast as possible. This control adjusts the depth of the Information Architecture dynamically.
- **5-Minute Mode (The Windmill Screen-Pass):**
  - Restricts the DOM to the `HeroPositioningBlock` and strictly the `OutcomeBlocks` of the TWO flagship projects (e.g., Attendu).
  - Pre-loads all layout changes instantly.
  - Archival routes and experimental tangents are hidden. Focus entirely on "Problem, User, Ownership, Result".
- **15-Minute Mode (Deep Dive):**
  - Expands the flagship case studies to reveal the `MetadataBlocks` (showing 2-week ship timelines, exact technical constraints, etc.) and exposes the short "selected works" index.
- **Full Archive (Unconstrained):**
  - Fully expands the DOM. Exposes raw lists (e.g., `/likes`) and experimental `/works` artifacts.

### 2.2 The Aesthetic Matrix (`<ThemeController>`)
Treating exact pixel mapping and layer composition identically to a linear algebra matrix.
- **Night Vision Thresholding:** Calculates the absolute minimum contrast ratio delta required for flawless WCAG AAA rendering and calculates overlapping element thresholds algorithmically.
- **Brutalist / Minimalist Modes:** Instantly swaps the CSS Custom Properties and typographical scales across the Golden Ratios defined in the core Box Model schema.

### 2.3 The Physics & Embellishments Engines (`<MotionController>`)
Animations are treated as separate physical layers or "stackable shaders."
- **Layout Transitions:** Controlled by standard cubic-beziers defined for maximum speed and friction-free navigation (Emil Kowalski principles).
- **Physical Dynamics:** When enabled, turns on the "String Problem" fluid math engines (Jhey Tompkins physics) for interactive elements.
- **The "Little Aliens" Embellishments:** Fetched from `main`. These sit completely parallel to the DOM in an absolute layer. They can be dynamically toggled off so they never interfere with a strict recruiter screening pass.

---

## 3. The System (Modular Blocks Output)

Everything rendered to the client is a Moddable Block mapped to a RedwoodJS-style "Cell" structure. Because they follow a Single Responsibility Principle (receiving clean, typed Direct Data Feeds), every single visible text parameter across these blocks natively supports **Double-Tap Live Editability**.

- **`HeroPositioningBlock`**: Non-poetic, strict positioning string.
- **`OutcomeBlock`**: Forces the rendering of the Problem -> Constraint -> Metric pipeline.
- **`MetadataBlock`**: Strictly renders "Time-to-ship" and "Scope".
- **`GenericListBlock`**: The columns governing sections like `/likes` and lists in `Re:mix`.

---

## 4. The Plant (Layout & Scalability)

To solve the existing desktop alignment bounds and mobile flex/collapse bugs, the styling pipeline is standardized entirely around the **Tailwind Box Model** locked to **Golden Ratio scalars**.
This establishes a mathematical guarantee that whether the CV is viewed on a 320px mobile viewport or a 6K Studio Display, typographical dimensions scale infinitely without generating UI blind-spots or clipping flags.

---

## 5. The Validation Loop

Given the combinatorial complexity of the Controls Array (e.g., 5-Minute mode running in Night Vision with Fluid Physics enabled), the system demands absolute reliability.

### 5.1 Playwright POM (Page Object Model) Check
- End-to-End tests will use strictly structured Page Objects to assert visibility of `OutcomeBlocks` when the `<TimeDepthController>` is set to "5-Minutes" and assert they disappear when toggled otherwise.
- In-memory `axe-core` sweeps immediately trigger if the linear algebra contrast parameters fail thresholding.

### 5.2 The CV Boundary Bypass
- The `/cv` route intentionally ignores the entire Control Theory layout array. It acts as a static, isolated wrapper for embedding standard Harvard/Yale format **PDFs** natively.
