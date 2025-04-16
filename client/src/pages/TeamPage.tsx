import React from 'react';
import TeamMemberCard from '@/components/TeamMemberCard';
import { teamMembers } from '@/lib/teamMembers';
import { Users, ChevronDown } from 'lucide-react';

export default function TeamPage() {
  // Scroll to the team section when the "Meet Our Team" button is clicked
  const scrollToTeam = () => {
    const teamSection = document.getElementById('team-members');
    if (teamSection) {
      teamSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section 
        className="py-20 px-4 md:py-32 bg-cover bg-center relative"
        style={{ 
          backgroundColor: 'var(--navy, #0F172A)',
          backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.95))'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30 pointer-events-none"></div>
        <div className="container mx-auto relative z-10 text-center">
          <div className="inline-block p-3 rounded-full bg-orange-100 mb-6">
            <Users size={28} className="text-orange-600" style={{ color: 'var(--orange, #F59E0B)' }} />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Meet Our Team
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-10">
            Get to know the dedicated professionals at Progress Accountants who work tirelessly to help your business thrive.
          </p>
          <button 
            onClick={scrollToTeam}
            className="flex items-center mx-auto text-white hover:text-orange-200 transition-colors"
          >
            <span className="mr-2">Meet the team</span>
            <ChevronDown className="animate-bounce" />
          </button>
        </div>
      </section>

      {/* Team Introduction */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--navy, #0F172A)' }}>
              Expertise Meets Dedication
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              At Progress Accountants, our team combines extensive industry experience with a passion for personalized service. 
              We leverage the latest technology to provide efficient accounting solutions while maintaining the personal touch 
              that makes us different.
            </p>
            <div className="h-1 w-20 bg-orange-500 mx-auto" style={{ backgroundColor: 'var(--orange, #F59E0B)' }}></div>
          </div>
        </div>
      </section>

      {/* Team Members Grid */}
      <section id="team-members" className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--navy, #0F172A)' }}>
            Our Professional Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team CTA */}
      <section className="py-16 px-4 bg-orange-50">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--navy, #0F172A)' }}>
              Join Our Growing Team
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              We're always looking for talented individuals who share our passion for excellence in accounting and client service. 
              If you're interested in becoming part of the Progress Accountants family, we'd love to hear from you.
            </p>
            <a 
              href="/contact" 
              className="inline-block px-6 py-3 rounded-md text-white font-medium"
              style={{ backgroundColor: 'var(--navy, #0F172A)' }}
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}