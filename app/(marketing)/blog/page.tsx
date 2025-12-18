import { Metadata } from 'next';
import Link from 'next/link';
import { getAllBlogPosts } from '@/lib/blog/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Calendar, Clock, User } from 'lucide-react';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Blog | StoryScorer',
  description: 'Learn about user stories, INVEST criteria, acceptance criteria, and best practices for business analysts.',
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { search?: string; page?: string };
}) {
  const allPosts = await getAllBlogPosts();
  const searchQuery = searchParams.search?.toLowerCase() || '';
  const currentPage = parseInt(searchParams.page || '1', 10);
  const postsPerPage = 10;

  // Filter posts by search query
  const filteredPosts = searchQuery
    ? allPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery) ||
          post.excerpt.toLowerCase().includes(searchQuery) ||
          post.content.toLowerCase().includes(searchQuery) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(searchQuery))
      )
    : allPosts;

  // Paginate
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Insights, tips, and best practices for writing better user stories and
          improving your requirements process.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <form action="/blog" className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              name="search"
              placeholder="Search blog posts..."
              defaultValue={searchQuery}
              className="pl-10"
            />
          </div>
        </form>
      </div>

      {/* Blog Posts Grid */}
      {paginatedPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            {searchQuery
              ? `No posts found matching "${searchQuery}"`
              : 'No blog posts yet. Check back soon!'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {paginatedPosts.map((post) => (
              <Card key={post.slug} className="flex flex-col hover:shadow-lg transition-shadow">
                <Link href={`/blog/${post.slug}`}>
                  {post.featuredImage ? (
                    <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5 rounded-t-lg flex items-center justify-center">
                      <Calendar className="h-16 w-16 text-primary/30" />
                    </div>
                  )}
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.category && (
                        <Badge variant="secondary">{post.category}</Badge>
                      )}
                      {post.tags?.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto pt-4 border-t">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(post.date)}</span>
                      </div>
                      {post.readTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{post.readTime} min read</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4">
              {currentPage > 1 && (
                <Button
                  asChild
                  variant="outline"
                  href={`/blog?page=${currentPage - 1}${searchQuery ? `&search=${searchQuery}` : ''}`}
                >
                  Previous
                </Button>
              )}
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              {currentPage < totalPages && (
                <Button
                  asChild
                  variant="outline"
                  href={`/blog?page=${currentPage + 1}${searchQuery ? `&search=${searchQuery}` : ''}`}
                >
                  Next
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

