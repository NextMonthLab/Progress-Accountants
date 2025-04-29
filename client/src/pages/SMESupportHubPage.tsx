import { useState, useEffect } from "react";
import { organizations, deadlines, filters } from "@/data/smeSupport";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, Phone, Mail, Clock, Calendar, ExternalLink, 
  Filter, Search, Info, ArrowRight, CheckCircle, Calendar as CalendarIcon 
} from "lucide-react";
import { motion } from "framer-motion";

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

// HeroSection component
const HeroSection = () => (
  <section className="relative bg-navy py-16 md:py-24">
    <div className="absolute inset-0 bg-opacity-70 bg-gradient-to-r from-navy to-navy-800"></div>
    <div className="container mx-auto px-4 relative z-10">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-3xl mx-auto text-center"
      >
        <motion.div variants={itemVariants}>
          <Badge variant="outline" className="mb-4 bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200">
            RESOURCE HUB
          </Badge>
        </motion.div>
        <motion.h1 
          variants={itemVariants}
          className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight"
        >
          Everything Your Business Needs, All in One Place
        </motion.h1>
        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-xl text-gray-200 mb-8"
        >
          From Companies House deadlines to HMRC contact details, this page keeps you compliant, informed, and in control.
        </motion.p>
      </motion.div>
    </div>
  </section>
);

// Introduction section
const IntroSection = () => (
  <section className="py-12 bg-white">
    <div className="container mx-auto px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gray-50 p-6 md:p-8 rounded-xl shadow-sm border border-gray-100"
        >
          <p className="text-gray-700 text-lg leading-relaxed">
            Running a business can feel like a full-time juggling act. That's why we've created this page—to give you quick access to the essential contacts and key dates that every UK business owner should know. All the official resources in one place, updated regularly by our team.
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

// Organization card component
const OrganizationCard = ({ organization }: { organization: typeof organizations[0] }) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-navy flex items-center">
            <Building2 className="h-5 w-5 mr-2 text-orange-500" />
            {organization.name}
          </CardTitle>
          <CardDescription className="mt-2">
            {organization.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start">
            <ExternalLink className="h-4 w-4 mr-2 text-gray-500 mt-1 flex-shrink-0" />
            <a 
              href={organization.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {organization.website.replace(/^https?:\/\/(www\.)?/, '')}
            </a>
          </div>
          
          {organization.generalPhone && (
            <div className="flex items-start">
              <Phone className="h-4 w-4 mr-2 text-gray-500 mt-1 flex-shrink-0" />
              <a href={`tel:${organization.generalPhone.replace(/\s/g, '')}`} className="text-gray-700 hover:text-navy">
                {organization.generalPhone}
              </a>
            </div>
          )}
          
          {organization.specialistPhones && organization.specialistPhones.length > 0 && (
            <div className="space-y-2 pl-6">
              {organization.specialistPhones.map((phone, index) => (
                <div key={index} className="flex items-start text-sm">
                  <span className="font-medium mr-2">{phone.label}:</span>
                  <a href={`tel:${phone.number.replace(/\s/g, '')}`} className="text-gray-700 hover:text-navy">
                    {phone.number}
                  </a>
                </div>
              ))}
            </div>
          )}
          
          {organization.email && (
            <div className="flex items-start">
              <Mail className="h-4 w-4 mr-2 text-gray-500 mt-1 flex-shrink-0" />
              <a href={`mailto:${organization.email}`} className="text-gray-700 hover:text-navy break-all">
                {organization.email}
              </a>
            </div>
          )}
          
          {organization.textphone && (
            <div className="flex items-start">
              <Phone className="h-4 w-4 mr-2 text-gray-500 mt-1 flex-shrink-0" />
              <span className="text-gray-700">
                Textphone: {organization.textphone}
              </span>
            </div>
          )}
          
          {organization.hours && (
            <div className="flex items-start">
              <Clock className="h-4 w-4 mr-2 text-gray-500 mt-1 flex-shrink-0" />
              <span className="text-gray-700">{organization.hours}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Deadline row component
const DeadlineRow = ({ deadline }: { deadline: typeof deadlines[0] }) => {
  // Calculate if the deadline is upcoming (within 30 days)
  const today = new Date();
  const deadlineDate = new Date(deadline.date);
  const diffTime = Math.abs(deadlineDate.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isUpcoming = diffDays <= 30 && deadlineDate > today;

  return (
    <motion.tr
      variants={itemVariants}
      className={`border-b border-gray-200 ${isUpcoming ? 'bg-orange-50' : ''}`}
    >
      <td className="py-4 px-4">
        <div className="flex items-center">
          <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
          <span className="font-medium">{deadline.date}</span>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center">
          <span className="text-gray-700">{deadline.description}</span>
          {isUpcoming && (
            <Badge variant="outline" className="ml-2 bg-orange-100 text-orange-700 border-orange-200">
              Upcoming
            </Badge>
          )}
        </div>
      </td>
    </motion.tr>
  );
};

// Directory section
const DirectorySection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  
  // Filter the organizations based on search term
  const filteredOrganizations = organizations.filter(org => 
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    org.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy mb-4">National SME Directory</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Get in touch with the essential organizations that every UK business owner should know. We keep these details updated so you always have the right contact information.
            </p>
          </motion.div>
          
          {/* Search and filter */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search organizations..."
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="relative md:w-64">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none appearance-none bg-white"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  {filters.map((filter) => (
                    <option key={filter} value={filter}>{filter}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
          
          {/* Organizations grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredOrganizations.map((organization, index) => (
              <OrganizationCard key={index} organization={organization} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Deadlines section
const DeadlinesSection = () => {
  // Sort deadlines by date
  const sortedDeadlines = [...deadlines].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy mb-4">Key Business Deadlines</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Never miss an important deadline again. We keep track of the key dates and deadlines that matter to your business.
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-navy text-white">
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
            <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
              <Info className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Deadlines shown are for the 2024/25 tax year</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// CTA section
const CTASection = () => (
  <section className="py-16 bg-navy">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h2 className="text-3xl font-bold text-white mb-6">Need help keeping track of what matters for your business?</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Book a call and we'll guide you through it. Our team of experts is ready to help you navigate the complexities of business compliance.
        </p>
        <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
          Schedule a Call
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </motion.div>
    </div>
  </section>
);

// Main SME Support Hub page component
const SMESupportHubPage = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Set page metadata
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
        <div className="container mx-auto px-4 py-8">
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
      <CTASection />
    </div>
  );
};

export default SMESupportHubPage;