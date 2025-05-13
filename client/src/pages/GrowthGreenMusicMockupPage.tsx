import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowRight, 
  Calendar, 
  CheckCircle2, 
  Download, 
  FileText, 
  Headphones,
  Mic,
  Music,
  PlayCircle, 
  Radio,
  Star,
  User,
  Disc,
  BarChart3,
  CreditCard,
  TrendingUp,
  Landmark,
  FileCheck
} from 'lucide-react';
import musicStudioImage from '@assets/image_1747065541266.png';
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

const GrowthGreenMusicMockupPage: React.FC = () => {
  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen">
      <Helmet>
        <title>Music Industry Specialists | Progress Accountants</title>
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
        className="text-white min-h-[80vh] relative flex items-center py-16 overflow-hidden"
        style={{ backgroundColor: colors.sectionBg }}
      >
        <div className="absolute inset-0 bg-gradient-to-b z-0" style={{ 
          backgroundImage: `linear-gradient(to bottom, ${colors.sectionBg} 0%, transparent 100%)` 
        }}></div>
        
        <div className="container mx-auto px-6 md:px-12 z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <SlideInLeft>
              <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: colors.text }}>
                Grow Your Music Business with Strategic Financial Planning
              </h1>
              
              <p className="text-lg mb-8 leading-relaxed" style={{ color: colors.lightText }}>
                We understand the unique financial challenges of musicians, producers, 
                and music businesses. Our specialized accounting services help you 
                maximize revenue, optimize tax strategies, and focus on sustainable growth.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a href="#consultation">
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
          
          {/* Right content - Studio image */}
          <div className="md:w-1/2 mt-10 md:mt-0">
            <div className="relative">
              <div 
                className="rounded-lg overflow-hidden shadow-xl relative aspect-[4/3]"
              >
                <img 
                  src={musicStudioImage} 
                  alt="Professional Recording Studio" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="absolute -bottom-6 -right-6 rounded-lg p-4 shadow-lg z-10 max-w-[260px]" style={{ backgroundColor: 'white' }}>
                <div className="flex">
                  <div className="mr-3 flex-shrink-0">
                    <div className="rounded-full p-2" style={{ backgroundColor: colors.accent, color: colors.text }}>
                      <TrendingUp className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: colors.text }}>Growth-Focused Solutions</p>
                    <p className="text-sm text-gray-600">Sustainable strategies for music businesses</p>
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
                <h3 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>32%</h3>
                <p style={{ color: colors.lightText }}>Average revenue growth</p>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div 
                  className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.accent }}
                >
                  <Music className="h-7 w-7" style={{ color: colors.text }} />
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>120+</h3>
                <p style={{ color: colors.lightText }}>Music industry clients</p>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.3}>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div 
                  className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.accent }}
                >
                  <BarChart3 className="h-7 w-7" style={{ color: colors.text }} />
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>£3.2M</h3>
                <p style={{ color: colors.lightText }}>Tax saved for clients</p>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.4}>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div 
                  className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.accent }}
                >
                  <Disc className="h-7 w-7" style={{ color: colors.text }} />
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>15+ Years</h3>
                <p style={{ color: colors.lightText }}>Music industry expertise</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Music Industry Specific Challenges */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <ScaleIn>
              <h2 className="text-3xl font-bold mb-4" style={{ color: colors.text }}>
                Specialized Financial Solutions for Music Professionals
              </h2>
              <p className="max-w-3xl mx-auto" style={{ color: colors.lightText }}>
                The music industry has unique financial challenges and opportunities. Our growth-focused team provides expertise in all areas of music business finance.
              </p>
            </ScaleIn>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {/* Card 1 */}
            <SlideUp delay={0.1}>
              <Card className="h-full transition-all duration-300 hover:shadow-lg" style={{ borderColor: colors.border }}>
                <CardContent className="p-6">
                  <div className="p-3 rounded-full w-fit mb-4" style={{ backgroundColor: colors.highlight }}>
                    <TrendingUp className="h-6 w-6" style={{ color: colors.ctaButton }} />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>Royalty Income Growth</h3>
                  <p className="mb-4" style={{ color: colors.lightText }}>
                    Strategies to maximize and optimize your royalty income streams for sustainable business growth.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.ctaButton }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>Streaming platform optimization</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.ctaButton }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>Revenue forecasting models</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.ctaButton }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>Contract optimization</span>
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
                    <FileCheck className="h-6 w-6" style={{ color: colors.ctaButton }} />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>Tour & Performance Finance</h3>
                  <p className="mb-4" style={{ color: colors.lightText }}>
                    Comprehensive financial management for tours and live events to maximize profitability and growth.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.ctaButton }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>International VAT optimization</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.ctaButton }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>Tour budget growth models</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.ctaButton }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>Merchandise revenue expansion</span>
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
                    <CreditCard className="h-6 w-6" style={{ color: colors.ctaButton }} />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>Strategic Tax Planning</h3>
                  <p className="mb-4" style={{ color: colors.lightText }}>
                    Growth-focused tax strategies designed specifically for music businesses and creative professionals.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.ctaButton }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>Creative industry tax reliefs</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.ctaButton }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>Strategic entity structuring</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.ctaButton }} />
                      <span className="text-sm" style={{ color: colors.lightText }}>Equipment investment planning</span>
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
                View All Music Industry Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </span>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Growth Process Section */}
      <section className="py-20" style={{ backgroundColor: colors.sectionBg }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <FadeIn>
              <h2 className="text-3xl font-bold mb-4" style={{ color: colors.text }}>
                Our Music Industry Growth Process
              </h2>
              <p className="max-w-3xl mx-auto" style={{ color: colors.lightText }}>
                We follow a proven approach to help your music business identify opportunities and achieve sustainable growth.
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
                    We analyze your current financial position, understand your goals, and identify music-specific growth opportunities.
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
                    We develop a tailored growth strategy designed to optimize your music business finances and fuel sustainable expansion.
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
                    We execute the strategy with precision, implementing music-specific systems and processes for sustainable growth.
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
                    We continuously monitor performance, adapt to industry changes, and identify new opportunities for music business growth.
                  </p>
                </div>
              </SlideUp>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Case Study */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <FadeIn>
              <h2 className="text-3xl font-bold mb-4" style={{ color: colors.text }}>
                Growth Success Story
              </h2>
              <p className="max-w-3xl mx-auto" style={{ color: colors.lightText }}>
                See how we helped a leading independent record label optimize their financial operations and achieve 45% year-over-year growth.
              </p>
            </FadeIn>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2">
              <SlideInLeft>
                <div 
                  className="rounded-lg overflow-hidden shadow-xl relative aspect-video"
                >
                  <div className="relative w-full h-full">
                    <img 
                      src={musicStudioImage} 
                      alt="Music Studio Case Study" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center p-6">
                      <PlayCircle className="w-16 h-16 mb-4 text-white" />
                      <p className="text-center italic text-white font-medium">
                        Video Case Study: How we helped Harmony Records achieve sustainable growth
                      </p>
                    </div>
                  </div>
                </div>
              </SlideInLeft>
            </div>
            
            <div className="md:w-1/2 mt-8 md:mt-0" style={{ color: colors.text }}>
              <SlideInRight>
                <h3 className="text-2xl font-bold mb-6">
                  Harmony Records: 45% Year-Over-Year Growth
                </h3>
                <p className="mb-6">
                  Harmony Records, an independent UK label with 12 artists, was struggling with complex royalty accounting and inefficient financial systems limiting their growth potential.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="p-2 rounded-full mr-3" style={{ backgroundColor: colors.ctaButton, color: 'white' }}>
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Challenge</h4>
                      <p>Complex royalty tracking, inefficient tax structure, and limited financial visibility hampering growth</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="p-2 rounded-full mr-3" style={{ backgroundColor: colors.ctaButton, color: 'white' }}>
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Solution</h4>
                      <p>Implemented growth-focused financial strategy with automated royalty tracking and optimized business structure</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="p-2 rounded-full mr-3" style={{ backgroundColor: colors.ctaButton, color: 'white' }}>
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Results</h4>
                      <p>45% year-over-year growth, £175,000 in tax savings, and expanded from regional to international operations</p>
                    </div>
                  </div>
                </div>
                <Button 
                  className="rounded-full px-6 py-3" 
                  style={{ backgroundColor: colors.ctaButton, color: 'white' }}
                >
                  <span className="flex items-center">
                    Read Full Case Study
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </Button>
              </SlideInRight>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team - Brief Section */}
      <section className="py-16" style={{ backgroundColor: colors.sectionBg }}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <SlideInLeft>
                <h2 className="text-3xl font-bold mb-6" style={{ color: colors.text }}>
                  Our Music Industry Growth Specialists
                </h2>
                <p className="mb-6" style={{ color: colors.lightText }}>
                  Our team includes certified accountants with hands-on experience in the music industry. 
                  We understand both the creative and financial aspects of your business, with a focus on sustainable growth.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-3" style={{ color: colors.ctaButton }} />
                    <span style={{ color: colors.text }}>Emily Chen, Director of Music Industry Growth</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-3" style={{ color: colors.ctaButton }} />
                    <span style={{ color: colors.text }}>Michael Taylor, Royalty Growth Specialist</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-3" style={{ color: colors.ctaButton }} />
                    <span style={{ color: colors.text }}>James Wilson, Tour Finance Strategist</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="rounded-full px-6 py-3 border-2" 
                  style={{ borderColor: colors.ctaButton, color: colors.ctaButton }}
                >
                  <span className="flex items-center">
                    Meet Our Full Team
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </Button>
              </SlideInLeft>
            </div>
            
            <div className="md:w-1/2 mt-8 md:mt-0">
              <SlideInRight>
                <div className="relative rounded-lg overflow-hidden shadow-xl">
                  <img 
                    src={teamPhotoImage} 
                    alt="Our Music Industry Team" 
                    className="w-full h-auto"
                  />
                  <div 
                    className="absolute inset-0 opacity-10" 
                    style={{ 
                      background: `linear-gradient(to bottom right, ${colors.accent}, ${colors.ctaButton})` 
                    }}
                  ></div>
                </div>
              </SlideInRight>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <FadeIn>
              <h2 className="text-3xl font-bold mb-4" style={{ color: colors.text }}>
                Growth Success Stories
              </h2>
              <p className="max-w-3xl mx-auto" style={{ color: colors.lightText }}>
                See how our growth-focused approach has helped music businesses achieve sustainable success.
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
                    "Progress Accountants transformed our royalty tracking and financial strategy. Their growth-focused approach helped us increase revenue by 37% in just 12 months. Their music industry knowledge is exceptional."
                  </p>
                  <div className="flex items-center">
                    <div className="rounded-full w-12 h-12 bg-gray-300 mr-4" style={{ backgroundColor: colors.highlight }}></div>
                    <div>
                      <p className="font-semibold" style={{ color: colors.text }}>Sarah Thompson</p>
                      <p className="text-sm" style={{ color: colors.lightText }}>CEO, Soundwave Studios</p>
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
                    "As an independent artist, managing finances was overwhelming and limiting my growth. The team at Progress created a streamlined system and growth strategy that let me focus on my music while expanding my business."
                  </p>
                  <div className="flex items-center">
                    <div className="rounded-full w-12 h-12 bg-gray-300 mr-4" style={{ backgroundColor: colors.highlight }}></div>
                    <div>
                      <p className="font-semibold" style={{ color: colors.text }}>David Chen</p>
                      <p className="text-sm" style={{ color: colors.lightText }}>Recording Artist</p>
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
                    "Progress Accountants helped us navigate complex international tour finance issues while maintaining our growth trajectory. Their expertise in music industry taxation and financial planning has been instrumental to our expansion."
                  </p>
                  <div className="flex items-center">
                    <div className="rounded-full w-12 h-12 bg-gray-300 mr-4" style={{ backgroundColor: colors.highlight }}></div>
                    <div>
                      <p className="font-semibold" style={{ color: colors.text }}>Rebecca Wilson</p>
                      <p className="text-sm" style={{ color: colors.lightText }}>Manager, The Resonance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SlideUp>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="consultation" className="py-20 relative overflow-hidden">
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
                Ready to Grow Your Music Business?
              </h2>
              <p className="text-lg mb-8 text-white opacity-90">
                Book a complimentary growth strategy session with our music industry specialists. 
                We'll analyze your current situation and identify opportunities for sustainable growth.
              </p>
              
              <div className="bg-white p-8 rounded-lg shadow-xl">
                <h3 className="text-xl font-bold mb-6" style={{ color: colors.text }}>
                  Book Your Free Growth Strategy Session
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                      Your Name
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                      style={{ borderColor: colors.border, color: colors.text }} 
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                      Your Email
                    </label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                      style={{ borderColor: colors.border, color: colors.text }} 
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                      Phone Number
                    </label>
                    <input 
                      type="tel" 
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2" 
                      style={{ borderColor: colors.border, color: colors.text }}
                      placeholder="+44 7700 900123"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                      Your Role in Music
                    </label>
                    <select 
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                      style={{ borderColor: colors.border, color: colors.text }}
                    >
                      <option>Artist/Musician</option>
                      <option>Producer</option>
                      <option>Label Owner</option>
                      <option>Studio Owner</option>
                      <option>Manager</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Tell us about your growth goals
                  </label>
                  <textarea 
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2" 
                    style={{ borderColor: colors.border, color: colors.text }}
                    rows={4}
                    placeholder="What growth challenges are you facing in your music business?"
                  ></textarea>
                </div>
                <Button 
                  className="w-full py-3 rounded-full text-white font-medium"
                  style={{ backgroundColor: colors.ctaButton }}
                >
                  Schedule Your Free Growth Strategy Session
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
                Growth-focused financial services for the music industry and creative professionals.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
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
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Growth Services</h4>
              <ul className="space-y-2 opacity-80">
                <li><a href="#" className="hover:opacity-100">Royalty Income Growth</a></li>
                <li><a href="#" className="hover:opacity-100">Tour & Performance Finance</a></li>
                <li><a href="#" className="hover:opacity-100">Strategic Tax Planning</a></li>
                <li><a href="#" className="hover:opacity-100">Financial Management</a></li>
                <li><a href="#" className="hover:opacity-100">Business Growth Planning</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 opacity-80">
                <li><a href="#" className="hover:opacity-100">Growth Case Studies</a></li>
                <li><a href="#" className="hover:opacity-100">Music Industry Blog</a></li>
                <li><a href="#" className="hover:opacity-100">Tax Guides</a></li>
                <li><a href="#" className="hover:opacity-100">Webinars</a></li>
                <li><a href="#" className="hover:opacity-100">Growth Calculators</a></li>
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
              <p className="opacity-80">music@progressaccountants.co.uk</p>
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

export default GrowthGreenMusicMockupPage;