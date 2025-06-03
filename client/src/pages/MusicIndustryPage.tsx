import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { withMemo } from "@/lib/withMemo";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { ArrowRight, CheckCircle, Music, PlayCircle, ArrowDown, Clock, Banknote, Award, Users, Headphones, Radio } from "lucide-react";

// Import music industry images
import musicStudioBackgroundImg from "../assets/images/music/hero_background_new.png";
import musicCardImg from "../assets/images/music/card_image.png";
import musicFooterImg from "../assets/images/music/footer_background_new.png";

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
  accentColor = "bg-blue-500"
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  accentColor?: string;
}) => (
  <motion.div 
    variants={itemVariants}
    className="bg-gray-900 rounded-xl shadow-md overflow-hidden border border-gray-800"
  >
    <div className="p-6 sm:p-8">
      <div className="p-3 rounded-full w-fit bg-purple-900/20 mb-5">
        <Icon className="h-6 w-6 text-purple-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  </motion.div>
);

// Testimonial component
const Testimonial = ({ quote, author, role }: { quote: string; author: string; role: string }) => (
  <motion.div 
    variants={itemVariants}
    className="bg-gray-900 rounded-xl p-6 border border-gray-800"
  >
    <div className="flex flex-col">
      <div className="mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-purple-400">★</span>
        ))}
      </div>
      <p className="text-white italic mb-4 text-lg">"{quote}"</p>
      <div className="mt-auto">
        <p className="font-semibold text-white">{author}</p>
        <p className="text-gray-300 text-sm">{role}</p>
      </div>
    </div>
  </motion.div>
);

// Call to action section component
const CTASection = () => (
  <motion.div
    variants={itemVariants}
    className="rounded-2xl p-8 md:p-12 text-white relative overflow-hidden"
  >
    {/* Background image with overlay for CTA */}
    <div className="absolute inset-0 z-0">
      <OptimizedImage
        src={musicFooterImg}
        alt="Concert with band silhouette and audience"
        width={1920}
        height={1080}
        className="w-full h-full object-cover"
      />
      {/* Darker overlay for better text contrast */}
      <div className="absolute inset-0 bg-navy opacity-70"></div>
    </div>
    <div className="relative z-10">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
        Book a Free Music Finance Consultation
      </h2>
      <p className="text-white text-lg max-w-2xl mb-8">
        Let's talk through your situation—whether you're a solo artist, studio owner, or label founder. We'll show you how to build a financial setup that supports your music, not smothers it.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" className="bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] hover:shadow-lg hover:shadow-purple-500/25 text-white border-none font-medium">
          Book a consultation
        </Button>
        <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-medium">
          View our services
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

const MusicIndustryPage = () => {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-black pb-20">
      {/* Hero section */}
      <div 
        ref={headerRef}
        className="relative overflow-hidden"
      >
        {/* Full-width background image with dark overlay */}
        <div className="absolute inset-0 z-0">
          <OptimizedImage
            src={musicStudioBackgroundImg}
            alt="Recording studio mixing console with musician silhouette"
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for better text contrast */}
          <div className="absolute inset-0 bg-navy opacity-75"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 md:px-8 py-20 md:py-32">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="lg:w-1/2"
            >
              <motion.div variants={itemVariants}>
                <span className="inline-block px-4 py-1 rounded-full bg-purple-900/20 text-purple-400 font-medium text-sm mb-4">
                  Industry Specialists
                </span>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="mb-6"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Specialist Accounting for the Music Industry
                </h1>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="mb-8"
              >
                <p className="text-lg md:text-xl text-white">
                  Helping You Stay on Top of Royalties, Tax, and Touring Finances—Without Missing a Beat
                </p>
              </motion.div>
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] hover:shadow-lg hover:shadow-purple-500/25 text-white font-medium">
                  Book a free consultation
                </Button>
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-medium">
                  Explore our services <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:w-1/2"
            >
              <div className="bg-orange-600 p-3 rounded-2xl shadow-2xl relative">
                <OptimizedImage
                  src={musicCardImg}
                  alt="Musicians recording in studio"
                  width={600}
                  height={400}
                  className="rounded-xl shadow-lg w-full"
                />
                
                {/* Animated badge */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute -bottom-4 -right-4 bg-gray-900 rounded-xl shadow-lg p-3 flex items-center border border-gray-800"
                >
                  <div className="bg-purple-900/20 p-2 rounded-lg mr-3">
                    <Headphones className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Royalty Management</p>
                    <p className="text-xs text-gray-300">Keep more of what you earn</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          >
            <p className="text-white mb-2 text-sm font-medium">Scroll to learn more</p>
            <ArrowDown className="w-5 h-5 text-white animate-bounce" />
          </motion.div>
        </div>
      </div>
      
      {/* Intro section */}
      <div className="container mx-auto px-6 md:px-8 py-16">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Why Musicians and Music Businesses Choose Progress</h2>
            <p className="text-lg text-gray-300">
              From independent artists and producers to recording studios and music labels, we support your creative journey with financial clarity and control. At Progress, we understand the rhythm of the music industry—and we build your finances to match it.
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-gray-900 rounded-xl shadow-md p-6 md:p-8 mb-12 border border-gray-800">
            <p className="text-lg text-gray-300 mb-4">
              We specialise in supporting the music industry with proactive, tech-savvy accounting solutions tailored to 
              the unique challenges of musicians, producers, and labels.
            </p>
            <div className="flex items-center">
              <div className="p-2 bg-purple-900/20 rounded-full mr-3">
                <Music className="h-5 w-5 text-purple-400" />
              </div>
              <p className="font-medium text-white">Based in Banbury. Trusted by musicians across the UK.</p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Why Musicians Choose Progress</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <FeatureCard 
              icon={Award}
              title="Tax-Smart Royalty Management"
              description="Royalty income can be unpredictable—and heavily taxed if mismanaged. We help you plan for the peaks and troughs, stay compliant, and keep more of what you earn."
              accentColor="bg-orange-500"
            />
            <FeatureCard 
              icon={Banknote}
              title="Touring & International Tax Guidance"
              description="Gigging abroad? We make sure you're covered with cross-border tax advice, travel expense planning, and currency-aware financial reporting."
              accentColor="bg-blue-500"
            />
            <FeatureCard 
              icon={Users}
              title="Smooth Payments for Freelancers & Session Musicians"
              description="From bandmates to backing vocalists, we handle payments and tax filings for everyone in your crew—keeping you compliant and your collaborators happy."
              accentColor="bg-green-500"
            />
            <FeatureCard 
              icon={Headphones}
              title="Smart Studio & Equipment Expenses"
              description="We advise on how to buy, lease, and depreciate equipment in a way that maximises tax efficiency and supports long-term growth."
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
              quote="Progress gave me total control of my royalty income. I finally feel in charge of my music money."
              author="Independent Artist"
              role="Oxfordshire"
            />
            <Testimonial 
              quote="Having accountants who understand the music business makes all the difference. Progress delivers insights we can actually use, when we need them."
              author="Studio Owner"
              role="London"
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
            <h2 className="text-3xl font-bold text-white mb-6">Trusted by Artists, Studios, and Music Managers</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
              Whether you're mixing your next EP or building a label, we're here to support your creative and financial goals. We've worked with:
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mb-16">
            <ClientType icon={Music} label="Independent musicians" />
            <ClientType icon={Headphones} label="Recording studios" />
            <ClientType icon={Radio} label="Music producers" />
            <ClientType icon={Award} label="Small record labels" />
            <ClientType icon={Users} label="Band managers" />
          </div>
        </motion.div>
      </div>
      
      {/* Tech section */}
      <div className="container mx-auto px-6 md:px-8 py-12">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Our Tech-Forward Support</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
              We use cloud-based platforms like Xero to give you real-time visibility into your income and expenses. That means:
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            <motion.div variants={itemVariants} className="bg-gray-900 rounded-xl shadow-md p-6 md:p-8 mb-12 border border-gray-800">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-400 mr-3 shrink-0 mt-1" />
                  <p className="text-gray-300">Snapshot views of income from Spotify, YouTube, and distributors</p>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-400 mr-3 shrink-0 mt-1" />
                  <p className="text-gray-300">Categorised expenses from tours, equipment, and production</p>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-400 mr-3 shrink-0 mt-1" />
                  <p className="text-gray-300">Real-time tax estimates so there are no nasty surprises</p>
                </li>
              </ul>
              
              <div className="mt-6 pt-6 border-t border-gray-800">
                <p className="text-white font-medium">Prefer voice notes to spreadsheets? We adapt to your workflow—not the other way around.</p>
              </div>
            </motion.div>
          </div>
          
          {/* CTA section */}
          <CTASection />
        </motion.div>
      </div>
    </div>
  );
};

export default withMemo(MusicIndustryPage);