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
  const [isLoading, setIsLoading] = useState(false);
  
  // No loading delays for instant rendering
  // Show skeleton during loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Helmet>
          <title>Meet Our Team | Progress Accountants</title>
        </Helmet>

        {/* Skeleton Hero Section */}
        <section className="py-16 relative overflow-hidden bg-black">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-800"></div>
          <div className="container mx-auto px-12 md:px-16 relative z-10">
            <PageHeaderSkeleton />
          </div>
        </section>

        {/* Skeleton Team Members */}
        <section className="py-16 relative overflow-hidden bg-black">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-800"></div>
          <div className="container mx-auto px-12 md:px-16 relative z-10">
            <div className="mb-8">
              <div className="h-8 w-64 bg-slate-700 animate-pulse mx-auto rounded-md mb-12"></div>
            </div>
            <TeamMemberSkeleton count={6} />
          </div>
        </section>

        {/* Skeleton CTA Section */}
        <section className="py-16 relative overflow-hidden bg-black">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-800"></div>
          <div className="container mx-auto px-12 md:px-16 relative z-10">
            <CtaSkeleton />
          </div>
        </section>
      </div>
    );
  }

  // Return actual content once loaded
  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Meet Our Team | Progress Accountants</title>
        <meta name="description" content="Meet the experienced team at Progress Accountants who provide personalized accounting services tailored to your business needs." />
      </Helmet>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://res.cloudinary.com/drl0fxrkq/image/upload/v1747742829/P1013106-Enhanced-NR_adzlje.jpg)'
          }}
        ></div>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-slate-900/40"></div>
        <div className="container mx-auto px-12 md:px-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Meet Our{" "}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Expert Team</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Our experienced professionals bring decades of combined expertise in accounting, tax strategy, and business advisory—helping UK businesses grow with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Team Members Grid */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-12 md:px-16 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                The People Behind Progress
              </h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                A passionate, people-first team—driven to deliver exceptional service and strategic insight.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Team Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-12 md:px-16 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Interested in Joining Our Team?
            </h2>
            <p className="text-slate-300 mb-8 text-lg leading-relaxed">
              We're always on the lookout for passionate professionals to join our growing firm. If you care about small business success and want to be part of a forward-thinking team, we'd love to hear from you.
            </p>
            <Link href="/contact">
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-1 transition-all duration-0 font-medium">
                <span>Contact Us</span>
                <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}