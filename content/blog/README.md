# Blog Content Directory

This directory contains all blog posts in Markdown format with frontmatter.

## Blog Post Format

Each blog post should follow this structure:

```markdown
---
title: "Your Blog Post Title"
date: "YYYY-MM-DD"
author: "Author Name"
excerpt: "Short description for the blog listing page"
category: "Category Name"
tags: ["tag1", "tag2", "tag3"]
metaDescription: "SEO meta description for search engines"
featuredImage: "/images/blog/your-image.jpg" (optional)
---

Your blog post content in Markdown format...
```

## Required Frontmatter Fields

- `title`: The blog post title
- `date`: Publication date in YYYY-MM-DD format
- `author`: Author name
- `excerpt`: Short description (used in blog listing)
- `metaDescription`: SEO meta description

## Optional Frontmatter Fields

- `category`: Post category (e.g., "Best Practices", "INVEST Criteria")
- `tags`: Array of tags for filtering and related posts
- `featuredImage`: Path to featured image

## File Naming

- Use kebab-case for filenames
- Example: `my-blog-post-title.md`
- The filename (without extension) becomes the URL slug

## Markdown Support

The blog system supports standard Markdown syntax:
- Headers (# ## ###)
- Bold (**text**)
- Italic (*text*)
- Links ([text](url))
- Lists (- item)
- Code blocks (`code`)

For production, consider installing a proper markdown library like `react-markdown` or `marked` for better rendering.

