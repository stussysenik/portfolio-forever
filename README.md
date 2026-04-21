<div align="center">

# Portfolio Forever

![Demo](demo.gif)


### Personal portfolio with an Astro host, live Convex runtime, and Sanity editorial preview

![Astro](https://img.shields.io/badge/Astro-6-FF5D01?style=flat-square&logo=astro&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![Convex](https://img.shields.io/badge/Convex-Backend-6C47FF?style=flat-square)
![Sanity](https://img.shields.io/badge/Sanity-Editorial-F03E2F?style=flat-square&logo=sanity&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=flat-square&logo=vercel)

[Live Site](https://portfolio-forever.vercel.app)

</div>

---

Personal portfolio running on an Astro-first architecture with Svelte islands, a Convex real-time backend, and Sanity for editorial content plus Presentation/preview flows. ASCII aesthetics, intentional typography, and obsessive attention to spacing.

Current production host boundaries:
- Astro is the only production host for the public shell and `/admin`.
- Sanity Studio is embedded under `/admin/content/studio`.
- Draft-mode preview, editorial handoff, and route-level Astro preview tests are wired for the Sanity-backed pages.
- Full Sanity visual editing still requires `SANITY_API_READ_TOKEN` in the runtime environment.
- Legacy Svelte route modules remain only where Astro reuses them as implementation islands or parity references.

## Routes

| Route       | Description                        |
|-------------|------------------------------------|
| `/`         | Homepage — hero, works list, identity |
| `/works`    | Live project embeds + previews     |
| `/talks`    | Speaking engagements               |
| `/likes`    | Curated bookmarks                  |
| `/blog`     | Short notes (Convex)               |
| `/gifts`    | The Promise — creative exchange    |
| `/cv`       | Structured timeline + disciplines  |
| `/process`  | Behind-the-scenes methodology      |
| `/terminal` | CLI interface                      |
| `/admin`    | Portfolio OS — mobile-first admin  |

## Quick Start

```bash
bun install
bun run dev
```

> **Note:** The broken `src/lib/clj` symlink has been replaced with local compatibility modules under `src/lib/clj/portfolio/**` so the Astro host can compile the legacy Svelte sections directly.

## Design System

- **5 themes**: Accessible (WCAG AAA), Minimal, Studio, Terminal (dark), Darkroom (reference dark)
- **9 fonts**: Inter, Crimson Pro, JetBrains Mono, Fira Code, Space Grotesk, Rubik, IBM Plex Mono, Times New Roman, Helvetica
- **Keyboard shortcuts**: `T` cycles themes, `F` opens font switcher, `?` or `/` opens command palette
- **Command palette** with vim-style key sequences (`g w` → Works)
- **Golden ratio spacing** via design tokens (`--space-xs` to `--space-6xl`)
- **Responsive nav**: wrapping layout with inline social links
- **Footer status bar**: floating, with theme/font controls opening upward

## Tech Stack

| Layer     | Technology                |
|-----------|---------------------------|
| Framework | Astro 6 + Svelte 5 islands + TypeScript |
| Styling   | Vanilla CSS (design tokens) |
| Backend   | Convex (real-time) + Sanity (editorial) |
| Testing   | Playwright + Vitest       |
| Build     | Astro + Vite 7            |
| Deploy    | Vercel / Node adapter     |

## Testing

```bash
bun run dev                                        # Start dev server first
bunx playwright test tests/e2e/                    # E2E tests
bunx playwright test tests/interaction/            # Interaction + stress tests
bunx playwright test tests/accessibility/          # Accessibility tests
bunx playwright test                               # All tests
bunx playwright test --project=chromium            # Single browser
bun run test                                       # Unit tests (Vitest)
```

## Structure

```
src/
├── lib/
│   ├── admin/           # Portfolio OS admin (60+ components)
│   ├── components/      # AsciiDonut, CommandPalette, ThemeSwitcher, FontSwitcher
│   ├── data/            # content.ts, cv.ts, layout-config.ts, tokens.ts
│   ├── sections/        # All page sections (Convex-wired)
│   ├── stores/          # Svelte stores (site config, controls)
│   └── utils/           # Overlap detector, helpers
├── pages/               # Astro public + admin routes
├── layouts/             # Astro host shells
├── routes/              # Legacy Svelte route modules kept only as parity refs/islands
convex/
├── schema.ts            # Data model (15+ tables)
├── works.ts             # Works CRUD
├── hero.ts              # Hero config
├── pages.ts             # Page/section management
└── ...                  # All backend modules
```

## License

Private project. All rights reserved.
