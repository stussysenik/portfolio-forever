# QA Ledger

> Last Updated: 2026-01-10

## Test Suite Status

| Suite | Tests | Status | Last Run |
|-------|-------|--------|----------|
| **smoke.spec.ts** | 4 | ✅ Pass | 2026-01-10 |
| **essential.spec.ts** | 12 | ✅ Pass | 2026-01-10 |
| **e2e/homepage.spec.ts** | 39+ | ⏳ Not Run | - |

## Essential Tests (12/12 Pass)

| Category | Tests | Status |
|----------|-------|--------|
| Reactivity & State | 3 | ✅ Pass |
| Interaction | 4 | ✅ Pass |
| Responsiveness | 3 | ✅ Pass |
| Page Load | 2 | ✅ Pass |

## Video Player Verification

Manual browser testing verified:
- [x] Full-width CSS progress bar (green fill)
- [x] Fullscreen toggle works [ ⛶ ]
- [x] Loop toggle [ 🔁 ]
- [x] Playback rate [1x] / [1.5x] / [2x]
- [x] Mute/unmute toggle
- [x] Time display (00:05/14:47 format)
- [x] Project links (→ project)
- [x] Responsive controls on mobile

## Commands

```bash
# Run essential tests
npx playwright test tests/essential.spec.ts --project=chromium

# View HTML report
npx playwright show-report
```
