import { industryFilm, industryMusic, industryConstruction } from "../assets/imagePlaceholders";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { withMemo } from "@/lib/withMemo";
import { ArrowRight, Film, Music, Building2, Users, Briefcase, HandCoins } from "lucide-react";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import filmIndustryImage from "../assets/images/film_industry.png";
import musicIndustryImage from "../assets/images/music_industry.png";
import constructionIndustryImage from "../assets/images/construction_industry.png";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

// Background pattern component
const IndustriesBgPattern = () => (
  <div className="absolute inset-0 z-0 overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-50 to-transparent"></div>
    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>
  </div>
);

// Enhanced Industry Card component
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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      className="h-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full transition-all duration-300 hover:shadow-xl border border-gray-100">
        {/* Image with gradient overlay */}
        <div className="h-48 relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent z-10 transition-opacity duration-300 ${isHovered ? 'opacity-70' : 'opacity-50'}`}></div>
          <OptimizedImage
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 transform scale-100 group-hover:scale-110"
            width={600}
            height={300}
          />
          
          {/* Icon badge */}
          <div className="absolute top-4 right-4 z-20 bg-white/90 p-2 rounded-full shadow-md">
            <Icon className="h-6 w-6 text-orange-500" />
          </div>
          
          {/* Title on image */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-gradient-to-t from-navy/80 to-transparent">
            <h3 className="text-white font-bold text-xl mb-1">{title}</h3>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">{description}</p>
          
          {/* Expertise list */}
          <div className="mb-4">
            <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Our Expertise</h4>
            <ul className="space-y-1">
              {expertise.map((item, i) => (
                <li key={i} className="flex items-center text-sm text-gray-600">
                  <span className="h-1 w-1 rounded-full bg-orange-500 mr-2"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Action button */}
          <motion.div 
            animate={{ y: isHovered ? 0 : 5, opacity: isHovered ? 1 : 0.7 }}
            transition={{ duration: 0.2 }}
          >
            <Link 
              to={
                title === "Film Industry" ? "/industries/film" : 
                title === "Music Industry" ? "/industries/music" : 
                title === "Construction" ? "/industries/construction" : 
                `/industries/${title.toLowerCase().replace(/\s+/g, '-')}`
              }
            >
              <Button 
                variant="outline" 
                className="text-sm border-orange-300 text-orange-600 hover:bg-orange-50 mt-2 group"
              >
                <span>Learn more</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
});

// Additional industries we have expertise in
const AdditionalIndustryBadge = withMemo(({ 
  icon: Icon, 
  label 
}: { 
  icon: React.ElementType, 
  label: string 
}) => (
  <div className="flex flex-col items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
      <Icon className="h-6 w-6 text-orange-500" />
    </div>
    <span className="text-navy font-medium text-center">{label}</span>
  </div>
));

// Main component
const IndustriesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Main featured industries
  const industries = [
    {
      icon: Film,
      imageSrc: filmIndustryImage,
      title: "Film Industry",
      description: "From freelance tax setups to R&D tax credits — we've worked with independent producers, directors, and studios.",
      expertise: [
        "Production company accounting",
        "Film tax relief applications",
        "Crew payments and compliance",
        "International co-production finance"
      ]
    },
    {
      icon: Music,
      imageSrc: musicIndustryImage,
      title: "Music Industry",
      description: "Touring, royalties, self-employment, label accounting — we handle the numbers so you can stay creative.",
      expertise: [
        "Royalty accounting and audits",
        "Tour financial management",
        "Studio and label accounting",
        "International income reporting"
      ]
    },
    {
      icon: Building2,
      imageSrc: constructionIndustryImage,
      title: "Construction",
      description: "We understand CIS, contractor management, and project-based finance. We've got the site and the spreadsheet covered.",
      expertise: [
        "CIS compliance and returns",
        "Project profitability analysis",
        "Subcontractor management",
        "VAT for construction services"
      ]
    }
  ];

  // Additional industries we serve
  const additionalIndustries = [
    { icon: Briefcase, label: "Professional Services" },
    { icon: Users, label: "Family Businesses" },
    { icon: HandCoins, label: "Investment Firms" }
  ];

  return (
    <section 
      ref={sectionRef}
      id="industries" 
      className="py-16 md:py-24 bg-gray-50 relative"
    >
      {/* Background pattern */}
      <IndustriesBgPattern />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block mb-4 px-4 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
              Industry Expertise
            </div>
            <h2 
              className="font-poppins font-bold text-3xl md:text-4xl mb-4"
              style={{ color: 'var(--navy)' }}
            >
              Specialists in complex industries
            </h2>
            <p style={{ color: 'var(--dark-grey)' }} className="text-lg leading-relaxed">
              We serve a wide range of small businesses, but we have deep experience in sectors that demand more than basic bookkeeping.
            </p>
          </motion.div>
          
          {/* Main Industries Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {industries.map((industry, index) => (
              <IndustryCard 
                key={index}
                title={industry.title}
                description={industry.description}
                imageSrc={industry.imageSrc}
                icon={industry.icon}
                expertise={industry.expertise}
              />
            ))}
          </div>
          
          {/* Additional Industries Section */}
          <motion.div variants={itemVariants} className="mt-16">
            <h3 className="text-center text-2xl font-bold mb-8 text-navy">We also serve</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {additionalIndustries.map((industry, index) => (
                <AdditionalIndustryBadge 
                  key={index}
                  icon={industry.icon}
                  label={industry.label}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default withMemo(IndustriesSection);
