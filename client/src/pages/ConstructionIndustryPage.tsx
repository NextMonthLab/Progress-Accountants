import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { ArrowRight, CheckCircle, ArrowDown, Hammer, HardHat, Building2, Coins, Wrench, User, FileSpreadsheet, Home, Clock, Receipt, BarChart3 } from "lucide-react";

// Import construction industry images
import constructionBackgroundImg from "../assets/images/construction_blueprint.png";
import constructionFooterImg from "../assets/images/construction_industry.png";
import constructionSiteImg from "../assets/images/construction_site_night.png";

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
        src={constructionSiteImg}
        alt="Construction site at night with scaffolding and equipment"
        width={1920}
        height={1080}
        className="w-full h-full object-cover"
      />
      {/* Darker overlay for better text contrast */}
      <div className="absolute inset-0 bg-navy opacity-70"></div>
    </div>
    <div className="relative z-10">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
        Book a Free Construction Finance Review
      </h2>
      <p className="text-white text-lg max-w-2xl mb-8">
        Find out how we can make your business more profitable—and your finances less stressful.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" className="bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] hover:from-[#6B2FD4] hover:to-[#2F94D4] text-white border-none font-medium">
          Book a consultation
        </Button>
        <Button size="lg" className="bg-gray-800 text-white hover:bg-gray-700 font-medium">
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
    className="flex flex-col items-center p-5 bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center border border-gray-800"
  >
    <div className="p-3 rounded-full bg-purple-900/20 mb-4">
      <Icon className="h-6 w-6 text-purple-400" />
    </div>
    <span className="font-medium text-white">{label}</span>
  </motion.div>
);

const ConstructionIndustryPage = () => {
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
            src={constructionBackgroundImg}
            alt="Construction worker in safety vest reviewing blueprints at night with lantern light"
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
                  🏗️ Industry Specialists
                </span>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="mb-6"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Specialist Accounting for the Construction Industry
                </h1>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="mb-8"
              >
                <p className="text-lg md:text-xl text-white">
                  Helping you navigate CIS, VAT, and cash flow—so you can focus on building.
                </p>
              </motion.div>
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] hover:from-[#6B2FD4] hover:to-[#2F94D4] text-white font-medium">
                  Book a Free Consultation
                </Button>
                <Button size="lg" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 font-medium">
                  Explore Our Services <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:w-1/2"
            >
              <div className="bg-gradient-to-br from-[#7B3FE4] to-[#3FA4E4] p-3 rounded-2xl shadow-2xl relative">
                <div className="rounded-xl shadow-lg w-full overflow-hidden">
                  <OptimizedImage
                    src={constructionFooterImg}
                    alt="Construction industry project"
                    width={600}
                    height={400}
                    className="rounded-xl shadow-lg w-full"
                  />
                </div>
                
                {/* Animated badge */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-3 flex items-center"
                >
                  <div className="bg-orange-100 p-2 rounded-lg mr-3">
                    <FileSpreadsheet className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-navy font-semibold text-sm">CIS Management</p>
                    <p className="text-xs text-gray-500">Stay compliant and in control</p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Why Construction Professionals Choose Progress</h2>
            <p className="text-lg text-gray-300">
              From one-man bands and subcontractors to growing firms and developers, Progress helps you gain control of your construction finances.
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-gray-900 rounded-xl shadow-md p-6 md:p-8 mb-12 border border-gray-800">
            <p className="text-lg text-gray-300 mb-4">
              We specialise in proactive, tech-led accounting for the construction industry—tailored to your deadlines, subcontractor payments, and project-based income.
            </p>
            <div className="flex items-center">
              <div className="p-2 bg-purple-900/20 rounded-full mr-3">
                <Hammer className="h-5 w-5 text-purple-400" />
              </div>
              <p className="font-medium text-white">📍 Based in Banbury. Supporting builders and contractors across the UK.</p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Why Construction Businesses Choose Progress</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <FeatureCard 
              icon={Receipt}
              title="🔧 CIS Compliance Without the Headache"
              description="We handle CIS deductions, monthly returns, and HMRC filings—so you're always compliant and always paid on time."
              accentColor="bg-orange-500"
            />
            <FeatureCard 
              icon={BarChart3}
              title="VAT & Reverse Charge Simplified"
              description="The Construction Reverse Charge can be a minefield. We make sure your VAT is reclaimed correctly and that you're never overpaying or filing late."
              accentColor="bg-blue-500"
            />
            <FeatureCard 
              icon={Coins}
              title="Stay On Top of Project Cash Flow"
              description="We help you track income and outgoings per project, forecast for slow months, and budget for materials, labour, and growth."
              accentColor="bg-green-500"
            />
            <FeatureCard 
              icon={Building2}
              title="Grow Without Losing Control"
              description="From setting up new company structures to managing payroll and financing large builds—we're your strategic partner for growth, not just compliance."
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
              quote="Progress keeps our CIS records spotless. It's one less thing to worry about on site."
              author="Construction Director"
              role="Banbury"
            />
            <Testimonial 
              quote="Having accountants who understand construction makes all the difference. They've helped us navigate the Reverse Charge VAT changes with zero disruption."
              author="Property Developer"
              role="Oxford"
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
            <h2 className="text-3xl font-bold text-white mb-6">Trusted by Builders, Developers, and Tradespeople</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
              Whether you're laying bricks or managing builds, we'll handle the numbers that keep your business moving forward. We work with:
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mb-16">
            <ClientType icon={HardHat} label="General contractors" />
            <ClientType icon={Home} label="Property developers" />
            <ClientType icon={Wrench} label="Electricians & plumbers" />
            <ClientType icon={Building2} label="Renovation specialists" />
            <ClientType icon={User} label="Expanding trades companies" />
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
            <h2 className="text-3xl font-bold text-white mb-6">Our Tech-Savvy Construction Support</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
              We connect your bookkeeping, payroll, and job costing through cloud-based systems like Xero. That means:
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            <motion.div variants={itemVariants} className="bg-gray-900 rounded-xl shadow-md p-6 md:p-8 mb-12 border border-gray-800">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-400 mr-3 shrink-0 mt-1" />
                  <p className="text-gray-300">Weekly and monthly cash flow snapshots</p>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-400 mr-3 shrink-0 mt-1" />
                  <p className="text-gray-300">Job-specific reports to track real margins</p>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-400 mr-3 shrink-0 mt-1" />
                  <p className="text-gray-300">Tax alerts and reminders that keep you in control</p>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-400 mr-3 shrink-0 mt-1" />
                  <p className="text-gray-300">Advice tailored to the realities of construction work</p>
                </li>
              </ul>
            </motion.div>
            
            {/* CTA Section */}
            <CTASection />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ConstructionIndustryPage;