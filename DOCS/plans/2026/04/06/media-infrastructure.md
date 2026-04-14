---
created: 2026-04-11
category: plan
tags: [media, photos, video, mux, animation]
---

# Media Infrastructure — Color-Accurate, Batteries-Included

## Overview
Performance-first media layer: photos (wide-gamut, HDR), videos (Mux), animations (GIF/Lottie), project showcases — all from Convex, managed from /admin.

## 5 Pillars
1. **Color-Accurate Photo Pipeline** — AVIF (P3) → WebP (sRGB) → JPEG, srcset, blur-up, EXIF
2. **Expanded Video (Mux)** — Per-project videos, device frames, chapters, poster frames
3. **Animation & GIF System** — GIFs, Lottie/Rive, live embeds, unified AnimationPlayer
4. **Project Showcase System** — Unified table tying media to projects
5. **Common Lisp Moat** — Build-time DSL for media transformations

## Magazine Layouts
8 switchable layouts: editorial, masonry, filmstrip, longform, grid, list, hero-split, carousel

## Performance Budgets
- LCP < 2.5s, FCP < 1.5s, CLS < 0.1
- Total initial payload < 3MB
- Simultaneous: 1 video, 3 GIFs, 2 iframes

## New Convex Tables
- `mediaAssets` — photos, videos, GIFs, Lottie, embeds
- `projectShowcases` — media tied to projects with tiers
- `photoCollections` — grouped photo sets