import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { withMemo } from "@/lib/withMemo";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { ArrowRight, CheckCircle, Film, PlayCircle, ArrowDown, Clock, Banknote, Award, Users } from "lucide-react";
import { FadeIn } from "@/components/ui/ScrollAnimation";

// Import film industry images
import filmSetCinematicImg from "../assets/images/film_set_cinematic.png";
import filmProductionImg from "../assets/images/film_industry.png";
import filmMakeupArtistImg from "../assets/images/film_makeup_artist.png";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } }
};

// Feature card component
const FeatureCard = ({
  icon: Icon,
  title,
  description,
  accentColor = "bg-purple-500"
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  accentColor?: string;
}) => (
  <motion.div
    variants={itemVariants}
    className="relative bg-gray-900 rounded-xl shadow-md border border-gray-800 p-6 hover:shadow-lg hover:shadow-purple-500/25 transition-all"
  >
    <div className={`absolute top-0 left-0 w-full h-1.5 ${accentColor} rounded-t-xl`}></div>
    <div className="flex items-start">
      <div className="mr-4 mt-1">
        <div className="p-3 rounded-full bg-purple-900/20">
          <Icon className="h-6 w-6 text-purple-400" />
        </div>
      </div>
      <div>
        <h3 className="font-bold text-xl mb-2 text-white">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
    </div>
  </motion.div>
);

// Testimonial component
const Testimonial = ({ quote, author, role }: { quote: string; author: string; role: string }) => (
  <motion.div
    variants={itemVariants}
    className="bg-gray-900 p-6 rounded-xl shadow-md border border-gray-800"
  >
    <div className="mb-4">
      <svg className="h-10 w-10 text-purple-400 opacity-80" fill="currentColor" viewBox="0 0 32 32">
        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
      </svg>
    </div>
    <p className="text-gray-300 mb-4 italic">{quote}</p>
    <div className="flex items-center">
      <div className="ml-0">
        <p className="font-semibold text-white">{author}</p>
        <p className="text-sm text-gray-400">{role}</p>
      </div>
    </div>
  </motion.div>
);

// Call to action section component with makeup artist image 
const CTASection = () => (
  <motion.div
    variants={itemVariants}
    className="rounded-2xl p-8 md:p-12 text-white relative overflow-hidden"
  >
    {/* Background image with overlay for CTA */}
    <div className="absolute inset-0 z-0">
      <OptimizedImage
        src={filmMakeupArtistImg}
        alt="Film makeup artist in studio"
        width={1920}
        height={1080}
        className="w-full h-full object-cover"
      />
      {/* Darker overlay for better text contrast */}
      <div className="absolute inset-0 bg-navy opacity-80"></div>
    </div>
    <div className="relative z-10">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
        🎬 Ready to streamline your production finances?
      </h2>
      <p className="text-white text-lg max-w-2xl mb-8">
        Whether you're applying for Film Tax Relief or planning your next pitch, book a call with our team and see how Progress can support your next project.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={() => {
            window.open('https://calendly.com/progress-accountants/free-consultation-progress-accountants', '_blank', 'width=700,height=800,resizable=yes,scrollbars=yes');
          }}
          size="lg" 
          className="bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] hover:shadow-lg hover:shadow-purple-500/25 text-white border-none font-medium cursor-pointer"
        >
          Book Consultation
        </Button>
        <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-medium">
          View Our Services
        </Button>
      </div>
    </div>
  </motion.div>
);

// Client types component
const ClientType = ({ icon: Icon, label }: { icon: React.ElementType, label: string }) => (
  <motion.div
    variants={itemVariants}
    className="flex flex-col items-center p-5 bg-gray-900 rounded-xl shadow-sm hover:shadow-md hover:shadow-purple-500/25 transition-all text-center border border-gray-800"
  >
    <div className="p-3 rounded-full bg-purple-900/20 mb-4">
      <Icon className="h-6 w-6 text-purple-400" />
    </div>
    <span className="font-medium text-white">{label}</span>
  </motion.div>
);

const FilmIndustryPage = () => {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-black pb-20">
      {/* Gold Standard Hero Section */}
      <section 
        ref={headerRef}
        className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-slate-900"
      >
        {/* Cinematic Full-Width Background with Smart Focal Points */}
        <div className="absolute inset-0 w-full h-full">
          {/* Desktop/Tablet Background - Adjusted for Head Visibility */}
          <div 
            className="absolute inset-0 w-full h-full hidden sm:block"
            style={{
              backgroundImage: `url(${filmSetCinematicImg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 15%',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed'
            }}
          />
          
          {/* Mobile Background - Optimal Head Framing */}
          <div 
            className="absolute inset-0 w-full h-full block sm:hidden"
            style={{
              backgroundImage: `url(${filmSetCinematicImg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 20%',
              backgroundRepeat: 'no-repeat'
            }}
          />
          
          {/* Dark Overlay for Text Legibility - Gold Standard: 20-50% Opacity */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50"></div>
        </div>

        {/* Content Container - Centered Layout */}
        <div className="relative z-10 w-full px-6 md:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            
            {/* Gold Standard Headline - 4-8 words per line, max 16 total */}
            <FadeIn delay={0.1}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                  style={{
                    textShadow: '0 6px 12px rgba(0,0,0,0.7), 0 3px 6px rgba(0,0,0,0.5)',
                    letterSpacing: '-0.02em'
                  }}>
                <span className="block">Film Accounting.</span>
                <span className="block">Production Ready.</span>
              </h1>
            </FadeIn>

            {/* Gold Standard Subheadline - 18-24 words max, single sentence */}
            <FadeIn delay={0.2}>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto"
                 style={{
                   textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)',
                   letterSpacing: '0.01em'
                 }}>
                Maximize Film Tax Relief and manage complex cash flows for production success.
              </p>
            </FadeIn>

            {/* Gold Standard CTA - Large, centered, outcome-driven */}
            <FadeIn delay={0.3}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/30"
                onClick={() => window.open('https://calendly.com/progressaccountants/discovery-call', '_blank')}
              >
                Book My Strategy Call
              </Button>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Original content continues below */}
      <div className="container mx-auto px-6 md:px-8 py-20">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Why Choose Progress for Film Accounting?</h2>
            <p className="text-lg text-gray-300">
              Whether you're leading an independent shoot, running a freelance crew, or scaling a creative studio, Progress brings clarity, confidence, and control to your production finances.
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-gray-900 rounded-xl shadow-md p-6 md:p-8 mb-12 border border-gray-800">
            <p className="text-lg text-gray-300 mb-4">
              We specialise in the film and TV sector—offering proactive, tech-led accounting tailored to the rhythm of production.
            </p>
            <div className="flex items-center">
              <div className="p-2 bg-purple-900/20 rounded-full mr-3">
                <Film className="h-5 w-5 text-purple-400" />
              </div>
              <p className="font-medium text-white">📍 Based in Banbury, supporting film professionals across the UK.</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Key features section */}
      <div className="container mx-auto px-6 md:px-8 py-12">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-purple-900/20 text-purple-400 font-medium text-sm mb-3">
              Our Specialist Services
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Why Film & TV Companies Choose Progress</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <FeatureCard 
              icon={Award}
              title="🎯 Maximise Film Tax Relief"
              description="We don't just know the rules—we know how to make them work. From qualifying spend to Creative Industry Tax Reliefs, we'll ensure you're claiming every penny you're entitled to."
              accentColor="bg-orange-500"
            />
            <FeatureCard 
              icon={Banknote}
              title="📈 Tame Complex Cash Flow Cycles"
              description="Production funding is unpredictable. We simplify it with real-time dashboards, financial forecasting, and monthly check-ins—all timed to your production phases."
              accentColor="bg-blue-500"
            />
            <FeatureCard 
              icon={Users}
              title="🧾 Simplify Freelancer & Crew Payments"
              description="From PAYE to international contractors, we streamline payments with compliant payroll systems, so you can focus on the shoot—not the spreadsheets."
              accentColor="bg-green-500"
            />
            <FeatureCard 
              icon={Clock}
              title="🌍 Plan Across Borders"
              description="Shooting abroad? We handle multi-jurisdiction tax planning to keep you compliant, wherever your project takes you."
              accentColor="bg-purple-500"
            />
          </div>
        </motion.div>
      </div>
      
      {/* Testimonial section */}
      <div className="container mx-auto px-6 md:px-8 py-12">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">What Our Clients Say</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Testimonial 
              quote="Progress helped us reclaim over £70,000 in Film Tax Relief—it made our next project possible."
              author="Independent Producer"
              role="London"
            />
            <Testimonial 
              quote="Having accountants who understand the rhythm of production makes all the difference. Progress delivers insights we can actually use, when we need them."
              author="Production Manager"
              role="Manchester-based Studio"
            />
          </div>
        </motion.div>
      </div>
      
      {/* Clients section */}
      <div className="container mx-auto px-6 md:px-8 py-12">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Trusted by Producers, Studios & Freelancers</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
              We're more than just compliance. Progress is your financial partner across development, production, and post.
            </p>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
              We've worked with:
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16">
            <ClientType icon={Film} label="Independent film studios" />
            <ClientType icon={PlayCircle} label="TV and broadcast production companies" />
            <ClientType icon={CheckCircle} label="Post-production and VFX houses" />
            <ClientType icon={Users} label="Freelance producers and creatives" />
            <ClientType icon={Award} label="Branded content & commercial agencies" />
          </div>
        </motion.div>
      </div>
      
      {/* Tech approach section with split layout */}
      <div className="container mx-auto px-6 md:px-8 py-12">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="max-w-6xl mx-auto bg-gray-900 rounded-xl shadow-md border border-gray-800 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Content side */}
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Our Tech-Savvy Approach</h2>
                <p className="text-gray-300 mb-6">
                  We work with cloud-based systems like Xero—and integrate your tools for seamless reporting and cash burn visibility. Prefer a hands-off approach? We'll automate where possible and flag what matters.
                </p>
                <p className="text-gray-300 mb-8">
                  We understand your world. That's why we offer:
                </p>
                
                <div className="grid grid-cols-1 gap-4">
                  {[
                    "Digital dashboards tailored to film finance",
                    "Real-time spend and burn tracking",
                    "Budget variance reports",
                    "Expense categorisation optimised for creative accounts"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-purple-900/20 flex items-center justify-center mr-3 flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-purple-400" />
                      </div>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Image side */}
              <div className="relative lg:min-h-[400px] flex items-center justify-center bg-gray-800">
                <div className="p-6 w-full h-full flex items-center justify-center">
                  <img 
                    src="https://res.cloudinary.com/drl0fxrkq/image/upload/v1749050355/image_1_i0ldjo.png"
                    alt="Film industry professional services and analytics"
                    className="w-full h-auto max-h-full object-contain rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* CTA section */}
      <div className="container mx-auto px-6 md:px-8 py-12">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="bg-navy rounded-2xl shadow-xl" // Add background color to the container
        >
          <CTASection />
        </motion.div>
      </div>
    </div>
  );
};

export default withMemo(FilmIndustryPage);