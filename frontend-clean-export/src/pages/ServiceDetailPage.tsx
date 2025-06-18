import React from 'react';
import { Helmet } from 'react-helmet';
import { useRoute, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';

// Service data structure
interface ServiceDetail {
  slug: string;
  name: string;
  description: string;
  longDescription: string[];
  benefits: string[];
  featuredPoints: string[];
}

// Sample service data - in a real app, this would come from an API or database
const servicesData: ServiceDetail[] = [
  {
    slug: "accounting-compliance",
    name: "Accounting & Compliance",
    description: "Ensure your business stays compliant with accurate financial statements and timely filings, all handled with precision and care.",
    longDescription: [
      "Our accounting and compliance services are designed to keep your business on the right side of regulations while providing you with clear financial insights.",
      "We handle all aspects of financial reporting, compliance filings, and ensure your business meets all statutory requirements.",
      "Our team of experts stays up-to-date with the latest regulatory changes so you don't have to worry about missing important deadlines or requirements."
    ],
    benefits: [
      "Peace of mind knowing all compliance requirements are met",
      "Accurate and timely financial statements",
      "Reduced risk of penalties or regulatory issues",
      "More time to focus on running your business"
    ],
    featuredPoints: [
      "Annual accounts preparation",
      "Statutory compliance filings",
      "Corporation tax computations",
      "Financial statement analysis",
      "Regulatory compliance monitoring"
    ]
  },
  {
    slug: "bookkeeping",
    name: "Bookkeeping",
    description: "Maintain clear and organized financial records with our efficient and reliable bookkeeping services.",
    longDescription: [
      "Our bookkeeping services provide the foundation for sound financial management and decision-making.",
      "We carefully record and categorize all financial transactions, ensuring your books are accurate, up-to-date, and properly maintained.",
      "Using modern cloud-based systems, we make it easy for you to access your financial information whenever you need it."
    ],
    benefits: [
      "Accurate financial records at all times",
      "Real-time visibility into your business finances",
      "Streamlined month-end and year-end processes",
      "Reduced administrative burden on your team"
    ],
    featuredPoints: [
      "Transaction recording and categorization",
      "Bank reconciliations",
      "Accounts payable management",
      "Accounts receivable tracking",
      "Monthly financial reporting"
    ]
  },
  {
    slug: "tax-services",
    name: "Tax Planning & Preparation",
    description: "Optimize your tax position and ensure compliance with our proactive tax planning and preparation services.",
    longDescription: [
      "Our comprehensive tax planning and preparation services help you navigate the complex tax landscape with confidence.",
      "We work proactively to identify tax-saving opportunities and implement strategies to minimize your tax burden.",
      "Our approach ensures compliance while taking advantage of all available deductions and credits appropriate for your business."
    ],
    benefits: [
      "Minimized tax liability through strategic planning",
      "Confidence that all filings are accurate and timely",
      "Protection during tax audits and inquiries",
      "Year-round tax advice and support"
    ],
    featuredPoints: [
      "Personal and business tax return preparation",
      "Strategic tax planning",
      "Tax efficiency analysis",
      "VAT registration and returns",
      "HMRC correspondence handling"
    ]
  },
  {
    slug: "payroll-services",
    name: "Payroll Services",
    description: "Streamline your payroll process, ensuring your team is paid accurately and on time, every time.",
    longDescription: [
      "Our payroll services remove the complexity and administrative burden of managing employee payments.",
      "We handle everything from processing regular payroll runs to managing tax obligations and statutory requirements.",
      "Our systems ensure accuracy and compliance, giving you and your employees peace of mind."
    ],
    benefits: [
      "Accurate and timely payroll processing",
      "Compliance with PAYE, NI, and other statutory requirements",
      "Secure payslip delivery to employees",
      "Reduced administrative burden and time savings"
    ],
    featuredPoints: [
      "Regular payroll processing",
      "Auto-enrolment pension management",
      "Real-time HMRC reporting",
      "Statutory payments administration",
      "Year-end P60 preparation"
    ]
  },
  {
    slug: "financial-forecasting",
    name: "Financial Forecasting & Budgeting",
    description: "Plan for the future with confidence using our detailed financial forecasting and budgeting services.",
    longDescription: [
      "Our financial forecasting and budgeting services provide you with a clear roadmap for your business's financial future.",
      "We create detailed projections based on historical data, market trends, and your business goals.",
      "These insights enable informed decision-making and help you plan for both opportunities and challenges ahead."
    ],
    benefits: [
      "Clearer visibility into future financial performance",
      "More informed strategic decision-making",
      "Better cash flow management",
      "Increased confidence when seeking financing"
    ],
    featuredPoints: [
      "Cash flow forecasting",
      "Budget creation and management",
      "Scenario planning and analysis",
      "Performance vs. budget tracking",
      "Rolling forecast updates"
    ]
  },
  {
    slug: "business-advisory",
    name: "Business Advisory",
    description: "Receive strategic advice tailored to your business goals, helping you make informed decisions and drive growth.",
    longDescription: [
      "Our business advisory services provide you with expert guidance and insights to help your business thrive.",
      "We work closely with you to understand your goals and challenges, then develop strategies to address them effectively.",
      "Our advisors bring years of experience across various industries to help you navigate complex business decisions."
    ],
    benefits: [
      "Strategic guidance from experienced advisors",
      "Objective perspective on business challenges",
      "Access to industry insights and best practices",
      "Support for key business decisions and transitions"
    ],
    featuredPoints: [
      "Business performance analysis",
      "Strategic planning support",
      "Growth strategy development",
      "Business process improvement",
      "Merger and acquisition advice"
    ]
  },
  {
    slug: "cloud-accounting",
    name: "Cloud Accounting Solutions",
    description: "Leverage the power of cloud accounting to access your financial data anytime, anywhere, with real-time insights.",
    longDescription: [
      "Our cloud accounting solutions bring your financial management into the digital age, providing flexibility and real-time insights.",
      "We implement and manage modern cloud-based systems that integrate with your existing workflows and other business tools.",
      "These solutions give you 24/7 access to your financial data from anywhere, enabling better collaboration and faster decision-making."
    ],
    benefits: [
      "Anytime, anywhere access to financial information",
      "Real-time visibility into business performance",
      "Automated processes reducing manual entry",
      "Seamless integration with other business systems"
    ],
    featuredPoints: [
      "Cloud accounting software setup and configuration",
      "System integration and data migration",
      "Automation of financial processes",
      "Custom dashboard creation",
      "Ongoing system support and training"
    ]
  },
  {
    slug: "virtual-cfo",
    name: "Virtual CFO Services",
    description: "Gain executive-level financial expertise without the full-time commitment, guiding your business towards financial success.",
    longDescription: [
      "Our Virtual CFO services provide you with senior financial leadership without the cost of a full-time executive.",
      "We offer strategic financial guidance, help you interpret complex financial data, and support high-level decision-making.",
      "This flexible arrangement gives you access to expert financial insights exactly when you need them."
    ],
    benefits: [
      "Executive-level financial expertise at a fraction of the cost",
      "Strategic financial leadership and guidance",
      "Enhanced financial strategy and planning",
      "Improved financial performance and controls"
    ],
    featuredPoints: [
      "Financial strategy development",
      "KPI development and monitoring",
      "Board and investor reporting",
      "Financial systems optimization",
      "Risk management oversight"
    ]
  }
];

export default function ServiceDetailPage() {
  // Get the service slug from the URL
  const [, params] = useRoute<{ slug: string }>('/services/:slug');
  const slug = params?.slug || '';
  
  // Find the service data based on the slug
  const serviceData = servicesData.find(service => service.slug === slug);

  // If no matching service is found, show a simple error state
  if (!serviceData) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--navy)' }}>Service Not Found</h1>
        <p className="mb-8">Sorry, we couldn't find information about this service.</p>
        <Link href="/services">
          <Button 
            style={{ backgroundColor: 'var(--orange)', color: 'white' }}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            <span>Back to Services</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Helmet>
        <title>{serviceData.name} | Progress Accountants</title>
        <meta name="description" content={serviceData.description} />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-[var(--navy)] text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/services" className="inline-flex items-center text-gray-300 hover:text-white mb-6 no-underline">
              <ArrowLeft size={16} className="mr-2" />
              <span>Back to All Services</span>
            </Link>
            <h1 className="text-3xl md:text-5xl font-bold mb-6">{serviceData.name}</h1>
            <p className="text-xl text-gray-200">{serviceData.description}</p>
          </div>
        </div>
      </section>

      {/* Service Description */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 mb-12">
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--navy)' }}>Overview</h2>
              <div className="space-y-4">
                {serviceData.longDescription.map((paragraph, index) => (
                  <p key={index} className="text-gray-700">{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-12">
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--navy)' }}>Benefits</h2>
              <ul className="space-y-3">
                {serviceData.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <div className="text-green-500 mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What We Offer */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-12">
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--navy)' }}>What We Offer</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {serviceData.featuredPoints.map((point, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-md">
                    <p className="font-medium text-gray-700">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-[var(--navy)] rounded-lg shadow-md p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-gray-200 mb-6">
                Contact us today to learn more about our {serviceData.name.toLowerCase()} services and how we can help your business thrive.
              </p>
              <Link href="/contact">
                <Button 
                  size="lg"
                  className="hover:shadow-md hover:-translate-y-[2px] transition duration-300 flex items-center gap-2"
                  style={{ 
                    backgroundColor: 'var(--orange)',
                    color: 'white' 
                  }}
                >
                  <span>Get in Touch</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}