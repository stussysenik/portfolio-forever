# Tasks: Polish Admin Final

## 1. Melt-UI AdminSheet
- [x] 1.1 Import `createDialog` and `melt` from `@melt-ui/svelte` in `AdminSheet.svelte`
- [x] 1.2 Refactor logic to use the builder pattern
- [x] 1.3 Maintain existing slide-up animation and drag-to-dismiss behavior if possible, or use Melt's transitions

## 2. Preview Frame
- [x] 2.1 Create `src/lib/admin/PreviewFrame.svelte`
- [x] 2.2 Move iframe logic from `PreviewPane.svelte` into `PreviewFrame.svelte`
- [x] 2.3 Add the "device chrome" header:
    - Route display (e.g., "portfolio.localhost:1355/works")
    - Refresh icon button
    - External link icon button
- [x] 2.4 Integrate `PreviewFrame` back into `PreviewPane.svelte`

## 3. Mobile Cleanup
- [x] 3.1 Verify `MobileDock.svelte` uses `PreviewSheet`
- [x] 3.2 Remove `PreviewDrawer.svelte` and its references in `AdminShell.svelte`

## 4. Final Validation
- [x] 4.1 Run `npm run check` (fixed regressions found in check)
- [x] 4.2 Confirm no regressions in dashboard/pages/history views
