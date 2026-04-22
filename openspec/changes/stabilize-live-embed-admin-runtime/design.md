# Design: Stabilize Live Embeds And Admin Runtime

## Scope

This is a runtime-stability change, not a redesign.

We are fixing the smallest set of causes that explain the observed failures:

- `sandbox="allow-scripts"` on same-host preview frames creates `origin: null`
- Astro dev-toolbar injection adds a broken dev-only dependency request
- Admin constants exports drifted from the admin UI contract

## Decisions

### 1. Same-host preview frames keep same-origin

For internal portfolio previews, sandboxing without `allow-same-origin` is the wrong tradeoff. These frames are not untrusted third-party documents; they are first-party routes used for portfolio proof and admin preview.

Decision:

- same-host/internal preview iframes use `allow-same-origin` alongside scripts
- external preview surfaces remain unchanged unless they already rely on a different policy

### 2. Disable Astro dev-toolbar project-wide

The dev-toolbar is not essential to the portfolio runtime and is currently generating `504 Outdated Optimize Dep` noise in embedded dev flows.

Decision:

- set `devToolbar.enabled = false` in Astro config

### 3. Enable Vite dev CORS

Some embed contexts still fetch Vite resources from sandboxed documents during development. Allowing CORS on the dev server is a contained development-only compatibility fix.

Decision:

- enable `vite.server.cors` in Astro config

### 4. Reconstruct the admin constants API instead of rewriting call sites

The current admin surface already assumes a shared constants module. Reintroducing the missing exports is lower-risk than touching many admin components at once.

Decision:

- restore `VIEW_MODES`, `DEFAULTS`, `TYPOGRAPHY_DEFAULTS`, and `stripConvexMeta` in `src/lib/admin/constants.ts`

## Deferred Backlog Captured From Context

- Storybook exists, but the broader design-system/testing spec is only partially completed.
- `nanostores` and `ts-pattern` are present; `xstate` and `remeda` are not currently part of the installed runtime.
- `/admin` has multiple existing redesign and workflow specs, but this change only restores runtime health so those can be executed sanely.
