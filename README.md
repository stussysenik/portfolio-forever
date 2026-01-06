# Portfolio 2026

A personal portfolio website built with SvelteKit 5 and Sanity CMS. Features a brutalist, terminal-inspired design with ASCII aesthetics, live content management, and experimental web technology demonstrations.

## ✨ Features

- **Terminal-Native Design** – Brutalist minimalism with monospace fonts, ASCII glyphs, and terminal-like interactions
- **Sanity CMS Integration** – Headless CMS for managing notes/blog content with PortableText rendering
- **Multi-Page Architecture** – CV, Notes, Labs, Gallery, and experimental OS/Terminal experiences
- **Keyboard-First Navigation** – Press `/` for command input, `?` for shortcuts

## 🗂 Project Structure

```
portfolio_2026/
├── src/
│   ├── lib/
│   │   ├── components/      # Reusable Svelte components
│   │   ├── data/            # Static data (works, cv, config)
│   │   └── sanity/          # Sanity client & queries
│   └── routes/
│       ├── cv/              # Structured CV timeline
│       ├── notes/           # Blog powered by Sanity
│       ├── labs/            # Experimental sandboxed projects
│       ├── os/              # Interactive OS simulation
│       ├── terminal/        # CLI-style interface
│       └── ...
├── static/                  # Static assets (favicons, fonts)
├── markdown/                # Development notes & documentation
└── .env.local               # Environment variables (not committed)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd portfolio_2026

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Sanity credentials
```

### Environment Variables

Create a `.env.local` file with:

```bash
# Sanity CMS
PUBLIC_SANITY_PROJECT_ID=your_project_id
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2024-01-01
```

### Development

```bash
# Start development server
npm run dev

# Start and open in browser
npm run dev -- --open

# Run type checks
npm run check

# Run type checks in watch mode
npm run check:watch
```

### Building

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## 🛠 Tech Stack

| Layer       | Technology                         |
|-------------|-------------------------------------|
| Framework   | SvelteKit 5 + TypeScript            |
| Styling     | Vanilla CSS                         |
| CMS         | Sanity (headless)                   |
| Rich Text   | PortableText/Svelte                 |
| Deployment  | Vercel (adapter-static/auto)        |

## 📖 Content Management

### Notes (Blog)

Notes are managed through Sanity Studio. The content is fetched via GROQ queries and rendered with `@portabletext/svelte`.

**Schema:**
- `title` – Note title
- `slug` – URL slug
- `publishedAt` – Publication date
- `body` – PortableText rich content

### Adding Content
1. Access Sanity Studio at your project's hosted URL
2. Create/edit notes in the studio
3. **Publish**: The site rebuilds automatically via Vercel Webhooks (approx. 2-3 mins)

## 🚀 Deployment & Automation

This project uses **Static Site Generation (SSG)** on Vercel. Code updates via Git and content updates via Sanity both trigger rebuilds.

### 1. The Workflow
- **Code Changes**: `git push` → Vercel Rebuilds.
- **Content Changes**: Publisher hits "Publish" in Sanity Studio → Webhook triggers Vercel Rebuild.

### 2. Configuration Setup
If you need to re-configure the automation:

#### Step A: Vercel (The Receiver)
1. Go to **Settings** > **Git** > **Deploy Hooks**.
2. Create a hook named "Sanity Update".
3. Copy the unique URL.

#### Step B: Sanity (The Trigger)
1. Go to [manage.sanity.io](https://manage.sanity.io) -> API -> Webhooks.
2. Create a new Webhook:
   - **URL**: Paste the Vercel URL.
   - **Trigger on**: Create, Update, Delete.
   - **Filter**: `_type == "post"`
   - **Method**: POST.

   > [!CAAUTION]
   > **Do NOT check "Drafts" or "Versions".**
   > Sanity autosaves every few seconds. Checking these will spam Vercel with thousands of build requests, hitting your limits instantly. Use `npm run dev` locally to preview drafts.

## 🧪 Labs (Experiments)

The `/labs` route hosts experimental projects. These are sandboxed for security and may require specific browser features (WebGPU, WASM).

## 📁 Key Files

| File                    | Purpose                                    |
|-------------------------|--------------------------------------------|
| `src/app.css`           | Global styles and CSS variables            |
| `src/lib/sanity/`       | Sanity client configuration                |
| `src/routes/+layout.svelte` | Root layout with navigation            |
| `svelte.config.js`      | SvelteKit configuration                    |

## 📜 Available Scripts

| Command              | Description                           |
|----------------------|---------------------------------------|
| `npm run dev`        | Start development server              |
| `npm run build`      | Create production build               |
| `npm run preview`    | Preview production build              |
| `npm run check`      | Run Svelte/TS type checks             |
| `npm run check:watch`| Type checks in watch mode             |

## 🔗 Related Documentation

- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Svelte 5 Runes](https://svelte.dev/docs/svelte/what-are-runes)
- [Sanity Documentation](https://www.sanity.io/docs)
- [PortableText for Svelte](https://github.com/portabletext/svelte-portabletext)

## 📄 License

Private project. All rights reserved.

---

<div align="center">
  <sub>Built with ♥ using SvelteKit & Sanity</sub>
</div>
