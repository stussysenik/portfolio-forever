# Proposal: Stabilize Live Embeds And Admin Runtime

## Why

The current local runtime has three coupled failures:

1. Internal preview frames are mounted in sandboxed iframes that collapse their origin to `null`, which breaks Astro/Vite dev resources inside embedded routes.
2. Astro dev-toolbar requests are being injected into embed surfaces during local development and are returning `504 Outdated Optimize Dep`, adding noise and instability to the preview loop.
3. `/admin` is not in a reliable baseline state because `src/lib/admin/constants.ts` no longer exports symbols required by the current admin surface, which breaks Vite dependency scanning before the admin can be standardized further.

These issues block the portfolio's core proof surface: live previews and route-true admin inspection.

## What Changes

- Restore a valid admin constants contract so the current admin UI can boot and be iterated on.
- Make internal preview iframes preserve same-origin behavior during local development instead of forcing `origin: null`.
- Disable Astro dev-toolbar injection for this project so embed routes stop requesting the unstable toolbar entrypoint.
- Allow Vite dev assets to load from embed contexts when the iframe is intentionally sandboxed.
- Record the remaining broader backlog from the current repo context rather than pretending this pass completes every open spec.

## Success Criteria

- [ ] Embedded internal routes no longer emit `origin 'null'` CORS failures for `@vite/client` and Astro style modules during local dev.
- [ ] The Astro dev-toolbar entrypoint is no longer requested by embed pages.
- [ ] `bun run dev` no longer fails dependency scan because of missing admin constant exports.
- [ ] `/admin` regains a stable baseline for further standardization work.
- [ ] `openspec` reflects what was fixed now versus what remains in the wider admin/storybook/state-management backlog.

## Non-Goals

- Completing every existing `openspec` task in the repository
- Converting the entire codebase to XState or adding Remeda in this pass
- Rebuilding the full admin IA or Storybook system in one batch
