import { useEffect, useState } from "react";
import { withMemo } from "@/lib/withMemo";
import { ArrowRight, Film, Music, Building2, Users, Briefcase, Home, HandCoins } from "lucide-react";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import filmIndustryImage from "../assets/images/film_industry.png";
import musicIndustryImage from "../assets/images/music_industry.png";
import constructionIndustryImage from "../assets/images/construction_industry.png";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

// Memoized and simplified Industry Card component
const IndustryCard = withMemo(({
  title,
  description,
  imageSrc,
  icon: Icon,
  expertise
}: {
  title: string;
  description: string;
  imageSrc: string;
  icon: React.ElementType;
  expertise: string[];
}) => {
  return (
    <div className="bg-[#101218] border border-[#2E2F3B] rounded-xl shadow-md overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Image with simplified overlay */}
      <div className="h-48 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent z-10"></div>
        <OptimizedImage
          src={imageSrc}
          alt={`${title} accounting services - specialist financial advice for ${title.toLowerCase()} professionals and businesses`}
          className="w-full h-full object-cover"
          width={600}
          height={300}
        />
        
        {/* Icon badge */}
        <div className="absolute top-4 right-4 z-20 bg-white p-2 rounded-full">
          <Icon className="h-5 w-5 text-[#7B3FE4]" />
        </div>
        
        {/* Title on image */}
        <div className="absolute bottom-4 left-4 z-20">
          <h3 className="text-white font-bold text-xl">{title}</h3>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <p className="text-gray-300 mb-4 text-sm">{description}</p>
        
        {/* Simplified expertise list */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-white mb-2">Our Expertise:</h4>
          <ul className="space-y-1">
            {expertise.slice(0, 3).map((item, i) => (
              <li key={i} className="flex items-center text-sm text-gray-300">
                <span className="h-1 w-1 rounded-full bg-[#7B3FE4] mr-2"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Action button */}
        <Link 
          to={`/industries/${title.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <Button 
            variant="outline" 
            size="sm"
            className="text-sm border-[#7B3FE4] text-[#7B3FE4] hover:bg-[#7B3FE4]/10"
          >
            <span>Learn more</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
});

// Simplified Additional Industry Badge
const AdditionalIndustryBadge = withMemo(({ 
  icon: Icon, 
  label 
}: { 
  icon: React.ElementType, 
  label: string 
}) => (
  <div className="flex items-center gap-3 p-3 bg-[#101218] border border-[#2E2F3B] rounded-lg shadow-sm">
    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#7B3FE4]/20 to-[#3FA4E4]/20 flex items-center justify-center">
      <Icon className="h-5 w-5 text-[#7B3FE4]" />
    </div>
    <span className="text-gray-300 font-medium">{label}</span>
  </div>
));

// Main component
const IndustriesSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simple visibility detection for the section
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('industries');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  // Main featured industries
  const industries = [
    {
      icon: Film,
      imageSrc: filmIndustryImage,
      title: "Film Industry",
      description: "From freelance creatives to studio productions—we know how to unlock Film Tax Relief and simplify your finances.",
      expertise: [
        "Production company accounting",
        "Tax relief applications",
        "Crew compliance"
      ]
    },
    {
      icon: Music,
      imageSrc: musicIndustryImage,
      title: "Music Industry",
      description: "From royalty audits to tour finances—financial clarity for artists, producers, and labels.",
      expertise: [
        "Royalty & licensing audits",
        "Tour budgeting",
        "Studio & label accounting"
      ]
    },
    {
      icon: Building2,
      imageSrc: constructionIndustryImage,
      title: "Construction",
      description: "CIS returns, project cash flow, and subcontractor pay—handled by sector specialists.",
      expertise: [
        "CIS tax compliance",
        "Profitability tracking",
        "Contractor finance systems"
      ]
    }
  ];

  // Additional industries we serve
  const additionalIndustries = [
    { icon: Briefcase, label: "Digital & Technology" },
    { icon: Home, label: "Property & Real Estate" },
    { icon: Users, label: "Family Businesses" }
  ];

  return (
    <section 
      id="industries" 
      className="py-16 md:py-20 bg-black"
    >
      <div className="container mx-auto px-6 md:px-8">
        <div className={`text-center max-w-3xl mx-auto mb-12 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <span className="inline-block mb-3 px-4 py-1 rounded-full bg-purple-900/30 text-purple-300 text-sm font-medium border border-purple-700/30">
            Industry Expertise
          </span>
          <h2 className="font-bold text-3xl md:text-4xl mb-4 bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] bg-clip-text text-transparent">
            Specialists in complex industries
          </h2>
          <p className="text-lg text-gray-300">
            We serve businesses of all types, with deep experience in sectors that demand more than basic bookkeeping.
          </p>
        </div>
        
        {/* Main Industries Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {industries.map((industry, index) => (
            <div 
              key={index} 
              className={`transition-all duration-500 delay-${index * 100} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
              <IndustryCard 
                title={industry.title}
                description={industry.description}
                imageSrc={industry.imageSrc}
                icon={industry.icon}
                expertise={industry.expertise}
              />
            </div>
          ))}
        </div>
        
        {/* Additional Industries Section */}
        <div className={`mt-12 transition-all duration-500 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h3 className="text-center text-xl font-semibold mb-6 bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] bg-clip-text text-transparent">We also serve</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {additionalIndustries.map((industry, index) => (
              <AdditionalIndustryBadge 
                key={index}
                icon={industry.icon}
                label={industry.label}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default withMemo(IndustriesSection);