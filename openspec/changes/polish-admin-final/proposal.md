# Proposal: Polish Admin Final — Preview Frame & Robust Sheets

## Overview
Complete the final "major things" for the admin CMS: (1) wrap the preview in a proper device frame with metadata, (2) harden the mobile sheet primitive using Melt-UI, and (3) clean up the last few shell-level inconsistencies.

## Problem Statement
1. **The preview is "just an iframe"**. It lacks the "device chrome" (URL bar, switcher, actions) that makes it feel like a framed window into the site.
2. **AdminSheet is a custom hack**. The current implementation works but lacks robust focus management, ARIA completeness, and standard dialog behaviors provided by libraries like Melt-UI.
3. **Redundant UI on mobile**. `PreviewDrawer` and `PreviewSheet` overlap; we should unify on the sheet pattern.

## Proposed Solution
- **Task A: Build PreviewFrame.svelte**. Wrap the `PreviewPane` iframe in a component that adds a 32px top bar with the current route name, a refresh button, and an "open in new tab" affordance.
- **Task B: Melt-UI Dialog for AdminSheet**. Refactor `AdminSheet.svelte` to use `@melt-ui/svelte` dialog builder. This ensures focus traps, ESC-to-close, and backdrop logic are industry-standard.
- **Task C: Unify Mobile Preview**. Ensure `MobileDock` uses `PreviewSheet` and remove the legacy `PreviewDrawer`.

## Success Criteria
- [ ] Preview pane has a visible top-bar "chrome" with route info.
- [ ] AdminSheet uses Melt-UI (verifiable via package imports).
- [ ] Mobile admin is completely sheet-driven.
- [ ] `svelte-check` passes.
