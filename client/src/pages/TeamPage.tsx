import React from 'react';
import { Helmet } from 'react-helmet';
import { teamMembers } from '@/lib/teamMembers';
import { TeamMemberCard } from '@/components/TeamMemberCard';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function TeamPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Helmet>
        <title>Meet Our Team | Progress Accountants</title>
        <meta name="description" content="Meet the experienced team at Progress Accountants who provide personalized accounting services tailored to your business needs." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-[var(--navy)] text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="../attached_assets/Team Photo.jpg" 
            alt="Progress Accountants Team" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Meet Our Team</h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8">
              We're a team of dedicated professionals committed to providing exceptional accounting solutions for growing businesses.
            </p>
            <p className="text-gray-300 mb-8">
              With diverse expertise in accounting, tax planning, and business advisory, we help our clients navigate their financial journey with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Team Members Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center" style={{ color: 'var(--navy)' }}>
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
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: 'var(--navy)' }}>
              Interested in Joining Our Team?
            </h2>
            <p className="text-gray-700 mb-8">
              We're always looking for talented professionals to join Progress Accountants. 
              If you're passionate about helping businesses succeed and want to be part of a forward-thinking team, we'd love to hear from you.
            </p>
            <Link href="#contact">
              <Button 
                size="lg"
                className="hover:shadow-md hover:-translate-y-[2px] transition duration-300 flex items-center gap-2"
                style={{ 
                  backgroundColor: 'var(--orange)',
                  color: 'white' 
                }}
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