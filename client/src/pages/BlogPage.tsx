import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, User, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import MainLayout from '@/layouts/MainLayout';
import { useLocation } from 'wouter';

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  tags: string[];
  featured: boolean;
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Our Blog</h1>
            <p className="text-xl text-muted-foreground">
              Insights, updates, and expert advice from Progress Accountants
            </p>
          </div>

          {!posts || posts.length === 0 ? (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-center">Coming Soon</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  We're preparing some great content for you. Our blog will feature insights on accounting, 
                  business growth, and industry trends.
                </p>
                <Button onClick={() => setLocation('/contact')} variant="outline">
                  Get in Touch
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-8">
              {posts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(post.publishedAt), 'MMM d, yyyy')}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.author}
                      </div>
                    </div>
                    <CardTitle className="text-2xl hover:text-primary cursor-pointer" 
                              onClick={() => setLocation(`/blog/${post.slug}`)}>
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-secondary text-xs rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Button 
                        variant="ghost" 
                        className="text-primary hover:text-primary/80"
                        onClick={() => setLocation(`/blog/${post.slug}`)}
                      >
                        Read More <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}