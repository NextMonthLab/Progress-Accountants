import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowRight, 
  BarChart3,
  Briefcase, 
  Calculator, 
  Calendar, 
  CheckCircle2, 
  Clock,
  FileCheck, 
  FileText,
  Landmark,
  PhoneCall,
  PlayCircle,
  Shield,
  Star,
  Users,
  LineChart,
  LayoutDashboard,
  Code,
  Cpu,
  Lock,
  ActivitySquare,
  Database,
  Server
} from 'lucide-react';
import teamPhotoImage from '../assets/images/team_photo.jpg';

// Tech Blue Theme colors
const colors = {
  background: '#F4F7FA',
  ctaButton: '#0073E6',
  text: '#1B1F3B',
  accent: '#00BDEB',
  sectionBg: '#E6EEF7',
  headerBg: '#1B1F3B',
  headerText: '#FFFFFF',
  secondary: '#4D5DFB',
  lightText: '#3A4165',
  cardBg: '#FFFFFF',
  footerBg: '#1B1F3B',
  footerText: '#F4F7FA',
  border: '#CED9E5',
  highlight: '#E1F5FF'
};

// Animation component types
interface AnimationProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

// Animation components
const FadeIn: React.FC<AnimationProps> = ({ children, delay = 0, className = '' }) => (
  <div 
    className={`opacity-0 ${className}`} 
    style={{ 
      animation: `fadeIn 0.8s ease-out ${delay}s forwards`,
    }}
  >
    {children}
  </div>
);

const SlideInLeft: React.FC<AnimationProps> = ({ children, delay = 0, className = '' }) => (
  <div 
    className={`opacity-0 ${className}`} 
    style={{ 
      animation: `slideInLeft 0.8s ease-out ${delay}s forwards`,
      transform: 'translateX(-20px)'
    }}
  >
    {children}
  </div>
);

const SlideInRight: React.FC<AnimationProps> = ({ children, delay = 0, className = '' }) => (
  <div 
    className={`opacity-0 ${className}`} 
    style={{ 
      animation: `slideInRight 0.8s ease-out ${delay}s forwards`,
      transform: 'translateX(20px)'
    }}
  >
    {children}
  </div>
);

const SlideUp: React.FC<AnimationProps> = ({ children, delay = 0, className = '' }) => (
  <div 
    className={`opacity-0 ${className}`} 
    style={{ 
      animation: `slideUp 0.8s ease-out ${delay}s forwards`,
      transform: 'translateY(20px)'
    }}
  >
    {children}
  </div>
);

const ScaleIn: React.FC<AnimationProps> = ({ children, delay = 0, className = '' }) => (
  <div 
    className={`opacity-0 ${className}`} 
    style={{ 
      animation: `scaleIn 0.8s ease-out ${delay}s forwards`,
      transform: 'scale(0.9)'
    }}
  >
    {children}
  </div>
);

const TechBlueHomeMockupPage: React.FC = () => {
  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen">
      <Helmet>
        <title>Progress Accountants | Tech Blue Theme</title>
        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideInLeft {
              from { opacity: 0; transform: translateX(-30px); }
              to { opacity: 1; transform: translateX(0); }
            }
            @keyframes slideInRight {
              from { opacity: 0; transform: translateX(30px); }
              to { opacity: 1; transform: translateX(0); }
            }
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(30px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes scaleIn {
              from { opacity: 0; transform: scale(0.9); }
              to { opacity: 1; transform: scale(1); }
            }
          `}
        </style>
      </Helmet>

      {/* Header */}
      <header 
        className="py-4 px-6 shadow-md"
        style={{ backgroundColor: colors.headerBg }}
      >
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold" style={{ color: colors.headerText }}>
            Progress Accountants
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="font-medium" style={{ color: colors.headerText }}>Home</a>
            <a href="#" className="font-medium" style={{ color: colors.headerText }}>Services</a>
            <a href="#" className="font-medium" style={{ color: colors.headerText }}>About</a>
            <a href="#" className="font-medium" style={{ color: colors.headerText }}>Industries</a>
            <a href="#" className="font-medium" style={{ color: colors.headerText }}>Contact</a>
          </div>
          <Button
            className="hidden md:flex items-center rounded-full px-6 py-2" 
            style={{ backgroundColor: colors.ctaButton, color: 'white' }}
          >
            Book a Consultation
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <button className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke={colors.headerText} className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="text-white min-h-[90vh] relative flex items-center py-16 overflow-hidden"
        style={{ backgroundColor: colors.sectionBg }}
      >
        {/* Tech-inspired background pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke={colors.text} strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="container mx-auto px-6 md:px-12 z-10 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2">
            <SlideInLeft>
              <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: colors.text }}>
                Innovative Financial<br />Solutions for Success
              </h1>
              
              <p className="text-lg mb-8 leading-relaxed" style={{ color: colors.lightText }}>
                We combine advanced technology with accounting expertise to deliver 
                data-driven financial insights that help your business thrive in the digital age.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a href="#contact">
                  <Button 
                    className="px-6 py-3 rounded-full text-white"
                    style={{ backgroundColor: colors.ctaButton }}
                  >
                    <span className="font-medium flex items-center">
                      Book Your Digital Strategy Session
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  </Button>
                </a>
                
                <Button 
                  variant="ghost" 
                  className="px-6 py-3 rounded-full border border-opacity-20 hover:bg-opacity-10"
                  style={{ borderColor: colors.ctaButton, color: colors.ctaButton }}
                >
                  <span>Explore Our Services</span>
                  <span className="ml-2" style={{ color: colors.ctaButton }}>→</span>
                </Button>
              </div>
            </SlideInLeft>
          </div>
          
          {/* Right content - Team image */}
          <div className="md:w-1/2 mt-10 md:mt-0">
            <div className="relative">
              <div className="relative overflow-hidden rounded-xl shadow-xl transform hover:scale-[1.02] transition-transform duration-500">
                <img 
                  src={teamPhotoImage} 
                  alt="Progress Accountants Team" 
                  className="w-full h-[450px] object-cover"
                />
                
                {/* Digital overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-blue-500 opacity-20"></div>
                
                {/* Tech badge */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full shadow-md" style={{ backgroundColor: colors.ctaButton }}>
                  <p className="text-xs font-semibold text-white">
                    Data-Driven Expertise
                  </p>
                </div>
              </div>
              
              {/* Floating info card */}
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg z-10 max-w-[260px]">
                <div className="flex items-start">
                  <div className="p-2 rounded-full mr-3" style={{ backgroundColor: colors.accent }}>
                    <ActivitySquare className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm" style={{ color: colors.text }}>Real-Time Insights</h3>
                    <p className="text-xs" style={{ color: colors.lightText }}>
                      Advanced analytics for smarter financial decisions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
          <div className="p-2 rounded-full" style={{ backgroundColor: colors.ctaButton, color: 'white' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
            </svg>
          </div>
        </div>
      </section>

      {/* Tech Statistics Section */}
      <section className="py-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <FadeIn delay={0.1}>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div 
                  className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.highlight }}
                >
                  <Database className="h-7 w-7" style={{ color: colors.accent }} />
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>5TB+</h3>
                <p style={{ color: colors.lightText }}>Financial data processed</p>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div 
                  className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.highlight }}
                >
                  <Users className="h-7 w-7" style={{ color: colors.accent }} />
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>500+</h3>
                <p style={{ color: colors.lightText }}>Business clients</p>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.3}>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div 
                  className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.highlight }}
                >
                  <Server className="h-7 w-7" style={{ color: colors.accent }} />
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>99.9%</h3>
                <p style={{ color: colors.lightText }}>System uptime</p>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.4}>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div 
                  className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.highlight }}
                >
                  <Calculator className="h-7 w-7" style={{ color: colors.accent }} />
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>£12M+</h3>
                <p style={{ color: colors.lightText }}>Tax savings delivered</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <ScaleIn>
              <h2 className="text-3xl font-bold mb-4" style={{ color: colors.text }}>
                Digital-First Financial Services
              </h2>
              <p className="max-w-3xl mx-auto" style={{ color: colors.lightText }}>
                We leverage cutting-edge technology to provide comprehensive financial solutions for modern businesses.
              </p>
            </ScaleIn>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <SlideUp delay={0.1}>
              <Card className="h-full transition-all duration-300 hover:shadow-lg" style={{ borderColor: colors.border }}>
                <CardContent className="p-6">
                  <div className="p-3 rounded-full w-fit mb-4" style={{ backgroundColor: colors.highlight }}>
                    <LayoutDashboard className="h-6 w-6" style={{ color: colors.accent }} />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>Digital Financial Dashboard</h3>
                  <p className="mb-4" style={{ color: colors.lightText }}>
                    Real-time financial insights and performance metrics through our interactive dashboard.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.accent }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>Real-time cash flow monitoring</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.accent }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>Performance KPI tracking</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.accent }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>Customizable reporting</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </SlideUp>
            
            {/* Card 2 */}
            <SlideUp delay={0.2}>
              <Card className="h-full transition-all duration-300 hover:shadow-lg" style={{ borderColor: colors.border }}>
                <CardContent className="p-6">
                  <div className="p-3 rounded-full w-fit mb-4" style={{ backgroundColor: colors.highlight }}>
                    <LineChart className="h-6 w-6" style={{ color: colors.accent }} />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>AI-Powered Tax Optimization</h3>
                  <p className="mb-4" style={{ color: colors.lightText }}>
                    Advanced algorithms identify tax-saving opportunities and ensure compliance.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.accent }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>Predictive tax analysis</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.accent }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>Automated compliance checks</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.accent }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>Real-time regulatory updates</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </SlideUp>
            
            {/* Card 3 */}
            <SlideUp delay={0.3}>
              <Card className="h-full transition-all duration-300 hover:shadow-lg" style={{ borderColor: colors.border }}>
                <CardContent className="p-6">
                  <div className="p-3 rounded-full w-fit mb-4" style={{ backgroundColor: colors.highlight }}>
                    <Code className="h-6 w-6" style={{ color: colors.accent }} />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>Cloud Accounting Integration</h3>
                  <p className="mb-4" style={{ color: colors.lightText }}>
                    Seamless integration with your existing business systems and cloud platforms.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.accent }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>Multi-platform synchronization</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.accent }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>Automated data processing</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.accent }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>Custom API development</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </SlideUp>
          </div>
          
          <div className="text-center mt-12">
            <Button 
              className="rounded-full px-8 py-3" 
              style={{ backgroundColor: colors.ctaButton, color: 'white' }}
            >
              <span className="flex items-center">
                Explore All Digital Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </span>
            </Button>
          </div>
        </div>
      </section>
      
      {/* How We Work Section */}
      <section className="py-20" style={{ backgroundColor: colors.sectionBg }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <FadeIn>
              <h2 className="text-3xl font-bold mb-4" style={{ color: colors.text }}>
                Our Digital-First Approach
              </h2>
              <p className="max-w-3xl mx-auto" style={{ color: colors.lightText }}>
                We follow a systematic process powered by technology to deliver exceptional financial solutions.
              </p>
            </FadeIn>
          </div>
          
          <div className="relative">
            <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-1 hidden md:block" style={{ backgroundColor: colors.accent, opacity: 0.5 }}></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {/* Step 1 */}
              <SlideUp delay={0.1}>
                <div className="bg-white p-6 rounded-lg shadow-md text-center h-full">
                  <div 
                    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center font-bold text-white text-xl"
                    style={{ backgroundColor: colors.ctaButton }}
                  >
                    1
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>Data Collection</h3>
                  <p style={{ color: colors.lightText }}>
                    We gather and securely import your financial data using automated systems and APIs.
                  </p>
                </div>
              </SlideUp>
              
              {/* Step 2 */}
              <SlideUp delay={0.2}>
                <div className="bg-white p-6 rounded-lg shadow-md text-center h-full">
                  <div 
                    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center font-bold text-white text-xl"
                    style={{ backgroundColor: colors.ctaButton }}
                  >
                    2
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>AI Analysis</h3>
                  <p style={{ color: colors.lightText }}>
                    Our AI systems analyze your data to identify patterns, opportunities, and potential issues.
                  </p>
                </div>
              </SlideUp>
              
              {/* Step 3 */}
              <SlideUp delay={0.3}>
                <div className="bg-white p-6 rounded-lg shadow-md text-center h-full">
                  <div 
                    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center font-bold text-white text-xl"
                    style={{ backgroundColor: colors.ctaButton }}
                  >
                    3
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>Expert Review</h3>
                  <p style={{ color: colors.lightText }}>
                    Our experienced accountants review the AI insights and develop tailored strategies.
                  </p>
                </div>
              </SlideUp>
              
              {/* Step 4 */}
              <SlideUp delay={0.4}>
                <div className="bg-white p-6 rounded-lg shadow-md text-center h-full">
                  <div 
                    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center font-bold text-white text-xl"
                    style={{ backgroundColor: colors.ctaButton }}
                  >
                    4
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>Implementation</h3>
                  <p style={{ color: colors.lightText }}>
                    We execute the strategy through our digital platform and provide real-time monitoring.
                  </p>
                </div>
              </SlideUp>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Highlights */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <FadeIn>
              <h2 className="text-3xl font-bold mb-4" style={{ color: colors.text }}>
                Our Technology Stack
              </h2>
              <p className="max-w-3xl mx-auto" style={{ color: colors.lightText }}>
                We leverage cutting-edge technologies to deliver accurate, efficient, and secure financial services.
              </p>
            </FadeIn>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tech 1 */}
            <SlideUp delay={0.1}>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="p-3 rounded-full w-fit mb-4" style={{ backgroundColor: colors.highlight }}>
                  <Database className="h-6 w-6" style={{ color: colors.accent }} />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>
                  Cloud Infrastructure
                </h3>
                <p style={{ color: colors.lightText }}>
                  Secure, scalable cloud-based systems that ensure your financial data is always accessible and protected.
                </p>
              </div>
            </SlideUp>
            
            {/* Tech 2 */}
            <SlideUp delay={0.2}>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="p-3 rounded-full w-fit mb-4" style={{ backgroundColor: colors.highlight }}>
                  <Cpu className="h-6 w-6" style={{ color: colors.accent }} />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>
                  Machine Learning
                </h3>
                <p style={{ color: colors.lightText }}>
                  Advanced algorithms that continuously learn from your financial data to provide increasingly accurate insights.
                </p>
              </div>
            </SlideUp>
            
            {/* Tech 3 */}
            <SlideUp delay={0.3}>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="p-3 rounded-full w-fit mb-4" style={{ backgroundColor: colors.highlight }}>
                  <Lock className="h-6 w-6" style={{ color: colors.accent }} />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>
                  Enterprise Security
                </h3>
                <p style={{ color: colors.lightText }}>
                  Bank-level encryption and security protocols to ensure your financial data remains confidential and protected.
                </p>
              </div>
            </SlideUp>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20" style={{ backgroundColor: colors.sectionBg }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <FadeIn>
              <h2 className="text-3xl font-bold mb-4" style={{ color: colors.text }}>
                What Our Clients Say
              </h2>
              <p className="max-w-3xl mx-auto" style={{ color: colors.lightText }}>
                Hear from businesses that have transformed their financial operations through our digital solutions.
              </p>
            </FadeIn>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <SlideUp delay={0.1}>
              <Card className="h-full" style={{ borderColor: colors.border }}>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((_, index) => (
                      <Star key={index} className="h-5 w-5 fill-current" style={{ color: colors.accent }} />
                    ))}
                  </div>
                  <p className="italic mb-6" style={{ color: colors.lightText }}>
                    "Progress Accountants' digital dashboard has transformed how we view our finances. We now have real-time insights that help us make better business decisions every day."
                  </p>
                  <div className="flex items-center">
                    <div className="rounded-full w-12 h-12 bg-gray-300 mr-4" style={{ backgroundColor: colors.highlight }}></div>
                    <div>
                      <p className="font-semibold" style={{ color: colors.text }}>Alex Mitchell</p>
                      <p className="text-sm" style={{ color: colors.lightText }}>CEO, TechForward Ltd</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SlideUp>
            
            {/* Testimonial 2 */}
            <SlideUp delay={0.2}>
              <Card className="h-full" style={{ borderColor: colors.border }}>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((_, index) => (
                      <Star key={index} className="h-5 w-5 fill-current" style={{ color: colors.accent }} />
                    ))}
                  </div>
                  <p className="italic mb-6" style={{ color: colors.lightText }}>
                    "The AI tax optimization system identified savings we never knew existed. In our first year with Progress, we saved over £45,000 in tax while ensuring perfect compliance."
                  </p>
                  <div className="flex items-center">
                    <div className="rounded-full w-12 h-12 bg-gray-300 mr-4" style={{ backgroundColor: colors.highlight }}></div>
                    <div>
                      <p className="font-semibold" style={{ color: colors.text }}>Samantha Lee</p>
                      <p className="text-sm" style={{ color: colors.lightText }}>CFO, InnovateSmart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SlideUp>
            
            {/* Testimonial 3 */}
            <SlideUp delay={0.3}>
              <Card className="h-full" style={{ borderColor: colors.border }}>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((_, index) => (
                      <Star key={index} className="h-5 w-5 fill-current" style={{ color: colors.accent }} />
                    ))}
                  </div>
                  <p className="italic mb-6" style={{ color: colors.lightText }}>
                    "The seamless integration between our systems and Progress Accountants' platform has eliminated hours of manual work. Our financial data is now always accurate and up-to-date."
                  </p>
                  <div className="flex items-center">
                    <div className="rounded-full w-12 h-12 bg-gray-300 mr-4" style={{ backgroundColor: colors.highlight }}></div>
                    <div>
                      <p className="font-semibold" style={{ color: colors.text }}>James Wilson</p>
                      <p className="text-sm" style={{ color: colors.lightText }}>Operations Director, DataFlow</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SlideUp>
          </div>
          
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              className="rounded-full px-8 py-3 border-2" 
              style={{ borderColor: colors.ctaButton, color: colors.ctaButton }}
            >
              <span className="flex items-center">
                Read More Success Stories
                <ArrowRight className="ml-2 h-5 w-5" />
              </span>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0" 
          style={{ 
            background: `linear-gradient(135deg, ${colors.ctaButton}80 0%, ${colors.secondary}80 100%)`,
            opacity: 0.9
          }}
        ></div>
        
        {/* Tech pattern overlay */}
        <div className="absolute inset-0 z-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuitPattern" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M 10 10 L 90 10 90 90 10 90 Z" fill="none" stroke="white" strokeWidth="1"/>
                <circle cx="10" cy="10" r="3" fill="white"/>
                <circle cx="90" cy="10" r="3" fill="white"/>
                <circle cx="90" cy="90" r="3" fill="white"/>
                <circle cx="10" cy="90" r="3" fill="white"/>
                <path d="M 10 10 L 50 50 90 10" fill="none" stroke="white" strokeWidth="1"/>
                <path d="M 50 50 L 50 90" fill="none" stroke="white" strokeWidth="1"/>
                <circle cx="50" cy="50" r="3" fill="white"/>
                <circle cx="50" cy="90" r="3" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuitPattern)" />
          </svg>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Ready to Digitize Your Financial Operations?
              </h2>
              <p className="text-lg mb-8 text-white opacity-90">
                Book a digital strategy session with our experts. We'll analyze your current systems 
                and show you how our technology can transform your financial management.
              </p>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <Button 
                  className="px-8 py-3 rounded-full text-white font-medium"
                  style={{ backgroundColor: colors.text }}
                >
                  <span className="flex items-center">
                    Schedule Digital Strategy Session
                    <Calendar className="ml-2 h-5 w-5" />
                  </span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="px-8 py-3 rounded-full border-2 font-medium"
                  style={{ borderColor: 'white', color: 'white' }}
                >
                  <span className="flex items-center">
                    View Platform Demo
                    <Calendar className="ml-2 h-5 w-5" />
                  </span>
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12" style={{ backgroundColor: colors.footerBg, color: colors.footerText }}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Progress Accountants</h3>
              <p className="mb-4 opacity-80">
                Digital-first accounting and financial services for modern businesses. 
                We combine technology and expertise to transform your financial operations.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                  </svg>
                </a>
                <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Digital Services</h4>
              <ul className="space-y-2 opacity-80">
                <li><a href="#" className="hover:opacity-100">Financial Dashboard</a></li>
                <li><a href="#" className="hover:opacity-100">AI Tax Optimization</a></li>
                <li><a href="#" className="hover:opacity-100">Cloud Accounting</a></li>
                <li><a href="#" className="hover:opacity-100">Data Analytics</a></li>
                <li><a href="#" className="hover:opacity-100">API Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 opacity-80">
                <li><a href="#" className="hover:opacity-100">Knowledge Base</a></li>
                <li><a href="#" className="hover:opacity-100">System Status</a></li>
                <li><a href="#" className="hover:opacity-100">API Documentation</a></li>
                <li><a href="#" className="hover:opacity-100">Tutorial Videos</a></li>
                <li><a href="#" className="hover:opacity-100">Webinars</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <address className="not-italic opacity-80 mb-4">
                5 Chancery Lane<br />
                London, WC2A 1LG<br />
                United Kingdom
              </address>
              <p className="opacity-80 mb-2">020 7946 0123</p>
              <p className="opacity-80">digital@progressaccountants.co.uk</p>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-opacity-20" style={{ borderColor: colors.footerText }}>
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="opacity-70 text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} Progress Accountants. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-sm opacity-70 hover:opacity-100">Privacy Policy</a>
                <a href="#" className="text-sm opacity-70 hover:opacity-100">Terms of Service</a>
                <a href="#" className="text-sm opacity-70 hover:opacity-100">Security</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TechBlueHomeMockupPage;