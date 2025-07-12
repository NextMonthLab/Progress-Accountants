import React, { useEffect, useState } from 'react';
import { useRoute, Link } from 'wouter';
import { Helmet } from 'react-helmet';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import { FadeIn } from '@/components/ui/ScrollAnimation';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  metaTitle?: string;
  metaDescription?: string;
  featuredImage?: string;
  author?: string;
  authorBio?: string;
  authorImage?: string;
  tags?: string[];
  categories?: string[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogPostResponse {
  success: boolean;
  post: BlogPost;
}

export default function BlogPostPage() {
  const [match, params] = useRoute('/blog/:slug');
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params?.slug) {
      fetchPost(params.slug);
    }
  }, [params?.slug]);

  const fetchPost = async (slug: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/public/blog/${slug}`);
      const data: BlogPostResponse = await response.json();
      
      if (data.success) {
        setPost(data.post);
      } else {
        setError('Blog post not found');
      }
    } catch (err) {
      setError('Failed to load blog post');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-6 md:px-8 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-800 rounded w-1/4 mb-8"></div>
              <div className="h-12 bg-gray-800 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-800 rounded w-1/2 mb-8"></div>
              <div className="h-64 bg-gray-800 rounded mb-8"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-4 bg-gray-800 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Helmet>
          <title>Blog Post Not Found | Progress Accountants</title>
        </Helmet>
        
        <div className="container mx-auto px-6 md:px-8 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-6">Blog Post Not Found</h1>
            <p className="text-gray-400 mb-8">The blog post you're looking for doesn't exist or has been moved.</p>
            <Link href="/blog">
              <button className="relative inline-flex items-center justify-center font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-purple-500/50 border-0"
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
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>{post.metaTitle || post.title} | Progress Accountants</title>
        <meta name="description" content={post.metaDescription || post.excerpt} />
        {post.featuredImage && <meta property="og:image" content={post.featuredImage} />}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.publishedAt} />
        {post.author && <meta property="article:author" content={post.author} />}
        {post.tags && post.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
      </Helmet>

      {/* Article Content */}
      <article className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900/40"></div>
        <div className="container mx-auto px-6 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            
            {/* Back to Blog */}
            <FadeIn delay={0.1}>
              <Link href="/blog">
                <div className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-8 cursor-pointer">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </div>
              </Link>
            </FadeIn>

            {/* Article Header */}
            <FadeIn delay={0.2}>
              <header className="mb-12">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  {post.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-8">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(post.publishedAt)}
                  </div>
                  
                  {post.author && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {post.author}
                    </div>
                  )}
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {post.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full text-sm text-purple-300">
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </header>
            </FadeIn>

            {/* Featured Image */}
            {post.featuredImage && (
              <FadeIn delay={0.3}>
                <div className="mb-12">
                  <img 
                    src={post.featuredImage} 
                    alt={post.title}
                    className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
                  />
                </div>
              </FadeIn>
            )}

            {/* Article Content */}
            <FadeIn delay={0.4}>
              <div className="prose prose-lg prose-invert max-w-none mb-12">
                <div 
                  className="text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            </FadeIn>

            {/* Author Bio */}
            {post.author && post.authorBio && (
              <FadeIn delay={0.5}>
                <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 rounded-xl p-8 mb-12">
                  <h3 className="text-xl font-semibold text-white mb-4">About the Author</h3>
                  <div className="flex items-start gap-4">
                    {post.authorImage && (
                      <img 
                        src={post.authorImage} 
                        alt={post.author}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h4 className="font-medium text-white mb-2">{post.author}</h4>
                      <p className="text-gray-300">{post.authorBio}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Back to Blog CTA */}
            <FadeIn delay={0.6}>
              <div className="text-center">
                <Link href="/blog">
                  <button className="relative inline-flex items-center justify-center font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-purple-500/50 border-0"
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
                      e.currentTarget.style.background = 'linear-gradient(90deg, #6D28D9, #DB2777)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(124, 58, 237, 0.6), 0 3px 12px rgba(236, 72, 153, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(90deg, #7C3AED, #EC4899)';
                      e.currentTarget.style.boxShadow = '0 4px 14px rgba(124, 58, 237, 0.4), 0 2px 8px rgba(236, 72, 153, 0.3)';
                    }}
                  >
                    Read More Articles
                  </button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </article>
    </div>
  );
}