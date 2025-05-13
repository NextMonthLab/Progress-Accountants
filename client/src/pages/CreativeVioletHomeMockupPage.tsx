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
  Shield,
  Star,
  Users,
  Clock3
} from 'lucide-react';
import teamPhotoImage from '../assets/images/team_photo.jpg';

// Creative Violet Theme colors
const colors = {
  background: '#F8F5FB',
  ctaButton: '#9C27B0',
  text: '#2E003E',
  accent: '#F50057',
  sectionBg: '#EFE1F6',
  headerBg: '#2E003E',
  headerText: '#FFFFFF',
  secondary: '#7B1FA2',
  lightText: '#4A154E',
  cardBg: '#FFFFFF',
  footerBg: '#2E003E',
  footerText: '#F8F5FB',
  border: '#D1C4E9',
  highlight: '#E1BEE7'
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

const CreativeVioletHomeMockupPage: React.FC = () => {
  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen">
      <Helmet>
        <title>Progress Accountants | Creative Violet Theme</title>
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
        {/* Clean gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b z-0" style={{ 
          backgroundImage: `linear-gradient(to bottom, ${colors.sectionBg} 0%, transparent 100%)` 
        }}></div>
        
        <div className="container mx-auto px-6 md:px-12 z-10 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2">
            <SlideInLeft>
              <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: colors.text }}>
                Modern Accounting<br />for Growing Businesses
              </h1>
              
              <p className="text-lg mb-8 leading-relaxed" style={{ color: colors.lightText }}>
                We help businesses optimize their finances, reduce tax liabilities, 
                and gain clarity on their financial future. Our approach combines 
                expertise, technology, and personalized service.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a href="#contact">
                  <Button 
                    className="px-6 py-3 rounded-full text-white"
                    style={{ backgroundColor: colors.ctaButton }}
                  >
                    <span className="font-medium flex items-center">
                      Book Your Free Strategy Consultation
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
                
                {/* Simple badge */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full shadow-md" style={{ backgroundColor: colors.ctaButton }}>
                  <p className="text-xs font-semibold text-white">
                    UK Certified
                  </p>
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

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <ScaleIn>
              <h2 className="text-3xl font-bold mb-4" style={{ color: colors.text }}>
                Comprehensive Financial Services
              </h2>
              <p className="max-w-3xl mx-auto" style={{ color: colors.lightText }}>
                We provide a full range of accounting and financial services to help your business grow. 
                Our experienced team is here to support you every step of the way.
              </p>
            </ScaleIn>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <SlideUp delay={0.1}>
              <Card className="h-full transition-all duration-300 hover:shadow-lg" style={{ borderColor: colors.border }}>
                <CardContent className="p-6">
                  <div className="p-3 rounded-full w-fit mb-4" style={{ backgroundColor: colors.highlight }}>
                    <Calculator className="h-6 w-6" style={{ color: colors.accent }} />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>Tax Planning & Preparation</h3>
                  <p className="mb-4" style={{ color: colors.lightText }}>
                    Strategic tax planning and efficient preparation to minimize liabilities and ensure compliance.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.accent }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>Corporate & personal tax returns</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.accent }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>Tax-efficient business structures</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.accent }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>VAT planning and returns</span>
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
                    <BarChart3 className="h-6 w-6" style={{ color: colors.accent }} />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>Business Advisory</h3>
                  <p className="mb-4" style={{ color: colors.lightText }}>
                    Expert guidance to help your business make informed decisions and achieve sustainable growth.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.accent }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>Growth strategy development</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.accent }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>Financial forecasting & analysis</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.accent }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>Business performance reviews</span>
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
                    <FileCheck className="h-6 w-6" style={{ color: colors.accent }} />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>Accounting & Bookkeeping</h3>
                  <p className="mb-4" style={{ color: colors.lightText }}>
                    Streamlined accounting services to keep your financial records accurate and up-to-date.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.accent }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>Monthly financial statements</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.accent }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>Cloud accounting setup & support</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.accent }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>Accounts payable & receivable</span>
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
                View All Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </span>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Industry Expertise Section */}
      <section className="py-20" style={{ backgroundColor: colors.sectionBg }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <FadeIn>
              <h2 className="text-3xl font-bold mb-4" style={{ color: colors.text }}>
                Industry Expertise
              </h2>
              <p className="max-w-3xl mx-auto" style={{ color: colors.lightText }}>
                We provide specialized accounting services tailored to the unique needs of these industries.
              </p>
            </FadeIn>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Industry 1 */}
            <SlideUp delay={0.1}>
              <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 border-0">
                <div className="bg-cover bg-center h-40" style={{ 
                  backgroundColor: colors.secondary,
                  backgroundImage: `linear-gradient(45deg, ${colors.secondary}dd, ${colors.accent}aa)`
                }}>
                  <div className="w-full h-full flex items-center justify-center">
                    <Briefcase className="w-16 h-16 text-white" />
                  </div>
                </div>
                <CardContent className="p-6" style={{ backgroundColor: colors.cardBg }}>
                  <h3 className="font-bold text-lg mb-2" style={{ color: colors.text }}>Consulting Firms</h3>
                  <p className="text-sm mb-4" style={{ color: colors.lightText }}>
                    Specialized accounting services for consulting businesses, from solo consultants to large firms.
                  </p>
                  <a 
                    href="#" 
                    className="text-sm font-medium flex items-center" 
                    style={{ color: colors.accent }}
                  >
                    Learn More
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            </SlideUp>
            
            {/* Industry 2 */}
            <SlideUp delay={0.2}>
              <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 border-0">
                <div className="bg-cover bg-center h-40" style={{ 
                  backgroundColor: colors.secondary,
                  backgroundImage: `linear-gradient(45deg, ${colors.secondary}dd, ${colors.accent}aa)`
                }}>
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="w-16 h-16 text-white" />
                  </div>
                </div>
                <CardContent className="p-6" style={{ backgroundColor: colors.cardBg }}>
                  <h3 className="font-bold text-lg mb-2" style={{ color: colors.text }}>Construction</h3>
                  <p className="text-sm mb-4" style={{ color: colors.lightText }}>
                    Financial solutions for contractors, builders and construction companies of all sizes.
                  </p>
                  <a 
                    href="#" 
                    className="text-sm font-medium flex items-center" 
                    style={{ color: colors.accent }}
                  >
                    Learn More
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            </SlideUp>
            
            {/* Industry 3 */}
            <SlideUp delay={0.3}>
              <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 border-0">
                <div className="bg-cover bg-center h-40" style={{ 
                  backgroundColor: colors.secondary,
                  backgroundImage: `linear-gradient(45deg, ${colors.secondary}dd, ${colors.accent}aa)`
                }}>
                  <div className="w-full h-full flex items-center justify-center">
                    <Landmark className="w-16 h-16 text-white" />
                  </div>
                </div>
                <CardContent className="p-6" style={{ backgroundColor: colors.cardBg }}>
                  <h3 className="font-bold text-lg mb-2" style={{ color: colors.text }}>Professional Services</h3>
                  <p className="text-sm mb-4" style={{ color: colors.lightText }}>
                    Accounting support for lawyers, architects, engineers, and other professional service firms.
                  </p>
                  <a 
                    href="#" 
                    className="text-sm font-medium flex items-center" 
                    style={{ color: colors.accent }}
                  >
                    Learn More
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            </SlideUp>
            
            {/* Industry 4 */}
            <SlideUp delay={0.4}>
              <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 border-0">
                <div className="bg-cover bg-center h-40" style={{ 
                  backgroundColor: colors.secondary,
                  backgroundImage: `linear-gradient(45deg, ${colors.secondary}dd, ${colors.accent}aa)`
                }}>
                  <div className="w-full h-full flex items-center justify-center">
                    <Users className="w-16 h-16 text-white" />
                  </div>
                </div>
                <CardContent className="p-6" style={{ backgroundColor: colors.cardBg }}>
                  <h3 className="font-bold text-lg mb-2" style={{ color: colors.text }}>Creative Industries</h3>
                  <p className="text-sm mb-4" style={{ color: colors.lightText }}>
                    Financial management for creative businesses including film, music, and digital media firms.
                  </p>
                  <a 
                    href="#" 
                    className="text-sm font-medium flex items-center" 
                    style={{ color: colors.accent }}
                  >
                    Learn More
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            </SlideUp>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <FadeIn>
              <h2 className="text-3xl font-bold mb-4" style={{ color: colors.text }}>
                Client Success Stories
              </h2>
              <p className="max-w-3xl mx-auto" style={{ color: colors.lightText }}>
                Hear from the businesses we've helped achieve financial clarity and growth.
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
                    "Progress Accountants has transformed our financial management. Their proactive approach has helped us 
                    reduce our tax liability while giving us clear insights into our business performance."
                  </p>
                  <div className="flex items-center">
                    <div className="rounded-full w-12 h-12 bg-gray-300 mr-4" style={{ backgroundColor: colors.highlight }}></div>
                    <div>
                      <p className="font-semibold" style={{ color: colors.text }}>Sarah Thompson</p>
                      <p className="text-sm" style={{ color: colors.lightText }}>CEO, Thompson Consulting</p>
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
                    "The team at Progress Accountants goes above and beyond. Their industry expertise has been invaluable 
                    in navigating complex regulations and identifying growth opportunities for our construction business."
                  </p>
                  <div className="flex items-center">
                    <div className="rounded-full w-12 h-12 bg-gray-300 mr-4" style={{ backgroundColor: colors.highlight }}></div>
                    <div>
                      <p className="font-semibold" style={{ color: colors.text }}>Michael Reed</p>
                      <p className="text-sm" style={{ color: colors.lightText }}>Director, Reed Construction</p>
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
                    "As a small business owner, I needed accountants who could provide personalized service. 
                    Progress Accountants has been perfect - responsive, knowledgeable, and genuinely interested in my success."
                  </p>
                  <div className="flex items-center">
                    <div className="rounded-full w-12 h-12 bg-gray-300 mr-4" style={{ backgroundColor: colors.highlight }}></div>
                    <div>
                      <p className="font-semibold" style={{ color: colors.text }}>Emma Chen</p>
                      <p className="text-sm" style={{ color: colors.lightText }}>Founder, Artisan Studios</p>
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
                Read More Client Stories
                <ArrowRight className="ml-2 h-5 w-5" />
              </span>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20" style={{ backgroundColor: colors.sectionBg }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <FadeIn>
              <h2 className="text-3xl font-bold mb-4" style={{ color: colors.text }}>
                Why Choose Progress Accountants
              </h2>
              <p className="max-w-3xl mx-auto" style={{ color: colors.lightText }}>
                We combine professional expertise with modern technology to deliver exceptional financial services.
              </p>
            </FadeIn>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Reason 1 */}
            <div className="text-center">
              <FadeIn delay={0.1}>
                <div className="mx-auto rounded-full p-4 w-16 h-16 mb-6 flex items-center justify-center" style={{ backgroundColor: colors.ctaButton }}>
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ color: colors.text }}>
                  Trusted Expertise
                </h3>
                <p style={{ color: colors.lightText }}>
                  Our team of certified accountants brings decades of experience across various industries, 
                  ensuring you receive knowledgeable guidance for your specific needs.
                </p>
              </FadeIn>
            </div>
            
            {/* Reason 2 */}
            <div className="text-center">
              <FadeIn delay={0.2}>
                <div className="mx-auto rounded-full p-4 w-16 h-16 mb-6 flex items-center justify-center" style={{ backgroundColor: colors.ctaButton }}>
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ color: colors.text }}>
                  Proactive Approach
                </h3>
                <p style={{ color: colors.lightText }}>
                  We don't just respond to your tax needs; we proactively identify opportunities to 
                  optimize your finances and help your business grow throughout the year.
                </p>
              </FadeIn>
            </div>
            
            {/* Reason 3 */}
            <div className="text-center">
              <FadeIn delay={0.3}>
                <div className="mx-auto rounded-full p-4 w-16 h-16 mb-6 flex items-center justify-center" style={{ backgroundColor: colors.ctaButton }}>
                  <PhoneCall className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ color: colors.text }}>
                  Personalized Service
                </h3>
                <p style={{ color: colors.lightText }}>
                  We build long-term relationships with our clients, taking the time to understand 
                  your unique needs and providing customized solutions that work for you.
                </p>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0" 
          style={{ 
            background: `linear-gradient(135deg, ${colors.ctaButton}80 0%, ${colors.accent}80 100%)`,
            opacity: 0.9
          }}
        ></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Ready to Transform Your Business Finances?
              </h2>
              <p className="text-lg mb-8 text-white opacity-90">
                Book a free 30-minute strategy session with our expert accountants. 
                We'll discuss your current challenges and identify opportunities for growth.
              </p>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <Button 
                  className="px-8 py-3 rounded-full text-white font-medium"
                  style={{ backgroundColor: colors.ctaButton }}
                >
                  <span className="flex items-center">
                    Schedule Consultation
                    <Calendar className="ml-2 h-5 w-5" />
                  </span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="px-8 py-3 rounded-full border-2 font-medium"
                  style={{ borderColor: 'white', color: 'white' }}
                >
                  <span className="flex items-center">
                    Call Us Now
                    <PhoneCall className="ml-2 h-5 w-5" />
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
                Modern accounting services for growing businesses. We help you optimize finances, 
                reduce tax liabilities, and achieve sustainable growth.
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
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 opacity-80">
                <li><a href="#" className="hover:opacity-100">Tax Planning</a></li>
                <li><a href="#" className="hover:opacity-100">Business Advisory</a></li>
                <li><a href="#" className="hover:opacity-100">Accounting & Bookkeeping</a></li>
                <li><a href="#" className="hover:opacity-100">Payroll Services</a></li>
                <li><a href="#" className="hover:opacity-100">Business Formation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Industries</h4>
              <ul className="space-y-2 opacity-80">
                <li><a href="#" className="hover:opacity-100">Construction</a></li>
                <li><a href="#" className="hover:opacity-100">Professional Services</a></li>
                <li><a href="#" className="hover:opacity-100">Creative Industries</a></li>
                <li><a href="#" className="hover:opacity-100">Technology</a></li>
                <li><a href="#" className="hover:opacity-100">Hospitality</a></li>
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
              <p className="opacity-80">info@progressaccountants.co.uk</p>
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
                <a href="#" className="text-sm opacity-70 hover:opacity-100">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CreativeVioletHomeMockupPage;