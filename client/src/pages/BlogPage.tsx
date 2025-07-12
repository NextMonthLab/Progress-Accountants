import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet';
import { Calendar, User, ArrowRight, FileText } from 'lucide-react';
import { FadeIn } from '@/components/ui/ScrollAnimation';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  featuredImage?: string;
  tags?: string[];
  categories?: string[];
}

interface BlogResponse {
  success: boolean;
  posts: BlogPost[];
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/public/blog?page=${page}&limit=10`);
      const data: BlogResponse = await response.json();
      
      if (data.success) {
        if (page === 1) {
          setPosts(data.posts);
        } else {
          setPosts(prev => [...prev, ...data.posts]);
        }
        setHasMore(data.pagination.hasMore);
      } else {
        setError('Failed to load blog posts');
      }
    } catch (err) {
      setError('Failed to connect to blog service');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Blog | Progress Accountants - Latest Business Insights</title>
        <meta name="description" content="Stay informed with the latest accounting, tax, and business insights from Progress Accountants. Expert advice for UK businesses." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80"></div>
        
        <div className="relative z-10 w-full px-6 md:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <FadeIn delay={0.1}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                  style={{
                    textShadow: '0 6px 12px rgba(0,0,0,0.7), 0 3px 6px rgba(0,0,0,0.5)',
                    letterSpacing: '-0.02em'
                  }}>
                <span className="block">Business Insights.</span>
                <span className="block">Expert Guidance.</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto"
                 style={{
                   textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)',
                   letterSpacing: '0.01em'
                 }}>
                Latest news, insights, and expert advice for UK businesses.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900/40"></div>
        <div className="container mx-auto px-6 md:px-8 relative z-10">
          
          {error && (
            <div className="max-w-4xl mx-auto mb-12">
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 text-center">
                <FileText className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">Blog Coming Soon</h2>
                <p className="text-gray-300">
                  Our blog content system is being prepared. Check back soon for the latest business insights and expert advice.
                </p>
              </div>
            </div>
          )}

          {loading && posts.length === 0 && (
            <div className="max-w-4xl mx-auto text-center">
              <div className="animate-pulse">
                <div className="h-64 bg-gray-800 rounded-xl mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-48 bg-gray-800 rounded-xl"></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {posts.length > 0 && (
            <div className="max-w-6xl mx-auto">
              {/* Featured Post */}
              {posts[0] && (
                <FadeIn delay={0.1}>
                  <div className="mb-16">
                    <Link href={`/blog/${posts[0].slug}`}>
                      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 rounded-2xl overflow-hidden shadow-lg backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300 cursor-pointer">
                        {posts[0].featuredImage && (
                          <div className="aspect-video overflow-hidden">
                            <img 
                              src={posts[0].featuredImage} 
                              alt={posts[0].title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="p-8">
                          <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {formatDate(posts[0].publishedAt)}
                            </div>
                            {posts[0].author && (
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {posts[0].author}
                              </div>
                            )}
                          </div>
                          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 hover:text-purple-400 transition-colors">
                            {posts[0].title}
                          </h2>
                          <p className="text-gray-300 text-lg mb-6 line-clamp-3">
                            {posts[0].excerpt}
                          </p>
                          <div className="flex items-center text-purple-400 font-medium">
                            Read Full Article
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </FadeIn>
              )}

              {/* Recent Posts Grid */}
              {posts.length > 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-8">Recent Articles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.slice(1).map((post, index) => (
                      <FadeIn key={post.id} delay={0.1 + (index * 0.1)}>
                        <Link href={`/blog/${post.slug}`}>
                          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 rounded-xl overflow-hidden shadow-lg backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300 cursor-pointer h-full">
                            {post.featuredImage && (
                              <div className="aspect-video overflow-hidden">
                                <img 
                                  src={post.featuredImage} 
                                  alt={post.title}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            )}
                            <div className="p-6">
                              <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(post.publishedAt)}
                                </div>
                              </div>
                              <h3 className="text-lg font-semibold text-white mb-3 hover:text-purple-400 transition-colors">
                                {post.title}
                              </h3>
                              <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                                {post.excerpt}
                              </p>
                              <div className="flex items-center text-purple-400 font-medium text-sm">
                                Read More
                                <ArrowRight className="ml-1 h-3 w-3" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </FadeIn>
                    ))}
                  </div>
                </div>
              )}

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-12">
                  <button
                    onClick={() => setPage(prev => prev + 1)}
                    disabled={loading}
                    className="relative inline-flex items-center justify-center font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-purple-500/50 border-0 disabled:opacity-50"
                    style={{ 
                      fontSize: 'clamp(16px, 2.5vw, 20px)',
                      padding: 'clamp(16px, 2.5vw, 20px) clamp(32px, 6vw, 48px)',
                      minHeight: '56px',
                      borderRadius: '9999px',
                      background: 'linear-gradient(90deg, #7C3AED, #EC4899)',
                      boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4), 0 2px 8px rgba(236, 72, 153, 0.3)',
                      color: '#FFFFFF',
                      textAlign: 'center',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.background = 'linear-gradient(90deg, #6D28D9, #DB2777)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(124, 58, 237, 0.6), 0 3px 12px rgba(236, 72, 153, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.currentTarget.style.background = 'linear-gradient(90deg, #7C3AED, #EC4899)';
                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(124, 58, 237, 0.4), 0 2px 8px rgba(236, 72, 153, 0.3)';
                      }
                    }}
                  >
                    {loading ? 'Loading...' : 'Load More Articles'}
                  </button>
                </div>
              )}

              {posts.length === 0 && !loading && !error && (
                <div className="text-center py-20">
                  <FileText className="h-16 w-16 mx-auto text-gray-500 mb-6" />
                  <h2 className="text-2xl font-semibold text-white mb-4">No Articles Yet</h2>
                  <p className="text-gray-400">Check back soon for the latest business insights and expert advice.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}