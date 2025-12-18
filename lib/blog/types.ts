export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  category?: string;
  tags?: string[];
  readTime?: number;
  metaDescription?: string;
}

export interface BlogPostFrontmatter {
  title: string;
  date: string;
  author: string;
  excerpt: string;
  featuredImage?: string;
  category?: string;
  tags?: string[];
  metaDescription?: string;
}
