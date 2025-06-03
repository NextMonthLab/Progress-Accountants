import { motion, useScroll, useTransform } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRef, useEffect } from "react";
import { 
  Music, 
  TrendingUp, 
  DollarSign, 
  FileText, 
  Users, 
  Headphones,
  Mic,
  Radio,
  PlayCircle,
  Star,
  CheckCircle,
  ArrowRight
} from "lucide-react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Feature card component
const FeatureCard = ({ icon: Icon, title, description }: { 
  icon: React.ElementType, 
  title: string, 
  description: string 
}) => (
  <motion.div variants={itemVariants}>
    <Card className="bg-gray-900 border-gray-800 hover:border-purple-500/50 transition-all duration-300 h-full">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="p-3 rounded-full bg-purple-900/20 mr-4">
            <Icon className="h-6 w-6 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        <p className="text-gray-300 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

// Testimonial component
const Testimonial = ({ quote, author, role }: { quote: string, author: string, role: string }) => (
  <motion.div variants={itemVariants}>
    <Card className="bg-gray-900 border-gray-800 h-full">
      <CardContent className="p-6">
        <div className="flex items-start mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-5 w-5 text-purple-400 fill-purple-400" />
          ))}
        </div>
        <blockquote className="text-gray-300 text-lg mb-6 italic">
          "{quote}"
        </blockquote>
        <div>
          <div className="font-semibold text-white">{author}</div>
          <div className="text-purple-400 text-sm">{role}</div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// CTA section component
const CTASection = () => (
  <motion.div 
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    variants={containerVariants}
    className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-2xl p-8 md:p-12 text-center border border-purple-500/20"
  >
    <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-white mb-6">
      Ready to Take Your Music Career to the Next Level?
    </motion.h2>
    <motion.p variants={itemVariants} className="text-white text-lg max-w-2xl mx-auto mb-8">
      Whether you're a solo artist, band, or music business, book a call with our team to see how Progress can support your musical journey.
    </motion.p>
    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button size="lg" className="bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] hover:shadow-lg hover:shadow-purple-500/25 text-white border-none font-medium">
        Book a consultation
      </Button>
      <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-medium">
        View our services
      </Button>
    </motion.div>
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
        className="relative overflow-hidden w-full min-h-[500px]"
      >
        {/* Full-width background with dark overlay */}
        <div className="absolute inset-0 z-0">
          {/* Music studio background placeholder */}
          <div className="w-full h-full bg-gradient-to-br from-purple-900/30 via-black to-blue-900/30"></div>
          {/* Dark overlay for better text contrast */}
          <div className="absolute inset-0 bg-black opacity-60"></div>
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
                  Music Industry Specialists
                </span>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="mb-6"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Expert Accounting for the Music Industry
                </h1>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="mb-8"
              >
                <p className="text-lg md:text-xl text-white">
                  Helping You Maximize Royalty Revenue, Manage Tour Finances, and Keep Your Music Career on Track
                </p>
              </motion.div>
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] hover:shadow-lg hover:shadow-purple-500/25 text-white font-medium">
                  Book a free consultation
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 flex items-center gap-2">
                  Explore our services
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Right side image placeholder - matching film industry layout */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:w-1/2 relative"
            >
              <div className="relative bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl p-8 border border-purple-500/30">
                {/* Music studio placeholder */}
                <div className="bg-gray-800 rounded-xl h-64 md:h-80 flex items-center justify-center">
                  <div className="text-center">
                    <Headphones className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                    <p className="text-gray-400 text-sm">Music Studio Scene</p>
                  </div>
                </div>
                
                {/* Floating info card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="absolute -bottom-4 -right-4 bg-white rounded-xl p-4 shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Music className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">Royalty Tracking</div>
                      <div className="text-gray-600 text-xs">Maximize your returns</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Comprehensive Music Industry Services
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                We provide specialized accounting services tailored to the unique needs of musicians, labels, and music businesses.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={Music}
                title="Royalty Management"
                description="Track and manage performance, mechanical, and synchronization royalties across multiple platforms and territories."
              />
              <FeatureCard
                icon={TrendingUp}
                title="Tour Accounting"
                description="Comprehensive tour financial management including advance tracking, settlement reconciliation, and expense reporting."
              />
              <FeatureCard
                icon={DollarSign}
                title="Revenue Optimization"
                description="Maximize your income streams through strategic financial planning and revenue diversification strategies."
              />
              <FeatureCard
                icon={FileText}
                title="Music Tax Relief"
                description="Navigate complex music industry tax regulations and optimize your tax position with specialist expertise."
              />
              <FeatureCard
                icon={Users}
                title="Band Partnership Accounting"
                description="Manage complex revenue sharing agreements and partnership structures for bands and collectives."
              />
              <FeatureCard
                icon={Headphones}
                title="Streaming Analytics"
                description="Monitor and analyze streaming revenue across platforms with detailed financial reporting and insights."
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tech approach section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6 md:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="max-w-4xl mx-auto bg-gray-900 rounded-xl shadow-md border border-gray-800 overflow-hidden">
              <div className="p-8 md:p-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Our Music-Tech Integration</h2>
                <p className="text-gray-300 mb-6">
                  We integrate with leading music industry platforms and tools to provide real-time financial insights and streamlined reporting. 
                  Stay focused on your creativity while we handle the numbers.
                </p>
                <p className="text-gray-300 mb-8">
                  Our team understands the rhythm of the music industry and keeps pace with it, offering:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Real-time streaming revenue tracking",
                    "Automated royalty reconciliation",
                    "Tour settlement processing",
                    "Multi-currency financial reporting"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-purple-900/20 flex items-center justify-center mr-3">
                        <CheckCircle className="h-5 w-5 text-purple-400" />
                      </div>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6 md:px-8">
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
                quote="Progress helped us track our streaming royalties across 15 platforms—we discovered £12,000 in unclaimed revenue."
                author="Sarah Chen"
                role="Independent Artist"
              />
              <Testimonial 
                quote="Their tour accounting saved us countless hours and thousands in potential losses during our European tour."
                author="Marcus Williams"
                role="Band Manager, The Echoes"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">Trusted by Musicians, Labels, and Industry Professionals</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
                Progress is more than an accounting service—we're your financial partner throughout your musical journey. We've worked with:
              </p>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16">
              <ClientType icon={Mic} label="Solo artists" />
              <ClientType icon={Users} label="Bands & groups" />
              <ClientType icon={Radio} label="Record labels" />
              <ClientType icon={PlayCircle} label="Music producers" />
              <ClientType icon={Headphones} label="Audio engineers" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6 md:px-8">
          <CTASection />
        </div>
      </section>
    </div>
  );
};

export default MusicIndustryPage;