import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, LayoutTemplate, Sparkles, BookOpen } from "lucide-react";

// Define template categories
type TemplateCategory = 'landing' | 'about' | 'services' | 'contact' | 'blog' | 'pricing' | 'faq' | 'portfolio';

// Define template interface
interface PageTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  previewImage: string;
  tags: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  template: any; // The actual template data structure
}

interface PageBuilderTemplateGalleryProps {
  onSelectTemplate: (template: any) => void;
}

// Create descriptive SVG previews for templates
// These SVGs represent the structure of each template type to provide a visual preview

// Helper function to create SVG preview dataurls
const createSvgPreview = (type: string, color: string) => {
  // Base SVG container
  const svgBase = `
    <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" preserveAspectRatio="none">
      <defs>
        <style type="text/css">
          .bg { fill: ${color}; }
          .section { fill: rgba(255,255,255,0.1); stroke: rgba(255,255,255,0.4); stroke-width: 1; }
          .text { fill: white; font-family: Arial, sans-serif; }
          .title { font-size: 16px; font-weight: bold; }
          .subtitle { font-size: 12px; }
          .button { fill: rgba(255,255,255,0.25); stroke: white; stroke-width: 1; rx: 4; }
          .card { fill: rgba(255,255,255,0.15); stroke: rgba(255,255,255,0.5); stroke-width: 1; rx: 6; }
          .divider { stroke: white; stroke-width: 1; stroke-dasharray: 4 2; }
          .form-field { fill: rgba(255,255,255,0.1); stroke: rgba(255,255,255,0.3); stroke-width: 1; rx: 4; }
          .map { fill: rgba(255,255,255,0.1); stroke: rgba(255,255,255,0.3); stroke-width: 1; }
          .circle { fill: rgba(255,255,255,0.2); stroke: rgba(255,255,255,0.5); stroke-width: 1; }
          .line { stroke: rgba(255,255,255,0.3); stroke-width: 1; }
        </style>
      </defs>
      <rect width="600" height="400" class="bg" />
      {{CONTENT}}
    </svg>
  `;

  // Different content templates
  let content = '';
  
  switch (type) {
    case 'landing':
      content = `
        <!-- Hero section -->
        <rect x="50" y="50" width="500" height="120" class="section" />
        <text x="75" y="85" class="text title">Welcome to Progress Accountants</text>
        <text x="75" y="110" class="text subtitle">Professional Financial Services</text>
        <rect x="75" y="130" width="120" height="25" class="button" />
        <text x="95" y="147" class="text subtitle">Get Started</text>
        
        <!-- Features section -->
        <rect x="50" y="190" width="500" height="130" class="section" />
        <rect x="70" y="210" width="140" height="90" class="card" />
        <rect x="230" y="210" width="140" height="90" class="card" />
        <rect x="390" y="210" width="140" height="90" class="card" />
        
        <!-- CTA section -->
        <rect x="50" y="340" width="500" height="40" class="section" />
        <rect x="240" y="350" width="120" height="20" class="button" />
      `;
      break;
    case 'about':
      content = `
        <!-- Header -->
        <rect x="50" y="50" width="500" height="70" class="section" />
        <text x="75" y="85" class="text title">About Us</text>
        <line x1="75" y1="100" x2="525" y2="100" class="divider" />
        
        <!-- Team section -->
        <rect x="50" y="140" width="500" height="140" class="section" />
        <text x="275" y="160" class="text title" text-anchor="middle">Our Team</text>
        
        <circle cx="125" cy="210" r="35" class="circle" />
        <circle cx="225" cy="210" r="35" class="circle" />
        <circle cx="325" cy="210" r="35" class="circle" />
        <circle cx="425" cy="210" r="35" class="circle" />
        
        <!-- Values section -->
        <rect x="50" y="300" width="500" height="80" class="section" />
        <text x="275" y="330" class="text title" text-anchor="middle">Our Values</text>
        <line x1="200" y1="350" x2="400" y2="350" class="divider" />
      `;
      break;
    case 'services':
      content = `
        <!-- Header -->
        <rect x="50" y="50" width="500" height="60" class="section" />
        <text x="275" y="85" class="text title" text-anchor="middle">Our Services</text>
        
        <!-- Services grid -->
        <rect x="50" y="130" width="500" height="250" class="section" />
        
        <rect x="70" y="150" width="220" height="100" class="card" />
        <text x="180" y="200" class="text subtitle" text-anchor="middle">Service 1</text>
        
        <rect x="310" y="150" width="220" height="100" class="card" />
        <text x="420" y="200" class="text subtitle" text-anchor="middle">Service 2</text>
        
        <rect x="70" y="260" width="220" height="100" class="card" />
        <text x="180" y="310" class="text subtitle" text-anchor="middle">Service 3</text>
        
        <rect x="310" y="260" width="220" height="100" class="card" />
        <text x="420" y="310" class="text subtitle" text-anchor="middle">Service 4</text>
      `;
      break;
    case 'contact':
      content = `
        <!-- Header -->
        <rect x="50" y="50" width="500" height="60" class="section" />
        <text x="275" y="85" class="text title" text-anchor="middle">Contact Us</text>
        
        <!-- Contact form + map -->
        <rect x="50" y="130" width="240" height="250" class="section" />
        
        <rect x="70" y="150" width="200" height="25" class="form-field" />
        <rect x="70" y="185" width="200" height="25" class="form-field" />
        <rect x="70" y="220" width="200" height="25" class="form-field" />
        <rect x="70" y="255" width="200" height="65" class="form-field" />
        <rect x="70" y="330" width="100" height="30" class="button" />
        
        <!-- Map -->
        <rect x="310" y="130" width="240" height="250" class="map" />
        <circle cx="430" cy="255" r="10" class="circle" />
      `;
      break;
    case 'blog':
      content = `
        <!-- Header -->
        <rect x="50" y="50" width="500" height="60" class="section" />
        <text x="275" y="85" class="text title" text-anchor="middle">Blog Articles</text>
        
        <!-- Articles -->
        <rect x="50" y="130" width="500" height="250" class="section" />
        
        <rect x="70" y="150" width="140" height="100" class="card" />
        <rect x="70" y="260" width="140" height="100" class="card" />
        <rect x="230" y="150" width="140" height="100" class="card" />
        <rect x="230" y="260" width="140" height="100" class="card" />
        <rect x="390" y="150" width="140" height="100" class="card" />
        <rect x="390" y="260" width="140" height="100" class="card" />
      `;
      break;
    case 'pricing':
      content = `
        <!-- Header -->
        <rect x="50" y="50" width="500" height="60" class="section" />
        <text x="275" y="85" class="text title" text-anchor="middle">Pricing Plans</text>
        
        <!-- Pricing tables -->
        <rect x="50" y="130" width="500" height="220" class="section" />
        
        <rect x="80" y="150" width="140" height="180" class="card" />
        <text x="150" y="175" class="text subtitle" text-anchor="middle">Basic</text>
        <line x1="100" y1="195" x2="200" y2="195" class="line" />
        <text x="150" y="225" class="text title" text-anchor="middle">$99</text>
        
        <rect x="230" y="150" width="140" height="180" class="card" />
        <text x="300" y="175" class="text subtitle" text-anchor="middle">Pro</text>
        <line x1="250" y1="195" x2="350" y2="195" class="line" />
        <text x="300" y="225" class="text title" text-anchor="middle">$199</text>
        
        <rect x="380" y="150" width="140" height="180" class="card" />
        <text x="450" y="175" class="text subtitle" text-anchor="middle">Enterprise</text>
        <line x1="400" y1="195" x2="500" y2="195" class="line" />
        <text x="450" y="225" class="text title" text-anchor="middle">$299</text>
        
        <!-- CTA -->
        <rect x="50" y="360" width="500" height="20" class="section" />
      `;
      break;
    case 'faq':
      content = `
        <!-- Header -->
        <rect x="50" y="50" width="500" height="60" class="section" />
        <text x="275" y="85" class="text title" text-anchor="middle">Frequently Asked Questions</text>
        
        <!-- FAQ Accordion -->
        <rect x="100" y="140" width="400" height="230" class="section" />
        
        <rect x="120" y="160" width="360" height="40" class="card" />
        <text x="140" y="185" class="text subtitle">How do I get started?</text>
        
        <rect x="120" y="210" width="360" height="40" class="card" />
        <text x="140" y="235" class="text subtitle">What payment methods do you accept?</text>
        
        <rect x="120" y="260" width="360" height="40" class="card" />
        <text x="140" y="285" class="text subtitle">Do you offer refunds?</text>
        
        <rect x="120" y="310" width="360" height="40" class="card" />
        <text x="140" y="335" class="text subtitle">How can I contact support?</text>
      `;
      break;
    case 'portfolio':
      content = `
        <!-- Header -->
        <rect x="50" y="50" width="500" height="60" class="section" />
        <text x="275" y="85" class="text title" text-anchor="middle">Our Portfolio</text>
        
        <!-- Portfolio grid -->
        <rect x="50" y="130" width="500" height="250" class="section" />
        
        <rect x="70" y="150" width="220" height="100" class="card" />
        <rect x="310" y="150" width="220" height="100" class="card" />
        <rect x="70" y="260" width="220" height="100" class="card" />
        <rect x="310" y="260" width="220" height="100" class="card" />
      `;
      break;
    default:
      content = `
        <text x="300" y="200" text-anchor="middle" class="text title">Template Preview</text>
      `;
  }
  
  const fullSvg = svgBase.replace('{{CONTENT}}', content);
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(fullSvg)}`;
};

// Create template previews for different types
const TEMPLATE_PREVIEWS = {
  landing: createSvgPreview('landing', '#0072b5'),
  about: createSvgPreview('about', '#1e4d8c'),
  services: createSvgPreview('services', '#5c946e'),
  contact: createSvgPreview('contact', '#6a8d73'),
  blog: createSvgPreview('blog', '#1d3461'),
  pricing: createSvgPreview('pricing', '#264653'),
  faq: createSvgPreview('faq', '#543c52'),
  portfolio: createSvgPreview('portfolio', '#364156')
};

// Create templates for each category
const sampleTemplates: PageTemplate[] = [
  // Landing page templates
  {
    id: "landing-hero-1",
    name: "Modern Business Landing",
    description: "A clean, modern landing page with hero section, features, testimonials, and CTA.",
    category: "landing",
    previewImage: TEMPLATE_PREVIEWS.landing,
    tags: ["modern", "business", "conversion"],
    isFeatured: true,
    template: createLandingPageTemplate("Modern Business")
  },
  {
    id: "landing-service-2",
    name: "Service Provider Landing",
    description: "Perfect for accountants and professional services with trust signals and credentials.",
    category: "landing",
    previewImage: TEMPLATE_PREVIEWS.landing,
    tags: ["professional", "services", "trust"],
    isNew: true,
    template: createLandingPageTemplate("Service Provider")
  },
  {
    id: "landing-product-3",
    name: "Product Showcase",
    description: "Highlight your product features and benefits with this conversion-focused layout.",
    category: "landing",
    previewImage: TEMPLATE_PREVIEWS.landing,
    tags: ["product", "features", "conversion"],
    template: createLandingPageTemplate("Product Showcase")
  },

  // About page templates
  {
    id: "about-story-1",
    name: "Company Story",
    description: "Tell your brand story with timeline, values, and team section.",
    category: "about",
    previewImage: TEMPLATE_PREVIEWS.about,
    tags: ["story", "values", "team"],
    template: createAboutPageTemplate("Company Story")
  },
  {
    id: "about-team-2",
    name: "Team Showcase",
    description: "Highlight your team with detailed profiles and expertise areas.",
    category: "about",
    previewImage: TEMPLATE_PREVIEWS.about,
    tags: ["team", "profiles", "expertise"],
    isNew: true,
    template: createAboutPageTemplate("Team Showcase")
  },

  // Services page templates
  {
    id: "services-cards-1",
    name: "Service Cards",
    description: "Present your services in elegant cards with icons, pricing, and benefits.",
    category: "services",
    previewImage: TEMPLATE_PREVIEWS.services,
    tags: ["services", "pricing", "features"],
    template: createServicesPageTemplate("Service Cards")
  },
  {
    id: "services-detailed-2",
    name: "Detailed Services",
    description: "In-depth service descriptions with process explanation and case studies.",
    category: "services",
    previewImage: TEMPLATE_PREVIEWS.services,
    tags: ["detailed", "process", "case studies"],
    isFeatured: true,
    template: createServicesPageTemplate("Detailed Services")
  },

  // Contact page templates
  {
    id: "contact-basic-1",
    name: "Basic Contact",
    description: "Simple contact form with company information and map.",
    category: "contact",
    previewImage: TEMPLATE_PREVIEWS.contact,
    tags: ["contact", "form", "map"],
    template: createContactPageTemplate("Basic Contact")
  },
  {
    id: "contact-full-2",
    name: "Full Contact Center",
    description: "Complete contact center with department routing, FAQ, and multiple office locations.",
    category: "contact",
    previewImage: TEMPLATE_PREVIEWS.contact,
    tags: ["detailed", "departments", "offices"],
    isNew: true,
    template: createContactPageTemplate("Full Contact Center")
  },

  // Blog page templates
  {
    id: "blog-grid-1",
    name: "Blog Grid",
    description: "Modern blog grid layout with featured posts and category filtering.",
    category: "blog",
    previewImage: TEMPLATE_PREVIEWS.blog,
    tags: ["blog", "grid", "categories"],
    template: createBlogPageTemplate("Blog Grid")
  },
  {
    id: "blog-article-2",
    name: "Article Template",
    description: "Clean, readable article template with related posts and author bio.",
    category: "blog",
    previewImage: TEMPLATE_PREVIEWS.blog,
    tags: ["article", "readability", "sharing"],
    template: createBlogPageTemplate("Article Template")
  },

  // Pricing page templates
  {
    id: "pricing-simple-1",
    name: "Simple Pricing",
    description: "Clear, straightforward pricing tables with feature comparison.",
    category: "pricing",
    previewImage: TEMPLATE_PREVIEWS.pricing,
    tags: ["pricing", "comparison", "conversion"],
    template: createPricingPageTemplate("Simple Pricing")
  },
  {
    id: "pricing-detailed-2",
    name: "Detailed Pricing",
    description: "Comprehensive pricing with FAQ, testimonials, and feature breakdowns.",
    category: "pricing",
    previewImage: TEMPLATE_PREVIEWS.pricing,
    tags: ["detailed", "features", "FAQ"],
    isFeatured: true,
    template: createPricingPageTemplate("Detailed Pricing")
  },

  // FAQ page templates
  {
    id: "faq-accordion-1",
    name: "FAQ Accordion",
    description: "Organized FAQ with categorized accordion sections and search.",
    category: "faq",
    previewImage: TEMPLATE_PREVIEWS.faq,
    tags: ["FAQ", "accordion", "categories"],
    template: createFaqPageTemplate("FAQ Accordion")
  },
  {
    id: "faq-support-2",
    name: "Support Center",
    description: "Comprehensive support center with FAQs, guides, and contact options.",
    category: "faq",
    previewImage: TEMPLATE_PREVIEWS.faq,
    tags: ["support", "guides", "contact"],
    isNew: true,
    template: createFaqPageTemplate("Support Center")
  },

  // Portfolio page templates
  {
    id: "portfolio-grid-1",
    name: "Portfolio Grid",
    description: "Showcase your work with filterable portfolio grid and detailed project pages.",
    category: "portfolio",
    previewImage: TEMPLATE_PREVIEWS.portfolio,
    tags: ["portfolio", "projects", "filtering"],
    template: createPortfolioPageTemplate("Portfolio Grid")
  },
  {
    id: "portfolio-case-2",
    name: "Case Studies",
    description: "In-depth case studies with process, results, and testimonials.",
    category: "portfolio",
    previewImage: TEMPLATE_PREVIEWS.portfolio,
    tags: ["case studies", "results", "process"],
    template: createPortfolioPageTemplate("Case Studies")
  },
];

// Template creation functions 
function createLandingPageTemplate(type: string) {
  // This would return structured data for the template
  // For now, we'll return a simple object that can be expanded later
  return {
    title: `${type} Landing Page`,
    path: "/landing",
    description: `A professionally designed ${type.toLowerCase()} landing page template`,
    pageType: "custom",
    isPublished: false,
    seoSettings: {
      title: `${type} Landing Page | Progress Accountants`,
      description: `Learn more about our services with this ${type.toLowerCase()} landing page.`,
      keywords: ["accountant", "professional services", "financial services"],
      primaryKeyword: "accounting services",
      seoGoal: "conversion",
    },
    sections: [
      // Hero section
      {
        id: Date.now(),
        name: "Hero Section",
        type: "hero",
        order: 0,
        layout: "single",
        settings: {
          backgroundColor: "#ffffff",
          padding: { top: 80, right: 24, bottom: 80, left: 24 },
          fullWidth: false
        },
        components: [
          {
            id: Date.now() + 1,
            name: "Heading",
            type: "heading",
            order: 0,
            content: {
              text: "Professional Accounting Services",
              level: "h1"
            }
          },
          {
            id: Date.now() + 2,
            name: "Subheading",
            type: "paragraph",
            order: 1,
            content: {
              text: "Expert financial guidance to help your business thrive"
            }
          },
          {
            id: Date.now() + 3,
            name: "CTA Button",
            type: "button",
            order: 2,
            content: {
              text: "Get Started",
              url: "/contact",
              variant: "default"
            }
          }
        ]
      },
      // Features section
      {
        id: Date.now() + 100,
        name: "Features",
        type: "feature-grid",
        order: 1,
        layout: "three-column",
        settings: {
          backgroundColor: "#f8f9fa",
          padding: { top: 80, right: 24, bottom: 80, left: 24 },
          fullWidth: false
        },
        components: [
          {
            id: Date.now() + 101,
            name: "Feature 1",
            type: "card",
            order: 0,
            content: {
              title: "Tax Planning",
              content: "Strategic tax planning to minimize liabilities and maximize returns."
            }
          },
          {
            id: Date.now() + 102,
            name: "Feature 2",
            type: "card",
            order: 1,
            content: {
              title: "Financial Reporting",
              content: "Accurate and timely financial reporting for better decision making."
            }
          },
          {
            id: Date.now() + 103,
            name: "Feature 3",
            type: "card",
            order: 2,
            content: {
              title: "Business Advisory",
              content: "Expert guidance to help your business grow and succeed."
            }
          }
        ]
      },
      // CTA section
      {
        id: Date.now() + 200,
        name: "Call to Action",
        type: "cta-section",
        order: 2,
        layout: "single",
        settings: {
          backgroundColor: "#ffffff",
          padding: { top: 60, right: 24, bottom: 60, left: 24 },
          fullWidth: false
        },
        components: [
          {
            id: Date.now() + 201,
            name: "CTA",
            type: "cta",
            order: 0,
            content: {
              heading: "Ready to Transform Your Finances?",
              text: "Schedule a consultation with our expert accountants today.",
              buttonText: "Contact Us",
              buttonUrl: "/contact"
            }
          }
        ]
      }
    ]
  };
}

function createAboutPageTemplate(type: string) {
  return {
    title: `About Us - ${type}`,
    path: "/about",
    description: "Learn more about our company and team",
    pageType: "core",
    isPublished: false,
    seoSettings: {
      title: "About Us | Progress Accountants",
      description: "Learn about our company history, values, and our expert team of accountants.",
      keywords: ["about", "team", "accountants", "history", "values"],
      primaryKeyword: "accounting team",
      seoGoal: "trust",
    },
    sections: [
      // Sample sections for about page
      {
        id: Date.now(),
        name: "About Us Header",
        type: "hero",
        order: 0,
        layout: "single",
        settings: {
          backgroundColor: "#ffffff",
          padding: { top: 60, right: 24, bottom: 40, left: 24 },
          fullWidth: false
        },
        components: [
          {
            id: Date.now() + 1,
            name: "Page Title",
            type: "heading",
            order: 0,
            content: {
              text: "About Progress Accountants",
              level: "h1"
            }
          }
        ]
      },
      {
        id: Date.now() + 100,
        name: "Our Mission",
        type: "content",
        order: 1,
        layout: "two-column",
        settings: {
          backgroundColor: "#f8f9fa",
          padding: { top: 60, right: 24, bottom: 60, left: 24 },
          fullWidth: false
        },
        components: [
          {
            id: Date.now() + 101,
            name: "Mission Statement",
            type: "paragraph",
            order: 0,
            content: {
              text: "Our mission is to provide exceptional accounting services that help businesses make informed financial decisions and achieve their goals."
            }
          }
        ]
      }
    ]
  };
}

function createServicesPageTemplate(type: string) {
  return {
    title: `Services - ${type}`,
    path: "/services",
    description: "Our professional accounting services",
    pageType: "core",
    isPublished: false,
    seoSettings: {
      title: "Our Services | Progress Accountants",
      description: "Explore our professional accounting and financial services designed to help your business succeed.",
      keywords: ["accounting services", "tax planning", "financial reporting", "business advisory"],
      primaryKeyword: "accounting services",
      seoGoal: "information",
    },
    sections: [
      // Sample sections for services page
      {
        id: Date.now(),
        name: "Services Header",
        type: "hero",
        order: 0,
        layout: "single",
        settings: {
          backgroundColor: "#ffffff",
          padding: { top: 60, right: 24, bottom: 40, left: 24 },
          fullWidth: false
        },
        components: [
          {
            id: Date.now() + 1,
            name: "Page Title",
            type: "heading",
            order: 0,
            content: {
              text: "Our Services",
              level: "h1"
            }
          }
        ]
      }
    ]
  };
}

function createContactPageTemplate(type: string) {
  return {
    title: `Contact Us - ${type}`,
    path: "/contact",
    description: "Get in touch with our team",
    pageType: "core",
    isPublished: false,
    seoSettings: {
      title: "Contact Us | Progress Accountants",
      description: "Get in touch with our expert team for accounting and financial services.",
      keywords: ["contact", "location", "email", "phone", "accountants"],
      primaryKeyword: "accounting contact",
      seoGoal: "conversion",
    },
    sections: [
      // Sample sections for contact page
      {
        id: Date.now(),
        name: "Contact Header",
        type: "hero",
        order: 0,
        layout: "single",
        settings: {
          backgroundColor: "#ffffff",
          padding: { top: 60, right: 24, bottom: 40, left: 24 },
          fullWidth: false
        },
        components: [
          {
            id: Date.now() + 1,
            name: "Page Title",
            type: "heading",
            order: 0,
            content: {
              text: "Contact Us",
              level: "h1"
            }
          }
        ]
      },
      {
        id: Date.now() + 100,
        name: "Contact Form",
        type: "content",
        order: 1,
        layout: "two-column",
        settings: {
          backgroundColor: "#f8f9fa",
          padding: { top: 60, right: 24, bottom: 60, left: 24 },
          fullWidth: false
        },
        components: [
          {
            id: Date.now() + 101,
            name: "Contact Form",
            type: "form",
            order: 0,
            content: {
              fields: [
                { type: "text", label: "Name", required: true },
                { type: "email", label: "Email", required: true },
                { type: "textarea", label: "Message", required: true }
              ],
              submitLabel: "Send Message"
            }
          },
          {
            id: Date.now() + 102,
            name: "Contact Map",
            type: "map",
            order: 1,
            content: {
              location: { lat: 40.7128, lng: -74.0060 },
              zoom: 14,
              address: "123 Financial Street, New York, NY 10001"
            }
          }
        ]
      }
    ]
  };
}

function createBlogPageTemplate(type: string) {
  return {
    title: `Blog - ${type}`,
    path: "/blog",
    description: "Latest articles and insights",
    pageType: "custom",
    isPublished: false,
    seoSettings: {
      title: "Accounting Blog | Progress Accountants",
      description: "Read our latest articles and insights on accounting, finance, and business topics.",
      keywords: ["blog", "articles", "accounting tips", "financial insights"],
      primaryKeyword: "accounting blog",
      seoGoal: "information",
    },
    sections: [
      // Sample sections for blog page
      {
        id: Date.now(),
        name: "Blog Header",
        type: "hero",
        order: 0,
        layout: "single",
        settings: {
          backgroundColor: "#ffffff",
          padding: { top: 60, right: 24, bottom: 40, left: 24 },
          fullWidth: false
        },
        components: [
          {
            id: Date.now() + 1,
            name: "Page Title",
            type: "heading",
            order: 0,
            content: {
              text: "Our Blog",
              level: "h1"
            }
          }
        ]
      }
    ]
  };
}

function createPricingPageTemplate(type: string) {
  return {
    title: `Pricing - ${type}`,
    path: "/pricing",
    description: "Our service pricing and packages",
    pageType: "custom",
    isPublished: false,
    seoSettings: {
      title: "Pricing Plans | Progress Accountants",
      description: "Explore our affordable accounting service plans designed for businesses of all sizes.",
      keywords: ["pricing", "plans", "packages", "accounting services", "fees"],
      primaryKeyword: "accounting pricing",
      seoGoal: "conversion",
    },
    sections: [
      // Sample sections for pricing page
      {
        id: Date.now(),
        name: "Pricing Header",
        type: "hero",
        order: 0,
        layout: "single",
        settings: {
          backgroundColor: "#ffffff",
          padding: { top: 60, right: 24, bottom: 40, left: 24 },
          fullWidth: false
        },
        components: [
          {
            id: Date.now() + 1,
            name: "Page Title",
            type: "heading",
            order: 0,
            content: {
              text: "Our Pricing Plans",
              level: "h1"
            }
          }
        ]
      }
    ]
  };
}

function createFaqPageTemplate(type: string) {
  return {
    title: `FAQ - ${type}`,
    path: "/faq",
    description: "Frequently asked questions",
    pageType: "custom",
    isPublished: false,
    seoSettings: {
      title: "Frequently Asked Questions | Progress Accountants",
      description: "Find answers to common questions about our accounting services, processes, and more.",
      keywords: ["FAQ", "questions", "answers", "help", "support"],
      primaryKeyword: "accounting questions",
      seoGoal: "information",
    },
    sections: [
      // Sample sections for FAQ page
      {
        id: Date.now(),
        name: "FAQ Header",
        type: "hero",
        order: 0,
        layout: "single",
        settings: {
          backgroundColor: "#ffffff",
          padding: { top: 60, right: 24, bottom: 40, left: 24 },
          fullWidth: false
        },
        components: [
          {
            id: Date.now() + 1,
            name: "Page Title",
            type: "heading",
            order: 0,
            content: {
              text: "Frequently Asked Questions",
              level: "h1"
            }
          }
        ]
      },
      {
        id: Date.now() + 100,
        name: "FAQ List",
        type: "content",
        order: 1,
        layout: "single",
        settings: {
          backgroundColor: "#f8f9fa",
          padding: { top: 60, right: 24, bottom: 60, left: 24 },
          fullWidth: false
        },
        components: [
          {
            id: Date.now() + 101,
            name: "FAQs",
            type: "accordion",
            order: 0,
            content: {
              items: [
                { title: "What accounting services do you offer?", content: "We offer a comprehensive range of accounting services including tax planning, financial reporting, bookkeeping, and business advisory." },
                { title: "How much do your services cost?", content: "Our service costs vary depending on the specific needs of your business. Please contact us for a custom quote." },
                { title: "Do you work with small businesses?", content: "Yes, we work with businesses of all sizes, from startups to established enterprises." }
              ]
            }
          }
        ]
      }
    ]
  };
}

function createPortfolioPageTemplate(type: string) {
  return {
    title: `Portfolio - ${type}`,
    path: "/portfolio",
    description: "Our client success stories",
    pageType: "custom",
    isPublished: false,
    seoSettings: {
      title: "Client Portfolio | Progress Accountants",
      description: "View our portfolio of successful client engagements and case studies.",
      keywords: ["portfolio", "clients", "case studies", "success stories"],
      primaryKeyword: "accounting portfolio",
      seoGoal: "trust",
    },
    sections: [
      // Sample sections for portfolio page
      {
        id: Date.now(),
        name: "Portfolio Header",
        type: "hero",
        order: 0,
        layout: "single",
        settings: {
          backgroundColor: "#ffffff",
          padding: { top: 60, right: 24, bottom: 40, left: 24 },
          fullWidth: false
        },
        components: [
          {
            id: Date.now() + 1,
            name: "Page Title",
            type: "heading",
            order: 0,
            content: {
              text: "Our Portfolio",
              level: "h1"
            }
          }
        ]
      }
    ]
  };
}

const PageBuilderTemplateGallery: React.FC<PageBuilderTemplateGalleryProps> = ({
  onSelectTemplate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>('landing');
  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Filter templates by category
  const filteredTemplates = sampleTemplates.filter(template => template.category === selectedCategory);
  
  // Featured templates across categories
  const featuredTemplates = sampleTemplates.filter(template => template.isFeatured);
  
  // New templates across categories
  const newTemplates = sampleTemplates.filter(template => template.isNew);
  
  // Handle template selection
  const handleSelectTemplate = (template: PageTemplate) => {
    onSelectTemplate(template.template);
  };

  // Handle template preview
  const handlePreviewTemplate = (template: PageTemplate) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">Template Gallery</h2>
        <p className="text-muted-foreground">
          Choose from professionally designed templates to get started quickly
        </p>
      </div>

      <Tabs defaultValue="categories">
        <TabsList className="mb-4 flex overflow-x-auto">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="featured">
            <Sparkles className="h-4 w-4 mr-1" /> Featured
          </TabsTrigger>
          <TabsTrigger value="new">
            <Badge variant="outline" className="mr-1">New</Badge> Latest
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="mt-0">
          <Tabs defaultValue="landing" orientation="horizontal">
            <ScrollArea className="w-full">
              <TabsList className="flex mb-6 flex-nowrap">
                <TabsTrigger value="landing">Landing Pages</TabsTrigger>
                <TabsTrigger value="about">About Pages</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="blog">Blog</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              </TabsList>
            </ScrollArea>
            
            {/* Content for each category */}
            <TabsContent value="landing" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates
                  .filter(template => template.category === 'landing')
                  .map(template => (
                    <TemplateCard 
                      key={template.id} 
                      template={template} 
                      onSelect={handleSelectTemplate}
                      onPreview={handlePreviewTemplate}
                    />
                  ))
                }
              </div>
            </TabsContent>
            
            <TabsContent value="about" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates
                  .filter(template => template.category === 'about')
                  .map(template => (
                    <TemplateCard 
                      key={template.id} 
                      template={template} 
                      onSelect={handleSelectTemplate}
                      onPreview={handlePreviewTemplate}
                    />
                  ))
                }
              </div>
            </TabsContent>
            
            <TabsContent value="services" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates
                  .filter(template => template.category === 'services')
                  .map(template => (
                    <TemplateCard 
                      key={template.id} 
                      template={template} 
                      onSelect={handleSelectTemplate}
                      onPreview={handlePreviewTemplate}
                    />
                  ))
                }
              </div>
            </TabsContent>
            
            <TabsContent value="contact" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates
                  .filter(template => template.category === 'contact')
                  .map(template => (
                    <TemplateCard 
                      key={template.id} 
                      template={template} 
                      onSelect={handleSelectTemplate}
                      onPreview={handlePreviewTemplate}
                    />
                  ))
                }
              </div>
            </TabsContent>
            
            <TabsContent value="blog" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates
                  .filter(template => template.category === 'blog')
                  .map(template => (
                    <TemplateCard 
                      key={template.id} 
                      template={template} 
                      onSelect={handleSelectTemplate}
                      onPreview={handlePreviewTemplate}
                    />
                  ))
                }
              </div>
            </TabsContent>
            
            <TabsContent value="pricing" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates
                  .filter(template => template.category === 'pricing')
                  .map(template => (
                    <TemplateCard 
                      key={template.id} 
                      template={template} 
                      onSelect={handleSelectTemplate}
                      onPreview={handlePreviewTemplate}
                    />
                  ))
                }
              </div>
            </TabsContent>
            
            <TabsContent value="faq" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates
                  .filter(template => template.category === 'faq')
                  .map(template => (
                    <TemplateCard 
                      key={template.id} 
                      template={template} 
                      onSelect={handleSelectTemplate}
                      onPreview={handlePreviewTemplate}
                    />
                  ))
                }
              </div>
            </TabsContent>
            
            <TabsContent value="portfolio" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates
                  .filter(template => template.category === 'portfolio')
                  .map(template => (
                    <TemplateCard 
                      key={template.id} 
                      template={template} 
                      onSelect={handleSelectTemplate}
                      onPreview={handlePreviewTemplate}
                    />
                  ))
                }
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="featured" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTemplates.map(template => (
              <TemplateCard 
                key={template.id} 
                template={template} 
                onSelect={handleSelectTemplate}
                onPreview={handlePreviewTemplate}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="new" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newTemplates.map(template => (
              <TemplateCard 
                key={template.id} 
                template={template} 
                onSelect={handleSelectTemplate}
                onPreview={handlePreviewTemplate}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Template Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
            <DialogDescription>{selectedTemplate?.description}</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div className="rounded-md overflow-hidden border">
              <img 
                src={selectedTemplate?.previewImage} 
                alt={selectedTemplate?.name} 
                className="w-full object-cover"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedTemplate?.tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (selectedTemplate) {
                handleSelectTemplate(selectedTemplate);
                setIsPreviewOpen(false);
              }
            }}>
              <Check className="h-4 w-4 mr-2" />
              Use Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Template card component
interface TemplateCardProps {
  template: PageTemplate;
  onSelect: (template: PageTemplate) => void;
  onPreview: (template: PageTemplate) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onSelect,
  onPreview
}) => {
  return (
    <Card className="overflow-hidden flex flex-col h-full transition-shadow hover:shadow-md">
      <div className="relative">
        <img 
          src={template.previewImage} 
          alt={template.name} 
          className="w-full h-48 object-cover"
        />
        {template.isNew && (
          <Badge className="absolute top-2 right-2 bg-primary">New</Badge>
        )}
        {template.isFeatured && (
          <Badge className="absolute top-2 right-2 bg-yellow-500">Featured</Badge>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <LayoutTemplate className="h-5 w-5 mr-2 text-primary" />
          {template.name}
        </CardTitle>
        <CardDescription className="line-clamp-2">{template.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
        <div className="flex flex-wrap gap-1">
          {template.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onPreview(template)}>
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
          <Button size="sm" className="flex-1" onClick={() => onSelect(template)}>
            <Check className="h-4 w-4 mr-1" />
            Use
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PageBuilderTemplateGallery;