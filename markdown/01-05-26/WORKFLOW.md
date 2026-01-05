# Sanity CMS Complete Workflow Guide

## Why CMS Makes Life Easier

**Without CMS (before):**
- Edit code files → commit → push → deploy → wait → see changes
- Every typo fix = full deploy cycle
- Non-coders can't help with content

**With Sanity CMS (now):**
- Write in visual editor → click Publish → changes appear instantly
- No deploys for content changes
- Separate concerns: code vs content

---

## Your Two Directories

```
~/Desktop/
├── portfolio_2026/           # YOUR WEBSITE (SvelteKit)
│   ├── src/lib/sanity/       # Fetches content from Sanity
│   └── src/routes/notes/     # Displays content
│
└── portfolio_2026_studio/    # CONTENT EDITOR (Sanity Studio)
    └── schemaTypes/          # Defines what content looks like
```

---

## One-Time Setup Checklist

### In `portfolio_2026_studio/` (do these once):

```bash
cd ~/Desktop/portfolio_2026_studio

# 1. Install code-input plugin for syntax highlighting
npm install @sanity/code-input

# 2. Update sanity.config.ts to include plugin
#    Add: import {codeInput} from '@sanity/code-input'
#    Add: plugins: [codeInput()]

# 3. Replace schemaTypes/post.ts with enhanced schema from SCHEMA_UPGRADE.md

# 4. Deploy studio to the web
npx sanity deploy
# → Creates: https://yourname.sanity.studio
```

### In `portfolio_2026/` (do these once):

```bash
cd ~/Desktop/portfolio_2026

# 1. Set environment variables in .env.local
echo "VITE_SANITY_PROJECT_ID=py21y2h1" >> .env.local
echo "VITE_SANITY_DATASET=production" >> .env.local

# 2. Deploy to Vercel
npx vercel
# → Creates: https://yoursite.vercel.app

# 3. Add CORS origin in Sanity dashboard
#    Go to: sanity.io/manage → API → CORS origins
#    Add: https://yoursite.vercel.app
```

---

## Ongoing Workflows

### Option A: Writing Content (Most Common)

**You don't touch any code!**

1. Go to `https://yourname.sanity.studio` (or `localhost:3333` for local)
2. Click "Post" → "Create new"
3. Write your article with rich text, code blocks, images
4. Click **Publish**
5. ✅ Your site updates automatically (no deploy needed)

### Option B: Changing Site Design/Code

```bash
cd ~/Desktop/portfolio_2026

# 1. Make code changes
# 2. Test locally
npm run dev

# 3. Commit and push (if connected to GitHub)
git add . && git commit -m "update" && git push

# 4. Vercel auto-deploys from GitHub
#    OR manually: npx vercel --prod
```

### Option C: Changing Content Schema

```bash
cd ~/Desktop/portfolio_2026_studio

# 1. Edit schemaTypes/post.ts
# 2. Test locally
npm run dev  # Check at localhost:3333

# 3. Deploy updated studio
npx sanity deploy

# 4. Update frontend types in portfolio_2026 if needed
```

---

## Quick Reference

| Task | Where | Command |
|------|-------|---------|
| Write a blog post | Studio (web or local) | Just use the UI |
| Test site locally | portfolio_2026 | `npm run dev` |
| Test studio locally | portfolio_2026_studio | `npm run dev` |
| Deploy site | portfolio_2026 | `npx vercel` or git push |
| Deploy studio | portfolio_2026_studio | `npx sanity deploy` |
| View production site | Browser | yoursite.vercel.app |
| View production studio | Browser | yourname.sanity.studio |

---

## Daily Workflow (After Setup)

```
Morning: Want to write a post?
  → Go to yourname.sanity.studio
  → Write → Publish
  → Done! Site updates automatically.

Occasionally: Want to tweak the design?
  → Edit code in portfolio_2026
  → Test with npm run dev
  → Push to GitHub (auto-deploys)
```

---

## Files That Matter

### portfolio_2026 (website)
| File | Purpose |
|------|---------|
| `src/lib/sanity/client.ts` | Connection to Sanity |
| `src/lib/sanity/queries.ts` | GROQ queries to fetch posts |
| `src/lib/sanity/types.ts` | TypeScript types for content |
| `src/routes/notes/+page.server.ts` | Fetches posts on page load |
| `src/routes/notes/[slug]/+page.svelte` | Renders individual post |

### portfolio_2026_studio (CMS)
| File | Purpose |
|------|---------|
| `schemaTypes/post.ts` | Defines post structure |
| `schemaTypes/index.ts` | Registers all schemas |
| `sanity.config.ts` | Studio configuration |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Post not showing | Check publishedAt date is set |
| Changes not appearing | Disable CDN (`useCdn: false`) in client.ts |
| CORS error | Add your domain to sanity.io/manage → API → CORS |
| Schema changes not showing | Restart studio (`npm run dev`) |
