# Design: Data-Driven Portfolio Overhaul

## Architecture Overview

> Migration note: this design predates the Astro host inversion. The later `astro-full-migration-foundation` change reverses the earlier "remove Sanity" assumption and restores Sanity as the editorial content boundary.

This change touches four layers: **Presentation** (Svelte sections), **Admin** (admin editors + controls), **State** (Convex subscriptions), and **Data** (Convex tables + mutations).

```
┌─────────────────────────────────────────────────────┐
│ Presentation Layer (Svelte)                         │
│  LabsSection    ─ Remove legend + browser sections  │
│  HeroSection    ─ AsciiDonut + AsciiWave + cases    │
│  BlogSection    ─ Now has seeded data                │
│  CvSection      ─ Convex-driven HTML (replaces PDF) │
│  AsciiWave.svelte ─ New wave ASCII animation        │
│  TypographyControls.svelte ─ New shared component   │
├─────────────────────────────────────────────────────┤
│ Admin Layer                                         │
│  InlineSectionConfig ─ Typography + ASCII toggles   │
│  HeroCaseStudyAdmin  ─ New case study editor        │
│  TypographyControls  ─ Reusable per-section control │
│  section-editors.ts  ─ Hero case study registration │
├─────────────────────────────────────────────────────┤
│ State Layer                                         │
│  heroConfig       ─ showAsciiWave subscription      │
│  heroCaseStudies  ─ New real-time subscription      │
│  cvProfile        ─ Nav name subscription in layout │
│  blogPosts        ─ Now has seeded data             │
├─────────────────────────────────────────────────────┤
│ Data Layer (Convex)                                 │
│  heroConfig       ─ + showAsciiWave field           │
│  heroCaseStudies  ─ New table with CRUD             │
│  blogPosts        ─ Seeded with 3 sample posts      │
│  seedAll.ts       ─ + seedBlog, seedHeroCaseStudies │
└─────────────────────────────────────────────────────┘
```

## Key Design Decisions

### Typography in section config, not dedicated tables
Typography settings for non-hero sections live in `pages.sections[].config.typography` (which uses `v.any()`). This avoids schema changes per section type and uses the existing `updateSectionConfig` mutation.

### Case studies get their own table
`heroCaseStudies` follows the existing pattern where every content type has a Convex table with CRUD. This keeps admin editors consistent and enables drag-reorder, visibility toggle, and inline editing.

### CV renders HTML from existing Convex data
The `cvEntries`, `cvProfile`, `cvLanguages`, `cvSections` tables already exist with structured data. CvSection just needs to subscribe and render instead of embedding a PDF. PDF download link stays as fallback.

### Navigation name from cvProfile
The header name currently reads from a static import. Since `cvProfile.name` is already editable from admin, subscribing to it in `+layout.svelte` makes the nav name data-driven with zero new tables.

### AsciiWave follows AsciiDonut architecture exactly
Same `requestAnimationFrame` loop, same `prefersReducedMotion` handling, same character set depth mapping, same responsive sizing. Consistency reduces maintenance.
