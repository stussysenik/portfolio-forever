# Tasks: Stabilize Live Embeds And Admin Runtime

## Phase 1: Prove the failures

- [x] Confirm `origin 'null'` CORS failures map to sandboxed preview iframes
- [x] Confirm Astro dev-toolbar endpoint returns `504 Outdated Optimize Dep`
- [x] Confirm Vite dependency scan fails because `src/lib/admin/constants.ts` is missing exports required by admin components

## Phase 2: Green the runtime

- [x] Restore the admin constants contract in `src/lib/admin/constants.ts`
- [x] Disable Astro dev-toolbar in `astro.config.mjs`
- [x] Enable Vite dev CORS in `astro.config.mjs`
- [x] Update same-host embed/admin preview frames to preserve same-origin

## Phase 3: Validate

- [x] `bun run check`
- [x] `bun run build`
- [x] `bun run dev` boots without the previous dependency scan failure
- [x] Local embed requests no longer reproduce the reported CORS/dev-toolbar errors

## Phase 4: Context Audit

- [x] Audit mobile-responsiveness shape and record the current gaps explicitly
- [x] Audit Storybook/design-token workflow shape and record what exists vs what specs still expect
- [x] Audit installed state-management/tooling shape (`nanostores`, `ts-pattern`, `xstate`, `remeda`)
- [x] Audit finished/deferred `openspec` work relevant to admin, responsive behavior, and public shell parity
- [x] Audit the public footer/status rail highlighted by the user and record it as an explicit follow-up design target

## Context Backlog Logged

- [x] Storybook/design-system completion remains a separate follow-up
- [x] Admin standardization beyond runtime recovery remains a separate follow-up
- [x] XState/Remeda adoption remains a separate architectural decision because those packages are not currently installed
