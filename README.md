<div align="center">

# Portfolio Forever

![Demo](demo.gif)


### Personal portfolio with ASCII aesthetics

![SvelteKit](https://img.shields.io/badge/SvelteKit-5-FF3E00?style=flat-square&logo=svelte&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![Convex](https://img.shields.io/badge/Convex-Backend-6C47FF?style=flat-square)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=flat-square&logo=vercel)

[Live Site](https://portfolio-forever.vercel.app)

</div>

---

Personal portfolio built with SvelteKit 5, Convex real-time backend, and a terminal-inspired design system. ASCII aesthetics, intentional typography, and obsessive attention to spacing.

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
cp .env.example .env.local  # Add Convex credentials
bun run dev
```

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
| Framework | SvelteKit 5 + TypeScript  |
| Styling   | Vanilla CSS (design tokens) |
| Backend   | Convex (real-time)        |
| Testing   | Playwright + Vitest       |
| Build     | Vite 7                    |
| Deploy    | Vercel (static adapter)   |

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
├── routes/
│   ├── admin/           # Admin dashboard + [pageId] routes
│   ├── blog/            # Notes
│   ├── works/           # Live project showcases
│   ├── cv/              # Structured timeline
│   └── ...              # All other routes
convex/
├── schema.ts            # Data model (15+ tables)
├── works.ts             # Works CRUD
├── hero.ts              # Hero config
├── pages.ts             # Page/section management
└── ...                  # All backend modules
```

## License

Private project. All rights reserved.
