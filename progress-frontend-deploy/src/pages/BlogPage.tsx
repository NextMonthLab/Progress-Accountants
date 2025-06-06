import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import MainLayout from '@/layouts/MainLayout';
import { useLocation } from 'wouter';

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  metaDescription: string;
  author: number;
  tenantId: string;
  status: string;
  publishedAt: string | null;
  keywords: string[];
  featuredImage?: string;
  createdAt: string;
  updatedAt: string;
};

export default function BlogPage() {
  const [, setLocation] = useLocation();

  const { data: posts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog/posts'],
    queryFn: async () => {
      const res = await fetch('/api/blog/posts');
      if (!res.ok) throw new Error('Failed to fetch blog posts');
      return await res.json();
    },
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-red-600">Blog Unavailable</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                We're currently working on our blog. Please check back soon.
              </p>
              <Button onClick={() => setLocation('/')} variant="outline">
                Return Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Blog Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-gray-900">Our Blog</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Insights, tips, and expertise from Progress Accountants to help your business thrive
          </p>
        </div>

        {/* Blog Posts */}
        {!posts || posts.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">No Posts Yet</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                We're working on creating valuable content for you. Check back soon for insights and tips.
              </p>
              <Button onClick={() => setLocation('/')} variant="outline">
                Return Home
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 max-w-4xl mx-auto">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setLocation(`/blog/${post.slug}`)}>
                <CardHeader>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.publishedAt ? format(new Date(post.publishedAt), 'MMM d, yyyy') : format(new Date(post.createdAt), 'MMM d, yyyy')}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      Progress Accountants
                    </div>
                  </div>
                  <CardTitle className="text-2xl hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  {post.excerpt && (
                    <p className="text-muted-foreground text-base leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  {post.keywords && post.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.keywords.slice(0, 3).map((keyword, index) => (
                        <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                  <Button variant="ghost" className="p-0 h-auto font-semibold group">
                    Read More
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}