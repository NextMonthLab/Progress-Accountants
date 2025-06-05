import { useEffect } from 'react';
import { useLocation } from 'wouter';

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: number;
  tenantId: string;
  status: string;
  publishedAt: string;
  keywords: string[];
  featuredImage?: string;
  createdAt: string;
  updatedAt: string;
};

export default function BlogPage() {
  const [, setLocation] = useLocation();

  // Redirect to admin blog generator page
  useEffect(() => {
    setLocation('/admin/content/blog-posts');
  }, [setLocation]);

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
                        {post.publishedAt ? format(new Date(post.publishedAt), 'MMM d, yyyy') : format(new Date(post.createdAt), 'MMM d, yyyy')}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        Progress Accountants
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