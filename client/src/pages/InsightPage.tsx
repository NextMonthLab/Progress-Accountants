import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Lightbulb, Calendar, User, RefreshCw } from 'lucide-react';
import { FadeIn } from '@/components/ui/ScrollAnimation';

interface DailyInsight {
  id: number;
  title: string;
  content: string;
  category?: string;
  author?: string;
  insightDate: string;
  tags?: string[];
}

interface InsightResponse {
  success: boolean;
  insight: DailyInsight | null;
  message?: string;
}

export default function InsightPage() {
  const [insight, setInsight] = useState<DailyInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLatestInsight();
  }, []);

  const fetchLatestInsight = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/public/daily/latest');
      const data: InsightResponse = await response.json();
      
      if (data.success) {
        setInsight(data.insight);
      } else {
        setError(data.message || 'Failed to load insight');
      }
    } catch (err) {
      setError('Failed to connect to insights service');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Daily Insight | Progress Accountants - Today's Business Insight</title>
        <meta name="description" content="Get today's business insight from Progress Accountants. Daily tips, advice, and expertise for UK businesses." />
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
                <span className="block">Daily Insight.</span>
                <span className="block">Expert Knowledge.</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto"
                 style={{
                   textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)',
                   letterSpacing: '0.01em'
                 }}>
                Your daily dose of business wisdom and practical advice.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Insight Content */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900/40"></div>
        <div className="container mx-auto px-6 md:px-8 relative z-10">
          
          {loading && (
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse">
                <div className="bg-gray-800 rounded-xl p-8">
                  <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
                  <div className="h-8 bg-gray-700 rounded w-3/4 mb-6"></div>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="h-4 bg-gray-700 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-8 text-center">
                <Lightbulb className="h-16 w-16 mx-auto text-yellow-500 mb-6" />
                <h2 className="text-2xl font-semibold text-white mb-4">Daily Insights Coming Soon</h2>
                <p className="text-gray-300 mb-6">
                  Our daily business insights feature is being prepared. Check back soon for expert tips and advice.
                </p>
                <button
                  onClick={fetchLatestInsight}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Check Again
                </button>
              </div>
            </div>
          )}

          {insight && (
            <div className="max-w-4xl mx-auto">
              <FadeIn delay={0.1}>
                <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 rounded-2xl overflow-hidden shadow-lg backdrop-blur-sm">
                  <div className="p-8 md:p-12">
                    
                    {/* Insight Header */}
                    <div className="flex items-center gap-4 text-purple-400 mb-6">
                      <Lightbulb className="h-6 w-6" />
                      <span className="text-sm font-medium uppercase tracking-wider">
                        {insight.category || 'Business Insight'}
                      </span>
                    </div>

                    {/* Date and Author */}
                    <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-8">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(insight.insightDate)}
                      </div>
                      
                      {insight.author && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {insight.author}
                        </div>
                      )}
                    </div>

                    {/* Insight Title */}
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-8 leading-tight">
                      {insight.title}
                    </h2>

                    {/* Insight Content */}
                    <div className="prose prose-lg prose-invert max-w-none">
                      <div 
                        className="text-gray-300 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: insight.content }}
                      />
                    </div>

                    {/* Tags */}
                    {insight.tags && insight.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-slate-600">
                        {insight.tags.map(tag => (
                          <span key={tag} className="inline-flex items-center px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full text-sm text-purple-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </FadeIn>

              {/* Refresh Button */}
              <FadeIn delay={0.2}>
                <div className="text-center mt-12">
                  <button
                    onClick={fetchLatestInsight}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh Insight
                  </button>
                </div>
              </FadeIn>
            </div>
          )}

          {!insight && !loading && !error && (
            <div className="max-w-4xl mx-auto text-center">
              <Lightbulb className="h-16 w-16 mx-auto text-gray-500 mb-6" />
              <h2 className="text-2xl font-semibold text-white mb-4">No Insight Available</h2>
              <p className="text-gray-400 mb-6">Check back later for today's business insight.</p>
              <button
                onClick={fetchLatestInsight}
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Check for Insights
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-800 to-slate-900"></div>
        <div className="container mx-auto px-6 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Never Miss an Insight
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Get daily business insights delivered straight to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors font-medium">
                  Subscribe
                </button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}