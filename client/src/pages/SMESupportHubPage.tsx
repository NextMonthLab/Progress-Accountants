import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { organizations, deadlines, filters } from "@/data/smeSupport";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, Phone, Mail, Clock, Calendar, ExternalLink, 
  Filter, Search, Info, ArrowRight, CheckCircle, Calendar as CalendarIcon,
  Download, FileText
} from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
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
const HeroSection = () => {
  return (
    <section 
      className="relative py-20 md:py-28 overflow-hidden" 
      style={{
        backgroundImage: "linear-gradient(rgba(3, 28, 64, 0.87), rgba(3, 28, 64, 0.90)), url('/images/sme-support-hub-hero.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#031c40" // Navy fallback
      }}
    >
      {/* Add decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 opacity-10 rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl"></div>
      
      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div variants={itemVariants}>
            <Badge variant="outline" className="mb-4 bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200 uppercase tracking-wide px-4 py-1 font-semibold text-sm shadow-sm">
              📚 Business Resource Hub
            </Badge>
          </motion.div>
          <motion.h1 
            variants={itemVariants}
            className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight drop-shadow-sm"
          >
            Everything Your Business Needs—All in One Place
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-200 mb-8 drop-shadow-sm max-w-2xl mx-auto"
          >
            From Companies House deadlines to HMRC contact lines, this page helps you stay compliant, informed, and in control. Built for small business owners who need quick answers and up-to-date resources—without digging through government websites.
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
          >
            <Button 
              variant="default" 
              size="lg" 
              className="bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-1 transition-all duration-300 text-white"
              onClick={() => {
                // Scroll to resources section
                const resourcesSection = document.getElementById("resources-section");
                resourcesSection?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Download className="mr-2 h-5 w-5" />
              Download Resources
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 hover:border-white/50 shadow-lg"
              onClick={() => {
                // Scroll to directory section
                const directorySection = document.getElementById("directory-section");
                directorySection?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Building2 className="mr-2 h-5 w-5" />
              Browse Directory
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Introduction section
const IntroSection = () => (
  <section className="py-14 bg-black">
    <div className="container mx-auto px-6 md:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-gray-900 to-black p-6 md:p-8 rounded-xl shadow-md border border-gray-800 relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 h-24 w-24 bg-purple-900/20 rounded-full -translate-y-1/3 translate-x-1/3 z-0"></div>
          <div className="absolute bottom-0 left-0 h-32 w-32 bg-blue-900/20 rounded-full translate-y-1/2 -translate-x-1/4 z-0"></div>
          
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <Info className="h-6 w-6 text-purple-500 mr-3 flex-shrink-0" />
              <h3 className="text-xl font-semibold text-white">Why We Built This Hub</h3>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              Running a business often feels like juggling a dozen tasks at once. That's why we created the SME Support Hub: to bring you the essential information every UK business owner needs—in one reliable, regularly updated place.
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center mb-2">
                  <Building2 className="h-5 w-5 text-blue-400 mr-2" />
                  <span className="font-medium text-white">Directory</span>
                </div>
                <p className="text-sm text-gray-400">All the key contacts for government departments and support bodies in one easy-to-browse list.</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 text-purple-400 mr-2" />
                  <span className="font-medium text-white">Deadlines</span>
                </div>
                <p className="text-sm text-gray-400">Never miss a tax filing or compliance date again—stay ahead with our official calendar.</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center mb-2">
                  <Download className="h-5 w-5 text-green-400 mr-2" />
                  <span className="font-medium text-white">Downloads</span>
                </div>
                <p className="text-sm text-gray-400">Print-ready PDF resources for your desk, inbox, or team documentation.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

// Organization card component
const OrganizationCard = ({ organization }: { organization: typeof organizations[0] }) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className="h-full hover:shadow-md transition-shadow bg-gray-900 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center">
            <Building2 className="h-5 w-5 mr-2 text-purple-500" />
            {organization.name}
          </CardTitle>
          <CardDescription className="mt-2 text-gray-300">
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
              className="text-purple-600 hover:text-purple-800 hover:underline"
            >
              {organization.website.replace(/^https?:\/\/(www\.)?/, '')}
            </a>
          </div>
          
          {organization.generalPhone && (
            <div className="flex items-start">
              <Phone className="h-4 w-4 mr-2 text-gray-500 mt-1 flex-shrink-0" />
              <a href={`tel:${organization.generalPhone.replace(/\s/g, '')}`} className="text-gray-300 hover:text-white">
                {organization.generalPhone}
              </a>
            </div>
          )}
          
          {organization.specialistPhones && organization.specialistPhones.length > 0 && (
            <div className="space-y-2 pl-6">
              {organization.specialistPhones.map((phone, index) => (
                <div key={index} className="flex items-start text-sm">
                  <span className="font-medium mr-2 text-gray-300">{phone.label}:</span>
                  <a href={`tel:${phone.number.replace(/\s/g, '')}`} className="text-gray-300 hover:text-white">
                    {phone.number}
                  </a>
                </div>
              ))}
            </div>
          )}
          
          {organization.email && (
            <div className="flex items-start">
              <Mail className="h-4 w-4 mr-2 text-gray-500 mt-1 flex-shrink-0" />
              <a href={`mailto:${organization.email}`} className="text-gray-300 hover:text-white break-all">
                {organization.email}
              </a>
            </div>
          )}
          
          {organization.textphone && (
            <div className="flex items-start">
              <Phone className="h-4 w-4 mr-2 text-gray-500 mt-1 flex-shrink-0" />
              <span className="text-gray-300">
                Textphone: {organization.textphone}
              </span>
            </div>
          )}
          
          {organization.hours && (
            <div className="flex items-start">
              <Clock className="h-4 w-4 mr-2 text-gray-500 mt-1 flex-shrink-0" />
              <span className="text-gray-300">{organization.hours}</span>
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
      className={`border-b border-gray-200 ${isUpcoming ? 'bg-purple-50' : ''}`}
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
            <Badge variant="outline" className="ml-2 bg-purple-100 text-purple-700 border-purple-200">
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
    <section className="py-12 bg-black">
      <div className="container mx-auto px-6 md:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">National SME Directory</h2>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Trusted Organisations & Contact Details for UK Businesses<br />
              We keep this directory current, so you're always connected to the right support.
            </p>
          </motion.div>
          
          {/* Search and filter */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search organisations..."
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="relative md:w-64">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none appearance-none bg-gray-800 text-white"
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
      <div className="container mx-auto px-6 md:px-8">
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
  <section className="py-16 relative overflow-hidden">
    <div className="absolute inset-0" style={{
      backgroundImage: "linear-gradient(rgba(3, 28, 64, 0.7), rgba(3, 28, 64, 0.7)), url('/images/sme-support-cta.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundColor: "#031c40" // Navy fallback
    }} />
    <div className="container mx-auto px-6 md:px-8 relative z-10">
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
        <Button size="lg" className="bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-1 transition-all duration-300 text-white">
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

// Form schema for download resources
const downloadFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  businessName: z.string().optional(),
  consent: z.boolean().refine(value => value === true, {
    message: "You must agree to receive updates to download resources",
  }),
});

type DownloadFormValues = z.infer<typeof downloadFormSchema>;

// Downloadable resources section
const DownloadResourcesSection = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<DownloadFormValues>({
    resolver: zodResolver(downloadFormSchema),
    defaultValues: {
      name: "",
      email: "",
      businessName: "",
      consent: false,
    },
  });

  function onSubmit(data: DownloadFormValues) {
    // In a real implementation, this would send the data to a server
    console.log("Form submitted:", data);
    
    // Show success toast
    toast({
      title: "Success!",
      description: "Your resources are now ready to download.",
      variant: "default",
    });
    
    // Set submitted state to show download links
    setIsSubmitted(true);
  }

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
                
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white">Complete the form to download</h3>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Smith" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="businessName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Name (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Your Business Ltd" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="consent"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm font-normal">
                                I agree to receive occasional updates and resources from Progress Accountants. You can unsubscribe anytime.
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-1 transition-all duration-300 text-white"
                      >
                        Get Access to Resources
                      </Button>
                    </form>
                  </Form>
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
                  We've also sent these links to your email for future reference.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SMESupportHubPage;