import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet';
import { Building2, TrendingUp, Award, ArrowRight, FileText } from 'lucide-react';
import { FadeIn } from '@/components/ui/ScrollAnimation';

interface CaseStudy {
  id: number;
  slug: string;
  title: string;
  clientName?: string;
  industry?: string;
  challenge: string;
  solution: string;
  results: string;
  testimonial?: string;
  testimonialAuthor?: string;
  testimonialRole?: string;
  featuredImage?: string;
  tags?: string[];
  publishedAt: string;
}

interface CaseStudiesResponse {
  success: boolean;
  caseStudies: CaseStudy[];
}

export default function CaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/public/case-studies');
      const data: CaseStudiesResponse = await response.json();
      
      if (data.success) {
        setCaseStudies(data.caseStudies);
      } else {
        setError('Failed to load case studies');
      }
    } catch (err) {
      setError('Failed to connect to case studies service');
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
        <title>Case Studies | Progress Accountants - Client Success Stories</title>
        <meta name="description" content="Discover how Progress Accountants has helped businesses achieve their financial goals. Real client success stories and case studies." />
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
                <span className="block">Client Success.</span>
                <span className="block">Proven Results.</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto"
                 style={{
                   textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)',
                   letterSpacing: '0.01em'
                 }}>
                Real case studies showcasing how we help businesses thrive.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Case Studies Content */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900/40"></div>
        <div className="container mx-auto px-6 md:px-8 relative z-10">
          
          {error && (
            <div className="max-w-4xl mx-auto mb-12">
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 text-center">
                <FileText className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">Case Studies Coming Soon</h2>
                <p className="text-gray-300">
                  Our client success stories are being prepared. Check back soon to see how we've helped businesses achieve their goals.
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="max-w-6xl mx-auto">
              <div className="animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-96 bg-gray-800 rounded-xl"></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {caseStudies.length > 0 && (
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {caseStudies.map((caseStudy, index) => (
                  <FadeIn key={caseStudy.id} delay={0.1 + (index * 0.1)}>
                    <Link href={`/case-studies/${caseStudy.slug}`}>
                      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 rounded-xl overflow-hidden shadow-lg backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300 cursor-pointer h-full">
                        {caseStudy.featuredImage && (
                          <div className="aspect-video overflow-hidden">
                            <img 
                              src={caseStudy.featuredImage} 
                              alt={caseStudy.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                            {caseStudy.industry && (
                              <div className="flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                {caseStudy.industry}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Award className="h-3 w-3" />
                              Success Story
                            </div>
                          </div>
                          
                          <h3 className="text-xl font-bold text-white mb-3 hover:text-purple-400 transition-colors">
                            {caseStudy.title}
                          </h3>
                          
                          {caseStudy.clientName && (
                            <p className="text-purple-300 font-medium mb-3">
                              Client: {caseStudy.clientName}
                            </p>
                          )}
                          
                          <div className="space-y-3 mb-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-300 mb-1">Challenge</h4>
                              <p className="text-gray-400 text-sm line-clamp-2">
                                {caseStudy.challenge}
                              </p>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-gray-300 mb-1">Results</h4>
                              <p className="text-green-400 text-sm line-clamp-2">
                                {caseStudy.results}
                              </p>
                            </div>
                          </div>
                          
                          {caseStudy.testimonial && (
                            <div className="bg-slate-700/30 rounded-lg p-3 mb-4">
                              <p className="text-gray-300 text-sm italic line-clamp-2">
                                "{caseStudy.testimonial}"
                              </p>
                              {caseStudy.testimonialAuthor && (
                                <p className="text-xs text-gray-400 mt-2">
                                  - {caseStudy.testimonialAuthor}
                                  {caseStudy.testimonialRole && `, ${caseStudy.testimonialRole}`}
                                </p>
                              )}
                            </div>
                          )}
                          
                          <div className="flex items-center text-purple-400 font-medium text-sm">
                            Read Full Case Study
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </FadeIn>
                ))}
              </div>

              {caseStudies.length === 0 && !loading && !error && (
                <div className="text-center py-20">
                  <TrendingUp className="h-16 w-16 mx-auto text-gray-500 mb-6" />
                  <h2 className="text-2xl font-semibold text-white mb-4">No Case Studies Yet</h2>
                  <p className="text-gray-400">Check back soon for inspiring client success stories.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-800 to-slate-900"></div>
        <div className="container mx-auto px-6 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Create Your Success Story?
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Join our growing list of successful clients and transform your business finances.
              </p>
              <Link href="/contact">
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
                  Start Your Success Story
                </button>
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}