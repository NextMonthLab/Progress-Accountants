import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowDown, Film, Award, Banknote, Users, Clock, PlayCircle, CheckCircle } from "lucide-react";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { Button } from "@/components/ui/button";
import { withMemo } from "@/lib/withMemo";
import MainLayout from "@/layouts/MainLayout";

// Import a film industry related image
import filmProductionImg from "@assets/Podcast Studio.jpg";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } }
};

// Feature card component
const FeatureCard = ({ icon: Icon, title, description, accentColor }: { 
  icon: React.ElementType, 
  title: string, 
  description: string,
  accentColor: string 
}) => (
  <motion.div 
    variants={itemVariants}
    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
  >
    <div className="p-6 md:p-8">
      <div className={`p-3 rounded-full ${accentColor} inline-block mb-4`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-navy mb-4">{title}</h3>
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  </motion.div>
);

// Testimonial component
const Testimonial = ({ quote, author, role }: { quote: string, author: string, role: string }) => (
  <motion.div 
    variants={itemVariants}
    className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-100"
  >
    <div className="mb-6">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 7.5V15H8.5C8.5 16.38 9.62 17.5 11 17.5V20C8.24 20 6 17.76 6 15V7.5H11ZM18 7.5V15H15.5C15.5 16.38 16.62 17.5 18 17.5V20C15.24 20 13 17.76 13 15V7.5H18Z" fill="#D97706" />
      </svg>
    </div>
    <p className="text-lg text-gray-700 italic mb-6">{quote}</p>
    <div className="flex items-center">
      <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
        <span className="text-orange-600 font-bold">{author.charAt(0)}</span>
      </div>
      <div>
        <p className="font-medium text-navy">{author}</p>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  </motion.div>
);

// Call to action section component
const CTASection = () => (
  <motion.div
    variants={itemVariants}
    className="bg-navy rounded-2xl p-8 md:p-12 text-white relative overflow-hidden"
  >
    {/* Background pattern with solid background */}
    <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 z-0">
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#FFFFFF" d="M42.7,-62.9C56.4,-53.9,69.4,-42.2,75.3,-27.3C81.1,-12.4,79.9,5.5,73.8,21.2C67.8,36.9,57,50.4,43.3,59.1C29.6,67.8,13,71.5,-3.4,76.4C-19.9,81.3,-39.8,87.4,-53.2,80.2C-66.5,73,-73.2,52.5,-78.2,32.1C-83.1,11.8,-86.4,-8.4,-81,-25.2C-75.6,-41.9,-61.6,-55.2,-46.5,-64C-31.3,-72.7,-15.7,-77,0.3,-77.4C16.3,-77.8,32.6,-74.4,42.7,-62.9Z" transform="translate(100 100)" />
      </svg>
    </div>
    <div className="relative z-10">
      <div className="bg-navy-700 px-6 py-4 rounded-lg mb-6 inline-block">
        <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to streamline your film production finances?</h2>
      </div>
      <div className="bg-navy-700 px-6 py-4 rounded-lg mb-8 inline-block">
        <p className="text-white text-lg max-w-2xl">
          Whether you're applying for Film Tax Relief or planning your next big pitch, book a call with our team to see how Progress can support your next production.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white border-none font-medium">
          Book a consultation
        </Button>
        <Button size="lg" className="bg-navy-600 border-navy-600 text-white hover:bg-navy-700 font-medium">
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
    className="flex flex-col items-center p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
  >
    <div className="p-3 rounded-full bg-orange-100 mb-4">
      <Icon className="h-6 w-6 text-orange-600" />
    </div>
    <span className="font-medium text-navy">{label}</span>
  </motion.div>
);

const TestFilmPage = () => {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout>
      <div className="bg-gray-50 pb-20">
        {/* Hero section */}
        <div 
          ref={headerRef}
          className="bg-navy relative overflow-hidden"
        >
          {/* Simple solid background for better text contrast */}
          <div className="absolute inset-0 bg-navy z-0"></div>
          <div className="absolute inset-0 z-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                  <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="lg:w-1/2"
              >
                <motion.div variants={itemVariants}>
                  <span className="inline-block px-4 py-1 rounded-full bg-orange-100 text-orange-700 font-medium text-sm mb-4">
                    Industry Specialists
                  </span>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="bg-navy px-6 py-4 rounded-lg mb-6 inline-block"
                >
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                    Expert Accounting for the Film Industry
                  </h1>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="bg-navy px-6 py-4 rounded-lg mb-8 inline-block"
                >
                  <p className="text-lg md:text-xl text-white">
                    Helping You Maximise Film Tax Relief, Manage Cash Flow, and Keep Production on Track
                  </p>
                </motion.div>
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-medium">
                    Book a free consultation
                  </Button>
                  <Button size="lg" className="bg-navy-600 border-navy-600 text-white hover:bg-navy-700 font-medium">
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
                    src={filmProductionImg}
                    alt="Film production accounting"
                    width={600}
                    height={400}
                    className="rounded-xl shadow-lg w-full"
                  />
                  
                  {/* Animated badge */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-3 flex items-center"
                  >
                    <div className="bg-orange-100 p-2 rounded-lg mr-3">
                      <Award className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-navy font-semibold text-sm">Film Tax Relief</p>
                      <p className="text-xs text-gray-500">Maximise your returns</p>
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
        
        {/* CTA section */}
        <div className="container mx-auto px-4 py-12 mt-12">
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
    </MainLayout>
  );
};

export default withMemo(TestFilmPage);