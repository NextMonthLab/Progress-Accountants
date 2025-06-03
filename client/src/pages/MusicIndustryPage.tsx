import { motion, useScroll, useTransform } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section ref={headerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
        
        <div className="container mx-auto px-6 md:px-8 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-block bg-purple-900/20 text-purple-300 px-4 py-2 rounded-full text-sm font-medium border border-purple-500/30">
                Music Industry Specialists
              </span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                Expert Accounting for
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4]">
                Music Professionals
              </span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              From royalty management to tour accounting, we understand the unique financial challenges of the music industry.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] hover:shadow-lg hover:shadow-purple-500/25 text-white border-none font-medium">
                Get started today
              </Button>
              <Button size="lg" variant="outline" className="border-purple-400/30 text-purple-300 hover:bg-purple-900/20 hover:border-purple-400">
                Learn more
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

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