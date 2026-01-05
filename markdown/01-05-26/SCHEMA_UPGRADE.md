# Enhanced Sanity Schema for Technical Blog Posts

Your current schema has basic `code` blocks, but for deep WebGPU/Zig posts, you'll want:

---

## Recommended Schema Enhancements

### 1. Code Block with Language + Filename
```typescript
defineField({
  name: 'body',
  title: 'Body',
  type: 'array',
  of: [
    {type: 'block'},
    {type: 'image', options: {hotspot: true}},
    {
      type: 'code',
      options: {
        language: 'zig',
        languageAlternatives: [
          {title: 'Zig', value: 'zig'},
          {title: 'WGSL', value: 'wgsl'},
          {title: 'GLSL', value: 'glsl'},
          {title: 'TypeScript', value: 'typescript'},
          {title: 'JavaScript', value: 'javascript'},
          {title: 'Rust', value: 'rust'},
          {title: 'C', value: 'c'},
          {title: 'Shell', value: 'bash'},
        ],
        withFilename: true,  // Shows filename above code block
      }
    }
  ]
})
```

### 2. Custom Callout/Note Block (for ⚠️ warnings, tips, etc.)
```typescript
{
  type: 'object',
  name: 'callout',
  title: 'Callout',
  fields: [
    {
      name: 'type',
      type: 'string',
      options: {
        list: ['note', 'warning', 'tip', 'danger']
      }
    },
    {
      name: 'content',
      type: 'array',
      of: [{type: 'block'}]
    }
  ],
  preview: {
    select: {type: 'type', content: 'content'},
    prepare({type}) {
      return {title: `${type?.toUpperCase()} Callout`}
    }
  }
}
```

### 3. Related Posts Reference
```typescript
defineField({
  name: 'relatedPosts',
  title: 'Related Posts',
  type: 'array',
  of: [{type: 'reference', to: [{type: 'post'}]}]
})
```

---

## Updated Full Schema

Replace `schemaTypes/post.ts` in your studio with:

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
      options: {source: 'title', maxLength: 96},
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Brief summary for previews (1-2 sentences)'
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
      title: 'Cover Image',
      type: 'image',
      options: {hotspot: true}
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {type: 'block'},
        {type: 'image', options: {hotspot: true}},
        {
          type: 'code',
          options: {
            language: 'typescript',
            languageAlternatives: [
              {title: 'Zig', value: 'zig'},
              {title: 'WGSL', value: 'wgsl'},
              {title: 'GLSL', value: 'glsl'},
              {title: 'TypeScript', value: 'typescript'},
              {title: 'JavaScript', value: 'javascript'},
              {title: 'Rust', value: 'rust'},
              {title: 'C', value: 'c'},
              {title: 'Bash', value: 'bash'},
            ],
            withFilename: true
          }
        },
        {
          type: 'object',
          name: 'callout',
          title: 'Callout',
          fields: [
            {
              name: 'type',
              title: 'Type',
              type: 'string',
              options: {
                list: [
                  {title: 'Note', value: 'note'},
                  {title: 'Warning', value: 'warning'},
                  {title: 'Tip', value: 'tip'},
                  {title: 'Danger', value: 'danger'}
                ]
              },
              initialValue: 'note'
            },
            {
              name: 'content',
              title: 'Content',
              type: 'array',
              of: [{type: 'block'}]
            }
          ],
          preview: {
            select: {type: 'type'},
            prepare({type}) {
              const icons = {note: 'ℹ️', warning: '⚠️', tip: '💡', danger: '🚨'}
              return {title: `${icons[type] || '📝'} ${type?.toUpperCase() || 'Callout'}`}
            }
          }
        }
      ]
    }),
    defineField({
      name: 'relatedPosts',
      title: 'Related Posts',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'post'}]}],
      description: 'Link to related posts for bidirectional navigation'
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'publishedAt',
      media: 'image'
    }
  }
})
```

---

## After Updating Schema

1. Replace the schema file in `portfolio_2026_studio/schemaTypes/post.ts`
2. Restart studio: `npm run dev`
3. Install code-input plugin if not already:
   ```bash
   npm install @sanity/code-input
   ```
4. Add to `sanity.config.ts`:
   ```typescript
   import {codeInput} from '@sanity/code-input'
   
   export default defineConfig({
     // ... other config
     plugins: [codeInput()],
   })
   ```

---

## Frontend Rendering

You'll also need to update the SvelteKit side to render:
- Code blocks with syntax highlighting (use `shiki` or `prism`)
- Custom callout blocks
- Related posts links

Want me to help with the frontend rendering after you update the schema?
