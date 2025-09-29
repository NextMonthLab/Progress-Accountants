import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { withMemo } from "@/lib/withMemo";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { ArrowRight, CheckCircle, Music, PlayCircle, ArrowDown, Clock, Banknote, Award, Users, Headphones, Radio } from "lucide-react";
import { FadeIn } from "@/components/ui/ScrollAnimation";

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
        🎵 Stop Losing Money to Music Industry Confusion
      </h2>
      <p className="text-white text-lg max-w-2xl mb-8">
        Get our free Music Money Assessment and discover exactly how much you've been leaving on the table. We'll show you the royalty income you didn't know existed and the tax savings most musicians miss.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={() => {
            window.open('https://calendly.com/progress-accountants/free-consultation-progress-accountants', '_blank', 'width=700,height=800,resizable=yes,scrollbars=yes');
          }}
          size="lg" 
          className="bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] hover:shadow-lg hover:shadow-purple-500/25 text-white border-none font-medium cursor-pointer"
        >
          Book a Consultation
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

const MusicIndustryPage = () => {
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
              backgroundImage: `url(${musicStudioBackgroundImg})`,
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
              backgroundImage: `url(${musicStudioBackgroundImg})`,
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
                <span className="block">The Musician's</span>
                <span className="block">Money Nightmare</span>
              </h1>
            </FadeIn>

            {/* Gold Standard Subheadline - 18-24 words max, single sentence */}
            <FadeIn delay={0.2}>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto"
                 style={{
                   textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)',
                   letterSpacing: '0.01em'
                 }}>
                You're making music, but are you making money? Most artists are leaving thousands on the table because creative accounting is an oxymoron.
              </p>
            </FadeIn>

            {/* Gold Standard Universal Button - Rob Hutt Design System */}
            <FadeIn delay={0.3}>
              <button
                className="relative inline-flex items-center justify-center font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-purple-500/50 border-0"
                style={{ 
                  fontSize: 'clamp(16px, 2.5vw, 20px)',
                  padding: 'clamp(16px, 2.5vw, 20px) clamp(32px, 6vw, 48px)',
                  minHeight: '56px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(90deg, #7C3AED, #EC4899)',
                  boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4), 0 2px 8px rgba(236, 72, 153, 0.3)',
                  color: '#FFFFFF',
                  textAlign: 'center',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(90deg, #6D28D9, #DB2777)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(124, 58, 237, 0.6), 0 3px 12px rgba(236, 72, 153, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(90deg, #7C3AED, #EC4899)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(124, 58, 237, 0.4), 0 2px 8px rgba(236, 72, 153, 0.3)';
                }}
                onClick={() => window.open('https://calendly.com/progressaccountants/discovery-call', '_blank')}
                aria-label="Book a strategy consultation for music industry services"
              >
                Book My Strategy Call
              </button>
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Every Musician's Financial Catch-22</h2>
            <p className="text-lg text-gray-300">
              You're passionate about creating music, but the money side is chaos. Royalties arrive randomly, touring expenses spiral out of control, and tax time feels like trying to mix a track blindfolded. Meanwhile, that next album depends on understanding numbers that make no sense.
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-gray-900 rounded-xl shadow-md p-6 md:p-8 mb-12 border border-gray-800">
            <p className="text-lg text-gray-300 mb-4">
              We've helped musicians discover over £500k in overlooked royalties and tax savings. We understand that creativity and spreadsheets don't mix—that's why we handle the numbers so you can focus on the music.
            </p>
            <div className="flex items-center">
              <div className="p-2 bg-purple-900/20 rounded-full mr-3">
                <Music className="h-5 w-5 text-purple-400" />
              </div>
              <p className="font-medium text-white">🎵 Music industry accountants who actually understand royalties, touring, and creative chaos.</p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Stop Losing Money to Music Industry Confusion</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <FeatureCard 
              icon={Award}
              title="🎼 Untangle Your Royalty Chaos"
              description="Stop guessing where your money comes from. We track every stream, sync, and licensing deal so you finally understand what's actually making you money."
              accentColor="bg-orange-500"
            />
            <FeatureCard 
              icon={Banknote}
              title="🌍 Touring & International Tax Guidance"
              description="Playing internationally? We handle cross-border tax compliance, currency management, and travel expense optimisation—keeping you compliant wherever you perform."
              accentColor="bg-blue-500"
            />
            <FeatureCard 
              icon={Users}
              title="🤝 Smooth Payments for Freelancers & Session Musicians"
              description="Managing freelance payments and session musicians? We handle the compliance, contracts, and tax obligations—so everyone gets paid correctly and on time."
              accentColor="bg-green-500"
            />
            <FeatureCard 
              icon={Headphones}
              title="🎛️ Smart Studio & Equipment Investment"
              description="From mixing desks to tour vans—we optimise how you buy, lease, and write off equipment to maximise tax efficiency and support long-term growth."
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
              quote="Progress gave me complete control over my royalty income. For the first time, I actually understand my music finances."
              author="Independent Artist"
              role="Oxfordshire"
            />
            <Testimonial 
              quote="Having accountants who truly understand the music business makes all the difference. Progress delivers insights we can actually use."
              author="Recording Studio Owner"
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
              Whether you're recording your next single or managing a touring act—we support music businesses at every level:
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
          <motion.div variants={itemVariants} className="max-w-6xl mx-auto bg-gray-900 rounded-xl shadow-md border border-gray-800 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Content side */}
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Our Tech-Forward Approach</h2>
                <p className="text-gray-300 mb-6">
                  We use cloud-based platforms like Xero to give you real-time visibility into your income and expenses:
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-400 mr-3 shrink-0 mt-1" />
                    <p className="text-gray-300">Real-time views of income from streaming, distributors, and live performances</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-400 mr-3 shrink-0 mt-1" />
                    <p className="text-gray-300">Categorised expenses from tours, equipment purchases, and studio costs</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-400 mr-3 shrink-0 mt-1" />
                    <p className="text-gray-300">Live tax estimates so there are no unexpected bills</p>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-800">
                  <p className="text-white font-medium">More comfortable with voice notes than spreadsheets? We adapt to your workflow—not the other way around.</p>
                </div>
              </div>
              
              {/* Image side */}
              <div className="relative lg:min-h-[400px] flex items-center justify-center bg-gray-800">
                <div className="p-6 w-full h-full flex items-center justify-center">
                  <img 
                    src="https://res.cloudinary.com/drl0fxrkq/image/upload/v1749050354/image_3_zggavz.png"
                    alt="Music industry analytics and technology dashboard"
                    className="w-full h-auto max-h-full object-contain rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* CTA section */}
          <CTASection />
        </motion.div>
      </div>
    </div>
  );
};

export default withMemo(MusicIndustryPage);