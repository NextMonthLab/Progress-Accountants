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

// Sample template previews (in a real app, these would be actual screenshots)
const TEMPLATE_PREVIEW_BASE = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22600%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1%20text%20%7B%20fill%3A%23ffffff%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%3Bfont-size%3A20pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1%22%3E%3Crect%20width%3D%22600%22%20height%3D%22400%22%20fill%3D%22%23007bff%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22300%22%20y%3D%22200%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ETemplate%20Preview%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";

// Create templates for each category
const sampleTemplates: PageTemplate[] = [
  // Landing page templates
  {
    id: "landing-hero-1",
    name: "Modern Business Landing",
    description: "A clean, modern landing page with hero section, features, testimonials, and CTA.",
    category: "landing",
    previewImage: TEMPLATE_PREVIEW_BASE.replace("#007bff", "#0072b5"),
    tags: ["modern", "business", "conversion"],
    isFeatured: true,
    template: createLandingPageTemplate("Modern Business")
  },
  {
    id: "landing-service-2",
    name: "Service Provider Landing",
    description: "Perfect for accountants and professional services with trust signals and credentials.",
    category: "landing",
    previewImage: TEMPLATE_PREVIEW_BASE.replace("#007bff", "#1e4d8c"),
    tags: ["professional", "services", "trust"],
    isNew: true,
    template: createLandingPageTemplate("Service Provider")
  },
  {
    id: "landing-product-3",
    name: "Product Showcase",
    description: "Highlight your product features and benefits with this conversion-focused layout.",
    category: "landing",
    previewImage: TEMPLATE_PREVIEW_BASE.replace("#007bff", "#3e6990"),
    tags: ["product", "features", "conversion"],
    template: createLandingPageTemplate("Product Showcase")
  },

  // About page templates
  {
    id: "about-story-1",
    name: "Company Story",
    description: "Tell your brand story with timeline, values, and team section.",
    category: "about",
    previewImage: TEMPLATE_PREVIEW_BASE.replace("#007bff", "#4b3b47"),
    tags: ["story", "values", "team"],
    template: createAboutPageTemplate("Company Story")
  },
  {
    id: "about-team-2",
    name: "Team Showcase",
    description: "Highlight your team with detailed profiles and expertise areas.",
    category: "about",
    previewImage: TEMPLATE_PREVIEW_BASE.replace("#007bff", "#8d6a9f"),
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
    previewImage: TEMPLATE_PREVIEW_BASE.replace("#007bff", "#5c946e"),
    tags: ["services", "pricing", "features"],
    template: createServicesPageTemplate("Service Cards")
  },
  {
    id: "services-detailed-2",
    name: "Detailed Services",
    description: "In-depth service descriptions with process explanation and case studies.",
    category: "services",
    previewImage: TEMPLATE_PREVIEW_BASE.replace("#007bff", "#2a7f62"),
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
    previewImage: TEMPLATE_PREVIEW_BASE.replace("#007bff", "#6a8d73"),
    tags: ["contact", "form", "map"],
    template: createContactPageTemplate("Basic Contact")
  },
  {
    id: "contact-full-2",
    name: "Full Contact Center",
    description: "Complete contact center with department routing, FAQ, and multiple office locations.",
    category: "contact",
    previewImage: TEMPLATE_PREVIEW_BASE.replace("#007bff", "#596475"),
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
    previewImage: TEMPLATE_PREVIEW_BASE.replace("#007bff", "#1d3461"),
    tags: ["blog", "grid", "categories"],
    template: createBlogPageTemplate("Blog Grid")
  },
  {
    id: "blog-article-2",
    name: "Article Template",
    description: "Clean, readable article template with related posts and author bio.",
    category: "blog",
    previewImage: TEMPLATE_PREVIEW_BASE.replace("#007bff", "#247ba0"),
    tags: ["article", "readability", "sharing"],
    template: createBlogPageTemplate("Article Template")
  },

  // Pricing page templates
  {
    id: "pricing-simple-1",
    name: "Simple Pricing",
    description: "Clear, straightforward pricing tables with feature comparison.",
    category: "pricing",
    previewImage: TEMPLATE_PREVIEW_BASE.replace("#007bff", "#264653"),
    tags: ["pricing", "comparison", "conversion"],
    template: createPricingPageTemplate("Simple Pricing")
  },
  {
    id: "pricing-detailed-2",
    name: "Detailed Pricing",
    description: "Comprehensive pricing with FAQ, testimonials, and feature breakdowns.",
    category: "pricing",
    previewImage: TEMPLATE_PREVIEW_BASE.replace("#007bff", "#287271"),
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
    previewImage: TEMPLATE_PREVIEW_BASE.replace("#007bff", "#543c52"),
    tags: ["FAQ", "accordion", "categories"],
    template: createFaqPageTemplate("FAQ Accordion")
  },
  {
    id: "faq-support-2",
    name: "Support Center",
    description: "Comprehensive support center with FAQs, guides, and contact options.",
    category: "faq",
    previewImage: TEMPLATE_PREVIEW_BASE.replace("#007bff", "#5f5f87"),
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
    previewImage: TEMPLATE_PREVIEW_BASE.replace("#007bff", "#364156"),
    tags: ["portfolio", "projects", "filtering"],
    template: createPortfolioPageTemplate("Portfolio Grid")
  },
  {
    id: "portfolio-case-2",
    name: "Case Studies",
    description: "In-depth case studies with process, results, and testimonials.",
    category: "portfolio",
    previewImage: TEMPLATE_PREVIEW_BASE.replace("#007bff", "#3c6997"),
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
      // Page intro section
      {
        id: Date.now(),
        name: "Page Intro",
        type: "content",
        order: 0,
        layout: "single",
        settings: {
          backgroundColor: "#ffffff",
          padding: { top: 80, right: 24, bottom: 40, left: 24 },
          fullWidth: false
        },
        components: [
          {
            id: Date.now() + 1,
            name: "Heading",
            type: "heading",
            order: 0,
            content: {
              text: "About Progress Accountants",
              level: "h1"
            }
          },
          {
            id: Date.now() + 2,
            name: "Intro",
            type: "paragraph",
            order: 1,
            content: {
              text: "We're a team of dedicated accounting professionals committed to helping businesses like yours succeed."
            }
          }
        ]
      },
      // Our story section
      {
        id: Date.now() + 100,
        name: "Our Story",
        type: "two-column",
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
            name: "Story Image",
            type: "image",
            order: 0,
            content: {
              src: "",
              alt: "Our company history",
              width: 500,
              height: 400
            }
          },
          {
            id: Date.now() + 102,
            name: "Story Content",
            type: "card",
            order: 1,
            content: {
              title: "Our Story",
              content: "Founded in 2010, Progress Accountants has grown from a small local firm to a trusted partner for businesses across the region. Our journey is built on a foundation of expertise, integrity, and personalized service."
            }
          }
        ]
      },
      // Team section
      {
        id: Date.now() + 200,
        name: "Our Team",
        type: "three-column",
        order: 2,
        layout: "three-column",
        settings: {
          backgroundColor: "#ffffff",
          padding: { top: 80, right: 24, bottom: 80, left: 24 },
          fullWidth: false
        },
        components: [
          {
            id: Date.now() + 201,
            name: "Team Intro",
            type: "heading",
            order: 0,
            content: {
              text: "Meet Our Team",
              level: "h2"
            }
          },
          {
            id: Date.now() + 202,
            name: "Team Member 1",
            type: "card",
            order: 1,
            content: {
              title: "Jane Smith",
              content: "Managing Partner with 15+ years of experience in tax planning and business advisory."
            }
          },
          {
            id: Date.now() + 203,
            name: "Team Member 2",
            type: "card",
            order: 2,
            content: {
              title: "John Davis",
              content: "Financial Controller specializing in audit and compliance for medium to large businesses."
            }
          },
          {
            id: Date.now() + 204,
            name: "Team Member 3",
            type: "card",
            order: 3,
            content: {
              title: "Sarah Johnson",
              content: "Tax Specialist with expertise in personal and business tax planning strategies."
            }
          }
        ]
      }
    ]
  };
}

function createServicesPageTemplate(type: string) {
  return {
    title: `Our Services - ${type}`,
    path: "/services",
    description: "Explore our professional accounting services",
    pageType: "core",
    isPublished: false,
    seoSettings: {
      title: "Professional Accounting Services | Progress Accountants",
      description: "Comprehensive accounting services including tax planning, bookkeeping, financial reporting, and business advisory.",
      keywords: ["accounting", "tax", "services", "financial", "bookkeeping"],
      primaryKeyword: "accounting services",
      seoGoal: "conversion",
    },
    sections: [
      // Services intro
      {
        id: Date.now(),
        name: "Services Intro",
        type: "content",
        order: 0,
        layout: "single",
        settings: {
          backgroundColor: "#ffffff",
          padding: { top: 80, right: 24, bottom: 40, left: 24 },
          fullWidth: false
        },
        components: [
          {
            id: Date.now() + 1,
            name: "Heading",
            type: "heading",
            order: 0,
            content: {
              text: "Our Accounting Services",
              level: "h1"
            }
          },
          {
            id: Date.now() + 2,
            name: "Intro",
            type: "paragraph",
            order: 1,
            content: {
              text: "We offer a comprehensive range of accounting and financial services tailored to meet the unique needs of your business."
            }
          }
        ]
      },
      // Services grid
      {
        id: Date.now() + 100,
        name: "Services Grid",
        type: "feature-grid",
        order: 1,
        layout: "three-column",
        settings: {
          backgroundColor: "#f8f9fa",
          padding: { top: 60, right: 24, bottom: 60, left: 24 },
          fullWidth: false
        },
        components: [
          {
            id: Date.now() + 101,
            name: "Service 1",
            type: "card",
            order: 0,
            content: {
              title: "Tax Preparation & Planning",
              content: "Comprehensive tax services for individuals and businesses to minimize tax liability and ensure compliance."
            }
          },
          {
            id: Date.now() + 102,
            name: "Service 2",
            type: "card",
            order: 1,
            content: {
              title: "Bookkeeping & Financial Reporting",
              content: "Accurate and timely financial records and reports to support informed business decisions."
            }
          },
          {
            id: Date.now() + 103,
            name: "Service 3",
            type: "card",
            order: 2,
            content: {
              title: "Business Advisory",
              content: "Strategic guidance to help your business grow, improve operations, and increase profitability."
            }
          },
          {
            id: Date.now() + 104,
            name: "Service 4",
            type: "card",
            order: 3,
            content: {
              title: "Audit & Assurance",
              content: "Independent audit services to verify financial information and provide stakeholder confidence."
            }
          },
          {
            id: Date.now() + 105,
            name: "Service 5",
            type: "card",
            order: 4,
            content: {
              title: "Payroll Services",
              content: "Comprehensive payroll management including tax filings, direct deposits, and compliance reporting."
            }
          },
          {
            id: Date.now() + 106,
            name: "Service 6",
            type: "card",
            order: 5,
            content: {
              title: "Estate Planning",
              content: "Careful planning to protect and preserve assets while minimizing tax implications."
            }
          }
        ]
      },
      // CTA section
      {
        id: Date.now() + 200,
        name: "Service CTA",
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
              heading: "Need a Customized Solution?",
              text: "Contact us today to discuss how we can tailor our services to meet your specific needs.",
              buttonText: "Get in Touch",
              buttonUrl: "/contact"
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
    description: "Contact our team for accounting services and support",
    pageType: "core",
    isPublished: false,
    seoSettings: {
      title: "Contact Us | Progress Accountants",
      description: "Get in touch with our accounting team. We're here to help with all your financial and accounting needs.",
      keywords: ["contact", "accountant", "support", "help", "location"],
      primaryKeyword: "contact accountant",
      seoGoal: "conversion",
    },
    sections: [
      // Contact intro
      {
        id: Date.now(),
        name: "Contact Intro",
        type: "content",
        order: 0,
        layout: "single",
        settings: {
          backgroundColor: "#ffffff",
          padding: { top: 80, right: 24, bottom: 40, left: 24 },
          fullWidth: false
        },
        components: [
          {
            id: Date.now() + 1,
            name: "Heading",
            type: "heading",
            order: 0,
            content: {
              text: "Contact Us",
              level: "h1"
            }
          },
          {
            id: Date.now() + 2,
            name: "Intro",
            type: "paragraph",
            order: 1,
            content: {
              text: "We're here to help with all your accounting and financial needs. Reach out to our team for prompt, professional assistance."
            }
          }
        ]
      },
      // Contact form and info
      {
        id: Date.now() + 100,
        name: "Contact Content",
        type: "two-column",
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
              title: "Send Us a Message",
              description: "Fill out the form below and we'll get back to you as soon as possible.",
              fields: [
                { type: "text", label: "Name", required: true, placeholder: "Your name" },
                { type: "email", label: "Email", required: true, placeholder: "your.email@example.com" },
                { type: "tel", label: "Phone", required: false, placeholder: "(123) 456-7890" },
                { type: "select", label: "Subject", required: true, options: ["General Inquiry", "Tax Services", "Bookkeeping", "Business Advisory", "Other"] },
                { type: "textarea", label: "Message", required: true, placeholder: "How can we help you?" }
              ],
              submitText: "Send Message",
              successMessage: "Thank you! Your message has been sent successfully.",
              errorMessage: "Something went wrong. Please try again later."
            }
          },
          {
            id: Date.now() + 102,
            name: "Contact Info",
            type: "card",
            order: 1,
            content: {
              title: "Our Office",
              content: "123 Financial Street\nAccountant City, AC 12345\n\nPhone: (555) 123-4567\nEmail: info@progressaccountants.com\n\nMonday-Friday: 9am-5pm\nSaturday-Sunday: Closed"
            }
          }
        ]
      },
      // Map section
      {
        id: Date.now() + 200,
        name: "Location Map",
        type: "content",
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
            name: "Office Map",
            type: "map",
            order: 0,
            content: {
              address: "123 Financial Street, Accountant City, AC 12345",
              title: "Our Location",
              description: "We're conveniently located in the heart of the financial district.",
              height: 400,
              showControls: true,
              zoom: 14,
              markers: [
                {
                  lat: 37.7749,
                  lng: -122.4194,
                  title: "Progress Accountants"
                }
              ]
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
    description: "Insights and updates from our accounting experts",
    pageType: "custom",
    isPublished: false,
    seoSettings: {
      title: "Accounting Insights & Blog | Progress Accountants",
      description: "Expert insights, tips, and updates on accounting, tax planning, and financial strategies for business success.",
      keywords: ["blog", "accounting insights", "tax tips", "financial advice"],
      primaryKeyword: "accounting blog",
      seoGoal: "authority",
    },
    sections: [
      // Blog header
      {
        id: Date.now(),
        name: "Blog Header",
        type: "content",
        order: 0,
        layout: "single",
        settings: {
          backgroundColor: "#ffffff",
          padding: { top: 80, right: 24, bottom: 40, left: 24 },
          fullWidth: false
        },
        components: [
          {
            id: Date.now() + 1,
            name: "Heading",
            type: "heading",
            order: 0,
            content: {
              text: "Accounting Insights",
              level: "h1"
            }
          },
          {
            id: Date.now() + 2,
            name: "Intro",
            type: "paragraph",
            order: 1,
            content: {
              text: "Expert insights, tips, and updates to help you navigate your financial journey and grow your business."
            }
          }
        ]
      },
      // Blog grid
      {
        id: Date.now() + 100,
        name: "Blog Articles",
        type: "feature-grid",
        order: 1,
        layout: "three-column",
        settings: {
          backgroundColor: "#f8f9fa",
          padding: { top: 60, right: 24, bottom: 60, left: 24 },
          fullWidth: false
        },
        components: [
          {
            id: Date.now() + 101,
            name: "Article 1",
            type: "card",
            order: 0,
            content: {
              title: "Tax Planning Strategies for Small Businesses",
              content: "Effective strategies to minimize tax liability and maximize deductions for your small business."
            }
          },
          {
            id: Date.now() + 102,
            name: "Article 2",
            type: "card",
            order: 1,
            content: {
              title: "Understanding Financial Statements",
              content: "A guide to interpreting your balance sheet, income statement, and cash flow statement."
            }
          },
          {
            id: Date.now() + 103,
            name: "Article 3",
            type: "card",
            order: 2,
            content: {
              title: "Navigating Business Expenses",
              content: "What qualifies as a legitimate business expense and how to properly document for tax purposes."
            }
          },
          {
            id: Date.now() + 104,
            name: "Article 4",
            type: "card",
            order: 3,
            content: {
              title: "Retirement Planning for Business Owners",
              content: "Options and strategies for securing your financial future while running your business."
            }
          },
          {
            id: Date.now() + 105,
            name: "Article 5",
            type: "card",
            order: 4,
            content: {
              title: "Cash Flow Management Tips",
              content: "Practical advice for maintaining healthy cash flow in your business operations."
            }
          },
          {
            id: Date.now() + 106,
            name: "Article 6",
            type: "card",
            order: 5,
            content: {
              title: "Year-End Tax Checklist",
              content: "Essential tasks and considerations to prepare for tax season and minimize your tax burden."
            }
          }
        ]
      },
      // Newsletter signup
      {
        id: Date.now() + 200,
        name: "Newsletter Signup",
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
              heading: "Stay Updated with Our Newsletter",
              text: "Subscribe to receive accounting tips, tax updates, and financial insights delivered to your inbox.",
              buttonText: "Subscribe Now",
              buttonUrl: "#"
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
    description: "Transparent pricing for our accounting services",
    pageType: "custom",
    isPublished: false,
    seoSettings: {
      title: "Pricing & Services | Progress Accountants",
      description: "Transparent pricing for our professional accounting services. Packages designed to fit businesses of all sizes.",
      keywords: ["pricing", "accounting fees", "service packages", "tax service pricing"],
      primaryKeyword: "accounting pricing",
      seoGoal: "conversion",
    },
    sections: [
      // Pricing header
      {
        id: Date.now(),
        name: "Pricing Header",
        type: "content",
        order: 0,
        layout: "single",
        settings: {
          backgroundColor: "#ffffff",
          padding: { top: 80, right: 24, bottom: 40, left: 24 },
          fullWidth: false
        },
        components: [
          {
            id: Date.now() + 1,
            name: "Heading",
            type: "heading",
            order: 0,
            content: {
              text: "Our Service Packages",
              level: "h1"
            }
          },
          {
            id: Date.now() + 2,
            name: "Intro",
            type: "paragraph",
            order: 1,
            content: {
              text: "Transparent pricing tailored to businesses of all sizes. Choose the package that best suits your needs or contact us for a custom solution."
            }
          }
        ]
      },
      // Pricing plans
      {
        id: Date.now() + 100,
        name: "Pricing Plans",
        type: "three-column",
        order: 1,
        layout: "three-column",
        settings: {
          backgroundColor: "#f8f9fa",
          padding: { top: 60, right: 24, bottom: 60, left: 24 },
          fullWidth: false
        },
        components: [
          {
            id: Date.now() + 101,
            name: "Basic Plan",
            type: "card",
            order: 0,
            content: {
              title: "Startup Package",
              content: "Starting at $299/month\n\n• Monthly bookkeeping\n• Quarterly financial statements\n• Annual tax preparation\n• Basic business advisory\n• Email support"
            }
          },
          {
            id: Date.now() + 102,
            name: "Professional Plan",
            type: "card",
            order: 1,
            content: {
              title: "Growth Package",
              content: "Starting at $599/month\n\n• Full-service bookkeeping\n• Monthly financial statements\n• Tax planning & preparation\n• Dedicated accountant\n• Phone & email support\n• Quarterly business review"
            }
          },
          {
            id: Date.now() + 103,
            name: "Enterprise Plan",
            type: "card",
            order: 2,
            content: {
              title: "Enterprise Package",
              content: "Starting at $999/month\n\n• Comprehensive accounting\n• CFO advisory services\n• Strategic tax planning\n• Custom financial reporting\n• Unlimited support\n• Monthly business strategy sessions"
            }
          }
        ]
      },
      // FAQ section
      {
        id: Date.now() + 200,
        name: "Pricing FAQ",
        type: "content",
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
            name: "FAQ Heading",
            type: "heading",
            order: 0,
            content: {
              text: "Frequently Asked Questions",
              level: "h2"
            }
          },
          {
            id: Date.now() + 202,
            name: "FAQ Accordion",
            type: "accordion",
            order: 1,
            content: {
              title: "",
              items: [
                { 
                  title: "What's included in the monthly fee?", 
                  content: "Our monthly fee includes all services listed in your chosen package. There are no hidden costs or surprise fees." 
                },
                { 
                  title: "Can I change packages as my business grows?", 
                  content: "Absolutely! You can upgrade or downgrade your package at any time as your business needs change." 
                },
                { 
                  title: "Do you offer custom packages?", 
                  content: "Yes, we can create a tailored solution specific to your business needs and budget. Contact us for a custom quote." 
                },
                { 
                  title: "Is there a setup fee?", 
                  content: "There is a one-time setup fee that varies based on the complexity of your financial situation and the state of your current books." 
                }
              ],
              allowMultiple: false
            }
          }
        ]
      },
      // CTA section
      {
        id: Date.now() + 300,
        name: "Pricing CTA",
        type: "cta-section",
        order: 3,
        layout: "single",
        settings: {
          backgroundColor: "#f8f9fa",
          padding: { top: 60, right: 24, bottom: 60, left: 24 },
          fullWidth: false
        },
        components: [
          {
            id: Date.now() + 301,
            name: "CTA",
            type: "cta",
            order: 0,
            content: {
              heading: "Need a Custom Solution?",
              text: "Contact us today for a personalized quote tailored to your specific business needs.",
              buttonText: "Get a Custom Quote",
              buttonUrl: "/contact"
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
    description: "Answers to common questions about our accounting services",
    pageType: "custom",
    isPublished: false,
    seoSettings: {
      title: "Frequently Asked Questions | Progress Accountants",
      description: "Find answers to common questions about our accounting services, tax preparation, financial reporting, and more.",
      keywords: ["FAQ", "accounting questions", "tax questions", "bookkeeping help"],
      primaryKeyword: "accounting FAQ",
      seoGoal: "information",
    },
    sections: [
      // FAQ header
      {
        id: Date.now(),
        name: "FAQ Header",
        type: "content",
        order: 0,
        layout: "single",
        settings: {
          backgroundColor: "#ffffff",
          padding: { top: 80, right: 24, bottom: 40, left: 24 },
          fullWidth: false
        },
        components: [
          {
            id: Date.now() + 1,
            name: "Heading",
            type: "heading",
            order: 0,
            content: {
              text: "Frequently Asked Questions",
              level: "h1"
            }
          },
          {
            id: Date.now() + 2,
            name: "Intro",
            type: "paragraph",
            order: 1,
            content: {
              text: "Find answers to common questions about our services, processes, and accounting practices. Can't find what you're looking for? Contact us directly."
            }
          }
        ]
      },
      // FAQ categories
      {
        id: Date.now() + 100,
        name: "General Questions",
        type: "content",
        order: 1,
        layout: "single",
        settings: {
          backgroundColor: "#f8f9fa",
          padding: { top: 60, right: 24, bottom: 30, left: 24 },
          fullWidth: false
        },
        components: [
          {
            id: Date.now() + 101,
            name: "Category Heading",
            type: "heading",
            order: 0,
            content: {
              text: "General Questions",
              level: "h2"
            }
          },
          {
            id: Date.now() + 102,
            name: "General FAQ",
            type: "accordion",
            order: 1,
            content: {
              title: "",
              items: [
                { 
                  title: "What services do you offer?", 
                  content: "We offer a comprehensive range of accounting services including tax preparation and planning, bookkeeping, financial reporting, payroll services, business advisory, audit services, and more." 
                },
                { 
                  title: "How often should we meet with our accountant?", 
                  content: "For most businesses, we recommend quarterly meetings to review financial performance and planning. However, this can vary based on your business size, complexity, and specific needs." 
                },
                { 
                  title: "Do you work with businesses in specific industries?", 
                  content: "We serve clients across a wide range of industries, with particular expertise in retail, professional services, manufacturing, construction, and non-profit organizations." 
                },
                { 
                  title: "How do I get started with your services?", 
                  content: "Simply contact us to schedule an initial consultation. We'll discuss your needs, recommend appropriate services, and outline the next steps to begin working together." 
                }
              ],
              allowMultiple: true
            }
          }
        ]
      },
      {
        id: Date.now() + 200,
        name: "Tax Questions",
        type: "content",
        order: 2,
        layout: "single",
        settings: {
          backgroundColor: "#ffffff",
          padding: { top: 30, right: 24, bottom: 30, left: 24 },
          fullWidth: false
        },
        components: [
          {
            id: Date.now() + 201,
            name: "Category Heading",
            type: "heading",
            order: 0,
            content: {
              text: "Tax Questions",
              level: "h2"
            }
          },
          {
            id: Date.now() + 202,
            name: "Tax FAQ",
            type: "accordion",
            order: 1,
            content: {
              title: "",
              items: [
                { 
                  title: "When should I start preparing for tax season?", 
                  content: "Ideally, tax planning should be a year-round activity. However, we recommend beginning active preparation at least 2-3 months before the filing deadline to ensure ample time for gathering documents and identifying optimization opportunities." 
                },
                { 
                  title: "What documents do I need for tax preparation?", 
                  content: "Required documents typically include income statements (W-2s, 1099s), expense records, asset purchase information, prior year returns, and business financial statements. We'll provide a detailed checklist based on your specific situation." 
                },
                { 
                  title: "Can you help with tax problems or audits?", 
                  content: "Yes, we provide IRS representation and can help resolve tax problems, including audits, back taxes, penalties, and payment plans." 
                },
                { 
                  title: "What tax deductions am I eligible for?", 
                  content: "Tax deductions vary widely based on your specific situation. Common business deductions include operating expenses, home office expenses, vehicle expenses, retirement contributions, and healthcare costs. We'll work with you to identify all eligible deductions." 
                }
              ],
              allowMultiple: true
            }
          }
        ]
      },
      {
        id: Date.now() + 300,
        name: "Bookkeeping Questions",
        type: "content",
        order: 3,
        layout: "single",
        settings: {
          backgroundColor: "#f8f9fa",
          padding: { top: 30, right: 24, bottom: 60, left: 24 },
          fullWidth: false
        },
        components: [
          {
            id: Date.now() + 301,
            name: "Category Heading",
            type: "heading",
            order: 0,
            content: {
              text: "Bookkeeping & Financial Questions",
              level: "h2"
            }
          },
          {
            id: Date.now() + 302,
            name: "Bookkeeping FAQ",
            type: "accordion",
            order: 1,
            content: {
              title: "",
              items: [
                { 
                  title: "How often should financial statements be prepared?", 
                  content: "Most businesses benefit from monthly financial statements to stay informed about their financial position and make timely decisions. However, quarterly statements may be sufficient for some smaller businesses with limited transaction volume." 
                },
                { 
                  title: "What accounting software do you recommend?", 
                  content: "We work with most major accounting platforms including QuickBooks, Xero, and Sage. The best choice depends on your business size, industry, and specific requirements. We can help you select and set up the most appropriate system." 
                },
                { 
                  title: "Can you help clean up my books if they're disorganized?", 
                  content: "Yes, we offer bookkeeping cleanup services to organize and correct your financial records, regardless of their current state. This includes reconciling accounts, correcting errors, and establishing proper accounting procedures going forward." 
                },
                { 
                  title: "Do I need a separate business bank account?", 
                  content: "Yes, maintaining separate business and personal accounts is essential for accurate bookkeeping, proper tax filing, and legal protection. It's particularly important for corporations and LLCs to maintain their liability protection." 
                }
              ],
              allowMultiple: true
            }
          }
        ]
      },
      // Contact CTA
      {
        id: Date.now() + 400,
        name: "FAQ CTA",
        type: "cta-section",
        order: 4,
        layout: "single",
        settings: {
          backgroundColor: "#ffffff",
          padding: { top: 60, right: 24, bottom: 60, left: 24 },
          fullWidth: false
        },
        components: [
          {
            id: Date.now() + 401,
            name: "CTA",
            type: "cta",
            order: 0,
            content: {
              heading: "Still Have Questions?",
              text: "Contact our team for personalized answers to your specific questions.",
              buttonText: "Contact Us",
              buttonUrl: "/contact"
            }
          }
        ]
      }
    ]
  };
}

function createPortfolioPageTemplate(type: string) {
  return {
    title: `Our Work - ${type}`,
    path: "/portfolio",
    description: "Case studies and success stories from our clients",
    pageType: "custom",
    isPublished: false,
    seoSettings: {
      title: "Client Success Stories | Progress Accountants",
      description: "Explore case studies and success stories showing how we've helped businesses improve their financial performance and growth.",
      keywords: ["case studies", "success stories", "accounting results", "client testimonials"],
      primaryKeyword: "accounting case studies",
      seoGoal: "trust",
    },
    sections: [
      // Portfolio header
      {
        id: Date.now(),
        name: "Portfolio Header",
        type: "content",
        order: 0,
        layout: "single",
        settings: {
          backgroundColor: "#ffffff",
          padding: { top: 80, right: 24, bottom: 40, left: 24 },
          fullWidth: false
        },
        components: [
          {
            id: Date.now() + 1,
            name: "Heading",
            type: "heading",
            order: 0,
            content: {
              text: "Client Success Stories",
              level: "h1"
            }
          },
          {
            id: Date.now() + 2,
            name: "Intro",
            type: "paragraph",
            order: 1,
            content: {
              text: "Explore how we've helped businesses across various industries improve their financial health, reduce tax burdens, and achieve their growth objectives."
            }
          }
        ]
      },
      // Case studies grid
      {
        id: Date.now() + 100,
        name: "Case Studies",
        type: "feature-grid",
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
            name: "Case Study 1",
            type: "card",
            order: 0,
            content: {
              title: "Manufacturing Company Saves $50K in Taxes",
              content: "How we helped a mid-sized manufacturer implement strategic tax planning to significantly reduce their tax liability while staying fully compliant."
            }
          },
          {
            id: Date.now() + 102,
            name: "Case Study 2",
            type: "card",
            order: 1,
            content: {
              title: "Startup Streamlines Financial Operations",
              content: "A tech startup struggling with financial management implemented our systems and saw 30% improvement in cash flow and raised successful Series A funding."
            }
          },
          {
            id: Date.now() + 103,
            name: "Case Study 3",
            type: "card",
            order: 2,
            content: {
              title: "Retail Chain Expands with Confidence",
              content: "How our financial forecasting and planning services helped a retail business successfully expand to three new locations."
            }
          },
          {
            id: Date.now() + 104,
            name: "Case Study 4",
            type: "card",
            order: 3,
            content: {
              title: "Service Business Increases Profitability",
              content: "Through detailed financial analysis and process improvements, we helped a service-based business increase their profit margins by 15%."
            }
          }
        ]
      },
      // Testimonials section
      {
        id: Date.now() + 200,
        name: "Testimonials",
        type: "content",
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
            name: "Testimonial Heading",
            type: "heading",
            order: 0,
            content: {
              text: "What Our Clients Say",
              level: "h2"
            }
          },
          {
            id: Date.now() + 202,
            name: "Quote 1",
            type: "quote",
            order: 1,
            content: {
              text: "Progress Accountants transformed our financial processes and helped us save substantially on taxes. Their strategic advice has been invaluable to our growth.",
              author: "Jane Smith",
              position: "CEO, XYZ Manufacturing"
            }
          },
          {
            id: Date.now() + 203,
            name: "Quote 2",
            type: "quote",
            order: 2,
            content: {
              text: "Working with Progress Accountants gave us clarity and confidence in our financial decision-making. They're truly partners in our success.",
              author: "Michael Johnson",
              position: "Founder, Tech Solutions Inc."
            }
          }
        ]
      },
      // CTA section
      {
        id: Date.now() + 300,
        name: "Portfolio CTA",
        type: "cta-section",
        order: 3,
        layout: "single",
        settings: {
          backgroundColor: "#f8f9fa",
          padding: { top: 60, right: 24, bottom: 60, left: 24 },
          fullWidth: false
        },
        components: [
          {
            id: Date.now() + 301,
            name: "CTA",
            type: "cta",
            order: 0,
            content: {
              heading: "Ready to Achieve Similar Results?",
              text: "Contact us today to discuss how we can help your business improve its financial performance and reach its goals.",
              buttonText: "Let's Talk",
              buttonUrl: "/contact"
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
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Template Gallery</CardTitle>
          <Badge variant="outline" className="gap-1 px-1.5 py-0">
            <Sparkles size={14} className="text-yellow-500" />
            <span className="text-xs">New Templates</span>
          </Badge>
        </div>
        <CardDescription>
          Choose a professional template to get started quickly. All templates are fully customizable.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="landing" onValueChange={(value) => setSelectedCategory(value as TemplateCategory)}>
          <div className="overflow-x-auto pb-2">
            <TabsList className="w-full">
              <TabsTrigger value="landing" className="flex-1">Landing</TabsTrigger>
              <TabsTrigger value="about" className="flex-1">About</TabsTrigger>
              <TabsTrigger value="services" className="flex-1">Services</TabsTrigger>
              <TabsTrigger value="contact" className="flex-1">Contact</TabsTrigger>
              <TabsTrigger value="blog" className="flex-1">Blog</TabsTrigger>
              <TabsTrigger value="pricing" className="flex-1">Pricing</TabsTrigger>
              <TabsTrigger value="faq" className="flex-1">FAQ</TabsTrigger>
              <TabsTrigger value="portfolio" className="flex-1">Portfolio</TabsTrigger>
            </TabsList>
          </div>
          
          {/* Special sections for featured and new templates */}
          <div className="my-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
              <Sparkles size={14} className="text-yellow-500" /> 
              Featured Templates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredTemplates.slice(0, 3).map((template) => (
                <TemplateCard 
                  key={template.id}
                  template={template}
                  onSelect={handleSelectTemplate}
                  onPreview={handlePreviewTemplate}
                />
              ))}
            </div>
          </div>
          
          {/* New templates section */}
          {newTemplates.length > 0 && (
            <div className="my-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <BookOpen size={14} className="text-primary" /> 
                New Templates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {newTemplates.slice(0, 3).map((template) => (
                  <TemplateCard 
                    key={template.id}
                    template={template}
                    onSelect={handleSelectTemplate}
                    onPreview={handlePreviewTemplate}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Category-specific templates */}
          <div className="mt-6 mb-3">
            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
              <LayoutTemplate size={14} className="text-muted-foreground" /> 
              {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Templates
            </h3>
          </div>
          
          <ScrollArea className="h-[500px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map((template) => (
                <TemplateCard 
                  key={template.id}
                  template={template}
                  onSelect={handleSelectTemplate}
                  onPreview={handlePreviewTemplate}
                />
              ))}
            </div>
          </ScrollArea>
        </Tabs>
      </CardContent>
      
      {/* Template preview dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
            <DialogDescription>{selectedTemplate?.description}</DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4">
            <div className="overflow-hidden rounded-md border">
              <img 
                src={selectedTemplate?.previewImage} 
                alt={selectedTemplate?.name} 
                className="w-full aspect-video object-cover"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <h4 className="text-sm font-medium mb-1">Features</h4>
                <ul className="text-sm text-muted-foreground list-disc list-inside">
                  <li>Responsive design</li>
                  <li>SEO optimized structure</li>
                  <li>Fully customizable sections</li>
                  <li>Professionally written content</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Included Sections</h4>
                <ul className="text-sm text-muted-foreground list-disc list-inside">
                  {selectedTemplate?.template.sections.map((section: any, index: number) => (
                    <li key={index}>{section.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              handleSelectTemplate(selectedTemplate!);
              setIsPreviewOpen(false);
            }}>
              Use This Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

// Template card component
interface TemplateCardProps {
  template: PageTemplate;
  onSelect: (template: PageTemplate) => void;
  onPreview: (template: PageTemplate) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect, onPreview }) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative">
        <img 
          src={template.previewImage} 
          alt={template.name} 
          className="w-full aspect-video object-cover"
        />
        {template.isNew && (
          <Badge className="absolute top-2 right-2 bg-primary">New</Badge>
        )}
        {template.isFeatured && !template.isNew && (
          <Badge className="absolute top-2 right-2 bg-yellow-500">Featured</Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-base mb-1">{template.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{template.description}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {template.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="px-4 py-3 pt-0 flex justify-between">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onPreview(template)}
        >
          Preview
        </Button>
        <Button 
          size="sm"
          onClick={() => onSelect(template)}
          className="gap-1"
        >
          <Check size={14} />
          Use Template
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PageBuilderTemplateGallery;