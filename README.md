# Portfolio Forever

Personal portfolio built with SvelteKit 5 and Sanity CMS. Terminal-inspired design with ASCII aesthetics and intentional typography.

## ✨ Features

- **Terminal-Native Design** – Brutalist minimalism, monospace typography, command palette (`/`)
- **Sanity CMS** – Headless content management for notes with PortableText rendering
- **Design System** – Golden ratio spacing, consistent vertical rhythm, high color contrast
- **Responsive** – Mobile-first with collapsible social links, optimized reading widths
- **Playwright Testing** – Comprehensive mobile responsive tests

## 🗂 Structure

```
src/
├── lib/
│   ├── components/      # AsciiVideo, AsciiDonut, CommandPalette
│   ├── data/            # Content, config, layout settings
│   └── sanity/          # CMS client & queries
└── routes/
    ├── notes/           # Blog (Sanity-powered)
    ├── cv/              # Structured timeline
    ├── likes/           # Curated bookmarks
    ├── terminal/        # CLI interface
    └── process/         # Behind-the-scenes
```

## 🚀 Quick Start

```bash
bun install
cp .env.example .env.local  # Add Sanity credentials
bun run dev
```

## 📐 Design Principles

- **640px max-width** for optimal reading (golden ratio ≈ 1024/φ)
- **Spacing scale** based on design tokens (`--space-xs` to `--space-6xl`)
- **Color contrast** meeting WCAG AA standards
- **Intentional negative space** – not dead space

## 🧪 Testing

```bash
bun run test                           # All tests
bun run test:responsive                # Mobile responsive tests
npx playwright test --project="Mobile Chrome"
```

## 🛠 Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Framework | SvelteKit 5 + TypeScript|
| Styling   | Vanilla CSS (design tokens) |
| CMS       | Sanity (headless)       |
| Testing   | Playwright              |
| Deploy    | Vercel                  |

## 📄 License

Private project. All rights reserved.

---

<div align="center">
  <sub>Built with care using SvelteKit & Sanity</sub>
</div>
