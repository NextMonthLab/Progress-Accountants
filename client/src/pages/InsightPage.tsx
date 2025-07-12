import { useState, useEffect } from 'react';
import { DocumentHead } from '@/components/DocumentHead';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Lightbulb, Clock, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DailyInsight {
  id: number;
  title: string;
  content: string;
  category: string | null;
  author: string | null;
  featured: boolean;
  insightDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
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
        setError(data.message || 'Failed to fetch insight');
      }
    } catch (err) {
      setError('Unable to load today\'s insight');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DocumentHead 
        title="Insight of the Day | Progress Accountants"
        description="Daily financial insights and business wisdom from our expert team. Strategic advice to help you make informed decisions for your business growth."
      />
      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-4">
                  <Lightbulb className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Insight of the{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Day
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Fresh business wisdom delivered daily. Strategic insights to power your financial decisions.
            </p>
          </div>
        </section>

        {/* Insight Content */}
        <section className="pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading today's insight...</p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
                <div className="mb-6">
                  <Clock className="h-16 w-16 text-gray-300 mx-auto" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Today's insight is being prepared
                </h2>
                <p className="text-gray-600 text-lg">
                  Check back soon for fresh business wisdom from our expert team.
                </p>
              </div>
            ) : insight ? (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5" />
                      <span className="font-medium">
                        {new Date(insight.insightDate).toLocaleDateString('en-GB', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    {insight.category && (
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                        {insight.category}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-8 md:p-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    {insight.title}
                  </h2>
                  
                  <div className="prose prose-lg max-w-none">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {insight.content}
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Lightbulb className="h-4 w-4" />
                        <span>
                          Published {formatDistanceToNow(new Date(insight.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      {insight.author && (
                        <span>by {insight.author}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
                <div className="mb-6">
                  <Clock className="h-16 w-16 text-gray-300 mx-auto" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Today's insight is being prepared
                </h2>
                <p className="text-gray-600 text-lg">
                  Check back soon for fresh business wisdom from our expert team.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-3xl font-bold text-white mb-6">
              Ready for Strategic Growth?
            </h3>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Get personalized insights for your business. Book a consultation with our expert team.
            </p>
            <button 
              onClick={() => window.Calendly?.initPopupWidget({url: 'https://calendly.com/progressaccountants'})}
              className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-full hover:bg-gray-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Book Your Strategy Session
            </button>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}