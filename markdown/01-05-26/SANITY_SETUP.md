# Sanity Studio Setup Guide

## Your Studio Location
`~/Desktop/portfolio_2026_studio`

---

## Step 1: Add Post Schema

Create/replace `schemaTypes/post.ts`:

```typescript
import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime'
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'}
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image'
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {type: 'block'},
        {type: 'image'},
        {type: 'code'}
      ]
    })
  ]
})
```

---

## Step 2: Register Schema

Update `schemaTypes/index.ts`:

```typescript
import post from './post'
export const schemaTypes = [post]
```

---

## Step 3: Restart Studio

```bash
cd ~/Desktop/portfolio_2026_studio
npm run dev
```

Open `http://localhost:3333` - "Post" should appear in sidebar!

---

## Step 4: Migrate Existing Notes

Create these 5 posts in Sanity Studio:

### 1. WebGPU vs WebGL: A Practical Comparison
- **Slug**: `20250105-webgpu-vs-webgl`
- **Date**: `2025-01-05`
- **Tags**: `webgpu`, `webgl`, `graphics`, `performance`
- **Excerpt**: After six months of WebGPU in production, here are my honest thoughts on when to use each API.

### 2. Raymarching from Scratch in WGSL
- **Slug**: `20241220-raymarching-basics`
- **Date**: `2024-12-20`
- **Tags**: `raymarching`, `wgsl`, `shaders`, `tutorial`
- **Excerpt**: Building a raymarcher entirely in WebGPU compute shaders. No Three.js, no abstractions.

### 3. Introduction to Compute Shaders
- **Slug**: `20241115-compute-shaders`
- **Date**: `2024-11-15`
- **Tags**: `webgpu`, `compute`, `gpgpu`, `tutorial`
- **Excerpt**: Compute shaders unlock the full power of the GPU for non-graphics workloads.

### 4. Why I Switched from React to SvelteKit in 2024
- **Slug**: `20241030-svelte-vs-react-2024`
- **Date**: `2024-10-30`
- **Tags**: `svelte`, `react`, `framework`, `opinion`
- **Excerpt**: After 8 years of React, I moved my portfolio to SvelteKit. Here is what surprised me.

### 5. The Return of ASCII Aesthetics in Web Design
- **Slug**: `20240915-ascii-aesthetics`
- **Date**: `2024-09-15`
- **Tags**: `design`, `brutalism`, `ascii`, `aesthetics`
- **Excerpt**: Why the most futuristic interfaces look like 1970s terminals.

---

## Step 5: Verify in SvelteKit

```bash
cd ~/Desktop/portfolio_2026
npm run dev
# Go to http://localhost:5173/notes
```

Your posts should appear!

---

## Deployment Sequence

1. **Deploy Studio**: `npx sanity deploy` (in studio folder)
2. **Deploy Site**: `npx vercel` (in portfolio folder)
3. **Add CORS**: sanity.io/manage → API → add your Vercel URL
4. **Custom Domain**: Vercel dashboard → Domains
