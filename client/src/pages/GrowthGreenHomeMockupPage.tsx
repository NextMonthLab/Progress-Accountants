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
  TrendingUp,
  LineChart,
  PieChart,
  Leaf
} from 'lucide-react';
import teamPhotoImage from '../assets/images/team_photo.jpg';

// Growth Green Theme colors
const colors = {
  background: '#F2FBF9',
  ctaButton: '#00BFA5',
  text: '#083B37',
  accent: '#8CE7D6',
  sectionBg: '#E1F4F0',
  headerBg: '#083B37',
  headerText: '#FFFFFF',
  secondary: '#26A69A',
  lightText: '#2A6763',
  cardBg: '#FFFFFF',
  footerBg: '#083B37',
  footerText: '#F2FBF9',
  border: '#C2E8E0',
  highlight: '#B2EBE0'
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

const GrowthGreenHomeMockupPage: React.FC = () => {
  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen">
      <Helmet>
        <title>Progress Accountants | Growth Green Theme</title>
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
                Grow Your Business<br />With Strategic Finance
              </h1>
              
              <p className="text-lg mb-8 leading-relaxed" style={{ color: colors.lightText }}>
                We help ambitious businesses optimize their finances, reduce tax liabilities, 
                and create sustainable growth strategies. Our approach combines 
                expertise, technology, and personalized service.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a href="#contact">
                  <Button 
                    className="px-6 py-3 rounded-full text-white"
                    style={{ backgroundColor: colors.ctaButton }}
                  >
                    <span className="font-medium flex items-center">
                      Book Your Growth Strategy Session
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

      {/* Growth Metrics Section */}
      <section className="py-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <FadeIn delay={0.1}>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div 
                  className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.accent }}
                >
                  <TrendingUp className="h-7 w-7" style={{ color: colors.text }} />
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>£2.3M</h3>
                <p style={{ color: colors.lightText }}>Average client growth</p>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div 
                  className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.accent }}
                >
                  <Users className="h-7 w-7" style={{ color: colors.text }} />
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>350+</h3>
                <p style={{ color: colors.lightText }}>Satisfied clients</p>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.3}>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div 
                  className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.accent }}
                >
                  <PieChart className="h-7 w-7" style={{ color: colors.text }} />
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>£8.5M</h3>
                <p style={{ color: colors.lightText }}>Tax saved annually</p>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.4}>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div 
                  className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.accent }}
                >
                  <Calendar className="h-7 w-7" style={{ color: colors.text }} />
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>15+ Years</h3>
                <p style={{ color: colors.lightText }}>Industry experience</p>
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
                Financial Services for Sustainable Growth
              </h2>
              <p className="max-w-3xl mx-auto" style={{ color: colors.lightText }}>
                We provide a comprehensive suite of financial services tailored to help your business 
                achieve sustainable growth and long-term success.
              </p>
            </ScaleIn>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <SlideUp delay={0.1}>
              <Card className="h-full transition-all duration-300 hover:shadow-lg" style={{ borderColor: colors.border }}>
                <CardContent className="p-6">
                  <div className="p-3 rounded-full w-fit mb-4" style={{ backgroundColor: colors.highlight }}>
                    <TrendingUp className="h-6 w-6" style={{ color: colors.ctaButton }} />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>Growth Strategy</h3>
                  <p className="mb-4" style={{ color: colors.lightText }}>
                    Tailored financial planning and growth strategies to help your business scale sustainably.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.ctaButton }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>Cash flow management</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.ctaButton }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>Expansion planning</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.ctaButton }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>Profit optimization</span>
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
                    <Calculator className="h-6 w-6" style={{ color: colors.ctaButton }} />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>Tax Optimization</h3>
                  <p className="mb-4" style={{ color: colors.lightText }}>
                    Strategic tax planning and efficient preparation to minimize liabilities and maximize savings.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.ctaButton }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>Strategic tax planning</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.ctaButton }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>Tax-efficient structures</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.ctaButton }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>Tax credit optimization</span>
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
                    <LineChart className="h-6 w-6" style={{ color: colors.ctaButton }} />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>Financial Analytics</h3>
                  <p className="mb-4" style={{ color: colors.lightText }}>
                    Data-driven financial analysis and reporting to empower your business decisions.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.ctaButton }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>Performance dashboards</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.ctaButton }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>Financial forecasting</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.ctaButton }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>Trend analysis</span>
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
                Explore All Services
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
                Our Growth-Focused Approach
              </h2>
              <p className="max-w-3xl mx-auto" style={{ color: colors.lightText }}>
                We follow a proven process to help your business identify opportunities, overcome challenges, and achieve sustainable growth.
              </p>
            </FadeIn>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <SlideUp delay={0.1}>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div 
                    className="w-14 h-14 mb-4 rounded-full flex items-center justify-center font-bold text-white text-xl"
                    style={{ backgroundColor: colors.ctaButton }}
                  >
                    1
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>Discover</h3>
                  <p style={{ color: colors.lightText }}>
                    We analyze your current financial position, understand your goals, and identify growth opportunities.
                  </p>
                </div>
              </SlideUp>
              <div className="hidden md:block absolute top-10 right-0 w-1/2 h-2 -mr-4 z-10" style={{ backgroundColor: colors.accent }}></div>
            </div>
            
            {/* Step 2 */}
            <div className="relative">
              <SlideUp delay={0.2}>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div 
                    className="w-14 h-14 mb-4 rounded-full flex items-center justify-center font-bold text-white text-xl"
                    style={{ backgroundColor: colors.ctaButton }}
                  >
                    2
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>Strategize</h3>
                  <p style={{ color: colors.lightText }}>
                    We develop a tailored financial strategy designed to optimize your finances and fuel growth.
                  </p>
                </div>
              </SlideUp>
              <div className="hidden md:block absolute top-10 right-0 w-1/2 h-2 -mr-4 z-10" style={{ backgroundColor: colors.accent }}></div>
            </div>
            
            {/* Step 3 */}
            <div className="relative">
              <SlideUp delay={0.3}>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div 
                    className="w-14 h-14 mb-4 rounded-full flex items-center justify-center font-bold text-white text-xl"
                    style={{ backgroundColor: colors.ctaButton }}
                  >
                    3
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>Implement</h3>
                  <p style={{ color: colors.lightText }}>
                    We execute the strategy with precision, implementing systems and processes for sustainable growth.
                  </p>
                </div>
              </SlideUp>
              <div className="hidden md:block absolute top-10 right-0 w-1/2 h-2 -mr-4 z-10" style={{ backgroundColor: colors.accent }}></div>
            </div>
            
            {/* Step 4 */}
            <div>
              <SlideUp delay={0.4}>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div 
                    className="w-14 h-14 mb-4 rounded-full flex items-center justify-center font-bold text-white text-xl"
                    style={{ backgroundColor: colors.ctaButton }}
                  >
                    4
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>Optimize</h3>
                  <p style={{ color: colors.lightText }}>
                    We continuously monitor performance, make adjustments, and identify new opportunities for growth.
                  </p>
                </div>
              </SlideUp>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <FadeIn>
              <h2 className="text-3xl font-bold mb-4" style={{ color: colors.text }}>
                Growth Success Stories
              </h2>
              <p className="max-w-3xl mx-auto" style={{ color: colors.lightText }}>
                See how we've helped businesses like yours achieve sustainable growth and financial success.
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
                      <Star key={index} className="h-5 w-5 fill-current" style={{ color: colors.ctaButton }} />
                    ))}
                  </div>
                  <p className="italic mb-6" style={{ color: colors.lightText }}>
                    "Progress Accountants transformed our financial strategy. We went from struggling with cash flow to 
                    achieving 34% year-over-year growth. Their proactive approach has been invaluable."
                  </p>
                  <div className="flex items-center">
                    <div className="rounded-full w-12 h-12 bg-gray-300 mr-4" style={{ backgroundColor: colors.highlight }}></div>
                    <div>
                      <p className="font-semibold" style={{ color: colors.text }}>Mark Johnson</p>
                      <p className="text-sm" style={{ color: colors.lightText }}>CEO, Evergreen Technologies</p>
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
                      <Star key={index} className="h-5 w-5 fill-current" style={{ color: colors.ctaButton }} />
                    ))}
                  </div>
                  <p className="italic mb-6" style={{ color: colors.lightText }}>
                    "The growth strategy developed by Progress Accountants helped us expand from one location to three in just 18 months. 
                    Their financial insights and planning were critical to our success."
                  </p>
                  <div className="flex items-center">
                    <div className="rounded-full w-12 h-12 bg-gray-300 mr-4" style={{ backgroundColor: colors.highlight }}></div>
                    <div>
                      <p className="font-semibold" style={{ color: colors.text }}>Sarah Williams</p>
                      <p className="text-sm" style={{ color: colors.lightText }}>Founder, Urban Wellness</p>
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
                      <Star key={index} className="h-5 w-5 fill-current" style={{ color: colors.ctaButton }} />
                    ))}
                  </div>
                  <p className="italic mb-6" style={{ color: colors.lightText }}>
                    "As a small business owner, I was overwhelmed by financial complexity. Progress Accountants simplified everything, 
                    optimized our taxes, and helped us grow 45% in our first year working together."
                  </p>
                  <div className="flex items-center">
                    <div className="rounded-full w-12 h-12 bg-gray-300 mr-4" style={{ backgroundColor: colors.highlight }}></div>
                    <div>
                      <p className="font-semibold" style={{ color: colors.text }}>David Chen</p>
                      <p className="text-sm" style={{ color: colors.lightText }}>Director, Framework Design</p>
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
                View More Success Stories
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
                We're more than just accountants. We're growth partners committed to your long-term success.
              </p>
            </FadeIn>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Reason 1 */}
            <div className="text-center">
              <FadeIn delay={0.1}>
                <div className="mx-auto rounded-full p-4 w-16 h-16 mb-6 flex items-center justify-center" style={{ backgroundColor: colors.accent }}>
                  <TrendingUp className="w-8 h-8" style={{ color: colors.text }} />
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ color: colors.text }}>
                  Growth Expertise
                </h3>
                <p style={{ color: colors.lightText }}>
                  Our team specializes in growth-focused financial strategies that help businesses scale 
                  sustainably while maintaining profitability.
                </p>
              </FadeIn>
            </div>
            
            {/* Reason 2 */}
            <div className="text-center">
              <FadeIn delay={0.2}>
                <div className="mx-auto rounded-full p-4 w-16 h-16 mb-6 flex items-center justify-center" style={{ backgroundColor: colors.accent }}>
                  <BarChart3 className="w-8 h-8" style={{ color: colors.text }} />
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ color: colors.text }}>
                  Data-Driven Insights
                </h3>
                <p style={{ color: colors.lightText }}>
                  We leverage advanced financial analytics to provide actionable insights 
                  that drive smarter business decisions and optimize performance.
                </p>
              </FadeIn>
            </div>
            
            {/* Reason 3 */}
            <div className="text-center">
              <FadeIn delay={0.3}>
                <div className="mx-auto rounded-full p-4 w-16 h-16 mb-6 flex items-center justify-center" style={{ backgroundColor: colors.accent }}>
                  <Leaf className="w-8 h-8" style={{ color: colors.text }} />
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ color: colors.text }}>
                  Sustainable Approach
                </h3>
                <p style={{ color: colors.lightText }}>
                  We focus on creating sustainable, long-term growth strategies rather than 
                  short-term fixes, ensuring enduring success for your business.
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
            background: `linear-gradient(135deg, ${colors.ctaButton}80 0%, ${colors.secondary}80 100%)`,
            opacity: 0.9
          }}
        ></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Ready to Accelerate Your Business Growth?
              </h2>
              <p className="text-lg mb-8 text-white opacity-90">
                Book a complimentary growth strategy session with our expert accountants. 
                We'll analyze your current financial position and identify opportunities for sustainable growth.
              </p>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <Button 
                  className="px-8 py-3 rounded-full text-white font-medium"
                  style={{ backgroundColor: colors.text }}
                >
                  <span className="flex items-center">
                    Schedule Growth Session
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
                Growth-focused financial services for ambitious businesses. We help you optimize finances, 
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
                <li><a href="#" className="hover:opacity-100">Growth Strategy</a></li>
                <li><a href="#" className="hover:opacity-100">Tax Optimization</a></li>
                <li><a href="#" className="hover:opacity-100">Financial Analytics</a></li>
                <li><a href="#" className="hover:opacity-100">Business Advisory</a></li>
                <li><a href="#" className="hover:opacity-100">Accounting & Bookkeeping</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Industries</h4>
              <ul className="space-y-2 opacity-80">
                <li><a href="#" className="hover:opacity-100">Technology</a></li>
                <li><a href="#" className="hover:opacity-100">E-commerce</a></li>
                <li><a href="#" className="hover:opacity-100">Professional Services</a></li>
                <li><a href="#" className="hover:opacity-100">Healthcare</a></li>
                <li><a href="#" className="hover:opacity-100">Manufacturing</a></li>
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
              <p className="opacity-80">growth@progressaccountants.co.uk</p>
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

export default GrowthGreenHomeMockupPage;