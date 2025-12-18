import fs from "fs";
import path from "path";
import { BlogPost, BlogPostFrontmatter } from "./types";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

/**
 * Parse frontmatter from markdown file
 * Simple parser - in production, use gray-matter
 */
function parseFrontmatter(content: string): {
  frontmatter: BlogPostFrontmatter;
  body: string;
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    throw new Error("Invalid frontmatter format");
  }

  const frontmatterText = match[1];
  const body = match[2];

  const frontmatter: Partial<BlogPostFrontmatter> = {};

  frontmatterText.split("\n").forEach((line) => {
    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();

      // Remove quotes if present
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (key === "tags") {
        // Handle tags as array: ["tag1", "tag2"] or "tag1, tag2"
        if (value.startsWith("[") && value.endsWith("]")) {
          // Array format
          const tagsStr = value.slice(1, -1);
          frontmatter.tags = tagsStr
            .split(",")
            .map((t) => t.trim().replace(/^["']|["']$/g, ""))
            .filter((t) => t.length > 0);
        } else {
          // Comma-separated format
          frontmatter.tags = value
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t.length > 0);
        }
      } else {
        (frontmatter as Record<string, unknown>)[key] = value;
      }
    }
  });

  return {
    frontmatter: frontmatter as BlogPostFrontmatter,
    body,
  };
}

/**
 * Calculate reading time (words per minute)
 */
function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Get all blog posts
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    if (!fs.existsSync(BLOG_DIR)) {
      return [];
    }

    const files = fs.readdirSync(BLOG_DIR);
    const posts: BlogPost[] = [];

    for (const file of files) {
      if (file.endsWith(".md") || file.endsWith(".mdx")) {
        const filePath = path.join(BLOG_DIR, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");

        try {
          const { frontmatter, body } = parseFrontmatter(fileContent);
          const slug = file.replace(/\.(md|mdx)$/, "");

          posts.push({
            slug,
            ...frontmatter,
            content: body,
            readTime: calculateReadTime(body),
          });
        } catch (error) {
          console.error(`Error parsing ${file}:`, error);
        }
      }
    }

    // Sort by date (newest first)
    return posts.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch (error) {
    console.error("Error reading blog posts:", error);
    return [];
  }
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const mdPath = path.join(BLOG_DIR, `${slug}.md`);
    const mdxPath = path.join(BLOG_DIR, `${slug}.mdx`);

    let filePath: string | null = null;
    if (fs.existsSync(mdPath)) {
      filePath = mdPath;
    } else if (fs.existsSync(mdxPath)) {
      filePath = mdxPath;
    }

    if (!filePath) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { frontmatter, body } = parseFrontmatter(fileContent);

    return {
      slug,
      ...frontmatter,
      content: body,
      readTime: calculateReadTime(body),
    };
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    return null;
  }
}

/**
 * Get related posts (by category or tags)
 */
export async function getRelatedPosts(
  currentPost: BlogPost,
  limit: number = 3
): Promise<BlogPost[]> {
  const allPosts = await getAllBlogPosts();

  return allPosts
    .filter((post) => {
      if (post.slug === currentPost.slug) return false;

      // Match by category first
      if (currentPost.category && post.category === currentPost.category) {
        return true;
      }

      // Then match by tags
      if (currentPost.tags && post.tags) {
        return currentPost.tags.some((tag) => post.tags?.includes(tag));
      }

      return false;
    })
    .slice(0, limit);
}
