import { useState, useEffect } from "react";
import { z } from "zod";
import { organizations, deadlines, filters } from "@/data/smeSupport";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, Phone, Mail, Clock, Calendar, ExternalLink, 
  Search, Info, ArrowRight, CheckCircle, Calendar as CalendarIcon,
  Download, FileText, X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { EMBED_FORMS, hasValidEmbedCode, FORM_CONFIG } from "@/utils/embedForms";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
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

// Hero Section
const HeroSection = () => (
  <section className="relative py-20 bg-black overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-[#1a0b2e] via-black to-[#16213e] opacity-90" />
    <div className="container mx-auto px-6 md:px-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          SME Support Hub
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Everything UK small businesses need in one place—essential contacts, key deadlines, and downloadable resources.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-gray-300">
          <span className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-[#7B3FE4]" />
            Verified Contact Details
          </span>
          <span className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-[#7B3FE4]" />
            Key Tax Deadlines
          </span>
          <span className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-[#7B3FE4]" />
            Free PDF Resources
          </span>
        </div>
      </motion.div>
    </div>
  </section>
);

// Intro Section
const IntroSection = () => (
  <section className="py-16 bg-black">
    <div className="container mx-auto px-6 md:px-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="max-w-4xl mx-auto text-center"
      >
        <motion.h2 variants={itemVariants} className="text-3xl font-bold text-white mb-6">
          Never miss an important deadline again
        </motion.h2>
        <motion.p variants={itemVariants} className="text-gray-300 text-lg mb-12 max-w-3xl mx-auto">
          We keep track of the key dates and deadlines that matter to your business, 
          plus verified contact details for all the essential UK business support organisations.
        </motion.p>
      </motion.div>
    </div>
  </section>
);

// Directory Section
const DirectorySection = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-6 md:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search organizations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <div className="text-gray-400 text-sm">
                Showing all UK business support organizations
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredOrganizations.map((org, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-white">{org.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs bg-purple-900/30 text-purple-300 border-purple-600/30">
                      Business Support
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-300">
                    {org.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    {org.generalPhone && (
                      <div className="flex items-center text-gray-300">
                        <Phone className="h-4 w-4 mr-2 text-purple-400" />
                        <a href={`tel:${org.generalPhone}`} className="hover:text-purple-300 transition-colors">
                          {org.generalPhone}
                        </a>
                      </div>
                    )}
                    {org.specialistPhones && org.specialistPhones.length > 0 && (
                      <div className="flex items-center text-gray-300">
                        <Phone className="h-4 w-4 mr-2 text-purple-400" />
                        <a href={`tel:${org.specialistPhones[0].number}`} className="hover:text-purple-300 transition-colors">
                          {org.specialistPhones[0].number} ({org.specialistPhones[0].label})
                        </a>
                      </div>
                    )}
                    {org.email && (
                      <div className="flex items-center text-gray-300">
                        <Mail className="h-4 w-4 mr-2 text-purple-400" />
                        <a href={`mailto:${org.email}`} className="hover:text-purple-300 transition-colors">
                          {org.email}
                        </a>
                      </div>
                    )}
                    {org.hours && (
                      <div className="flex items-center text-gray-300">
                        <Clock className="h-4 w-4 mr-2 text-purple-400" />
                        <span>{org.hours}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-3">
                  <a
                    href={org.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Visit Website
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </CardFooter>
              </Card>
            ))}
          </motion.div>

          {filteredOrganizations.length === 0 && (
            <motion.div variants={itemVariants} className="text-center py-12">
              <p className="text-gray-400 text-lg">No organizations found matching your criteria.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

// Deadline Row Component
const DeadlineRow = ({ deadline }: { deadline: any }) => {
  const isUpcoming = deadline.status === 'upcoming';
  
  return (
    <tr className={`border-b border-gray-700 ${isUpcoming ? 'bg-purple-900/20' : ''}`}>
      <td className="py-3 px-4 text-white font-medium">
        {deadline.date}
        {isUpcoming && (
          <Badge className="ml-2 bg-purple-600 text-white text-xs">
            {deadline.status}
          </Badge>
        )}
      </td>
      <td className="py-3 px-4 text-gray-300">
        {deadline.description}
      </td>
    </tr>
  );
};

// Deadlines Section
const DeadlinesSection = () => {
  const sortedDeadlines = deadlines.sort((a, b) => {
    const dateA = new Date(a.date + ' 2025');
    const dateB = new Date(b.date + ' 2025');
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-6 md:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Key Business Deadlines</h2>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Never miss an important deadline again. We keep track of the key dates and deadlines that matter to your business.
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-gray-800/50 border border-gray-700 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] text-white">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium">Date</th>
                    <th className="py-3 px-4 text-left font-medium">Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDeadlines.map((deadline, index) => (
                    <DeadlineRow key={index} deadline={deadline} />
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="mt-8 text-center">
            <div className="inline-flex items-center bg-purple-900/20 text-purple-300 border border-purple-600/30 px-4 py-2 rounded-full">
              <Info className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Deadlines shown are for the 2024/25 tax year</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Download Resources Section
const DownloadResourcesSection = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showLeadCaptureForm, setShowLeadCaptureForm] = useState(false);
  const [leadCaptureEmbedCode, setLeadCaptureEmbedCode] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    if (hasValidEmbedCode(EMBED_FORMS.BUSINESS_CALCULATOR_LEAD_FORM)) {
      setLeadCaptureEmbedCode(EMBED_FORMS.BUSINESS_CALCULATOR_LEAD_FORM);
    }
  }, []);

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">📝 Download & Print Your Essentials</h2>
            <p className="text-gray-300 max-w-3xl mx-auto text-lg">
              Keep your key contacts and deadlines close with our free PDF packs—ideal for business owners, finance teams, and directors.
            </p>
          </div>
          
          <div className="bg-gray-900 p-6 md:p-8 rounded-xl shadow-md border border-gray-800">
            {!isSubmitted ? (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white">Available Resources</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <FileText className="h-6 w-6 mr-3 text-purple-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-white">Essential SME Contacts (2025)</h4>
                        <p className="text-gray-400 text-sm">A ready-to-print directory of UK business support organisations and government departments.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CalendarIcon className="h-6 w-6 mr-3 text-purple-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-white">Key Business Deadlines (2025)</h4>
                        <p className="text-gray-400 text-sm">All key tax dates, annual filings, and reporting deadlines for the 2024/25 financial year.</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="flex flex-col justify-center">
                  <h3 className="text-xl font-semibold mb-4 text-white">Ready to Download?</h3>
                  <p className="text-gray-300 mb-6">Get instant access to your free SME resources pack.</p>
                  <Button 
                    onClick={() => setShowLeadCaptureForm(true)}
                    className="w-full bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-1 transition-all duration-300 text-white"
                    size="lg"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Resources Pack
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">Your resources are ready!</h3>
                <p className="text-gray-300 mb-8">Thank you for your interest. You now have access to download both PDFs.</p>
                
                <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <a 
                    href="/downloads/Progress_Accountants_SME_Contacts_2025.pdf" 
                    target="_blank"
                    className="flex items-center justify-center p-4 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
                  >
                    <Download className="h-5 w-5 mr-2 text-purple-500" />
                    <span className="font-medium text-white">Download SME Contacts</span>
                  </a>
                  
                  <a 
                    href="/downloads/Progress_Accountants_Key_Dates_2025.pdf" 
                    target="_blank"
                    className="flex items-center justify-center p-4 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
                  >
                    <Download className="h-5 w-5 mr-2 text-purple-500" />
                    <span className="font-medium text-white">Download Key Deadlines</span>
                  </a>
                </div>
                
                <p className="mt-8 text-sm text-gray-400">
                  Resources are now available for download.
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Lead Capture Form Modal */}
        {showLeadCaptureForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600/50 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-slate-600/30">
                <h3 className="text-2xl font-bold text-white">Complete to Download Your Resources</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-white"
                  onClick={() => setShowLeadCaptureForm(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="p-6">
                {leadCaptureEmbedCode ? (
                  <div className="space-y-4">
                    <div 
                      className="w-full"
                      style={{ minHeight: FORM_CONFIG.defaultHeight }}
                      dangerouslySetInnerHTML={{ __html: leadCaptureEmbedCode }}
                    />
                    <div className="text-center pt-4 border-t border-slate-600/30">
                      <p className="text-slate-400 text-sm mb-3">
                        Having trouble with the form? You can still download your resources:
                      </p>
                      <Button
                        onClick={() => {
                          setIsSubmitted(true);
                          setShowLeadCaptureForm(false);
                          toast({ title: "Download started", description: "Your SME resources are being prepared." });
                        }}
                        variant="outline"
                        className="border-purple-500 text-purple-400 hover:bg-purple-50/10"
                      >
                        Skip Form & Download Resources
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h4 className="text-xl font-semibold text-white mb-4">Lead Capture Form Ready</h4>
                    <p className="text-slate-300 mb-6">
                      Add your lead capture form iframe embed code to SME_SUPPORT_LEAD_FORM in /utils/embedForms.ts
                    </p>
                    <Button
                      onClick={() => {
                        setIsSubmitted(true);
                        setShowLeadCaptureForm(false);
                        toast({ title: "Download started", description: "Your SME resources are being prepared." });
                      }}
                      className="bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] hover:shadow-lg hover:shadow-purple-500/25 text-white"
                    >
                      Continue to Download (Demo)
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// CTA Section
const CTASection = () => (
  <section className="py-16 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-[#031c40] to-[#16213e] opacity-90" />
    <div className="container mx-auto px-6 md:px-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h2 className="text-3xl font-bold text-white mb-6">📞 Ready to Get Expert Support?</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Book a chat with our team and let us help you navigate UK business requirements with confidence.
        </p>
        <Button size="lg" className="bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-1 transition-all duration-300 text-white">
          Schedule a Call
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </motion.div>
    </div>
  </section>
);

// Main SME Support Hub Page Component
const SMESupportHubPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "SME Support Hub | Essential Contacts & Tax Deadlines for UK Businesses";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Everything UK small businesses need in one place—verified contact details for HMRC, Companies House, and more, plus key tax and filing deadlines.");
    }
  }, []);

  return (
    <div>
      <HeroSection />
      <IntroSection />
      <Tabs defaultValue="directory" className="w-full">
        <div className="container mx-auto px-6 md:px-8 py-8">
          <TabsList className="mx-auto w-full max-w-md grid grid-cols-2">
            <TabsTrigger value="directory" className="text-base">
              <Building2 className="h-5 w-5 mr-2" />
              Organizations
            </TabsTrigger>
            <TabsTrigger value="deadlines" className="text-base">
              <Calendar className="h-5 w-5 mr-2" />
              Deadlines
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="directory">
          <DirectorySection />
        </TabsContent>
        
        <TabsContent value="deadlines">
          <DeadlinesSection />
        </TabsContent>
      </Tabs>
      <DownloadResourcesSection />
      <CTASection />
    </div>
  );
};

export default SMESupportHubPage;