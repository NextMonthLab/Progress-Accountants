import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { teamMembers } from '@/lib/teamMembers';
import { TeamMemberCard } from '@/components/TeamMemberCard';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
// Team photo removed for dark theme design
import { PageHeaderSkeleton, TeamMemberSkeleton, CtaSkeleton } from '@/components/ui/skeletons';

export default function TeamPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate content loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  // Show skeleton during loading state
  if (isLoading) {
    return (
      <div className="bg-gray-900 min-h-screen">
        <Helmet>
          <title>Meet Our Team | Progress Accountants</title>
        </Helmet>

        {/* Skeleton Hero Section */}
        <section className="bg-gray-800 text-white py-16 md:py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <PageHeaderSkeleton />
          </div>
        </section>

        {/* Skeleton Team Members */}
        <section className="py-16 md:py-24 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <div className="h-8 w-64 bg-gray-700 animate-pulse mx-auto rounded-md mb-12"></div>
            </div>
            <TeamMemberSkeleton count={6} />
          </div>
        </section>

        {/* Skeleton CTA Section */}
        <section className="py-16 bg-gray-800">
          <div className="container mx-auto px-4">
            <CtaSkeleton />
          </div>
        </section>
      </div>
    );
  }

  // Return actual content once loaded
  return (
    <div className="bg-gray-900 min-h-screen">
      <Helmet>
        <title>Meet Our Team | Progress Accountants</title>
        <meta name="description" content="Meet the experienced team at Progress Accountants who provide personalized accounting services tailored to your business needs." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gray-800 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black opacity-90"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
              Meet Our Team
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              We're a team of dedicated professionals committed to providing exceptional accounting solutions for growing businesses.
            </p>
            <p className="text-gray-400 mb-8">
              With diverse expertise in accounting, tax planning, and business advisory, we help our clients navigate their financial journey with confidence.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Team Members Grid */}
      <section className="py-16 md:py-24 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center text-white">
              The People Behind Progress Accountants
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Team Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
              Interested in Joining Our Team?
            </h2>
            <p className="text-gray-300 mb-8">
              We're always looking for talented professionals to join Progress Accountants. 
              If you're passionate about helping businesses succeed and want to be part of a forward-thinking team, we'd love to hear from you.
            </p>
            <Link href="/contact">
              <Button 
                size="lg"
                className="bg-cyan-500 hover:bg-cyan-600 text-white hover:shadow-lg hover:-translate-y-[2px] transition-all duration-300 flex items-center gap-2 border-0"
              >
                <span>Contact Us</span>
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}