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
import { Check, LayoutTemplate, Sparkles, BookOpen, Eye } from "lucide-react";
import { createTemplatePreviews } from "./TemplatePreviews";

// Define template categories
type TemplateCategory = 'landing' | 'about' | 'services' | 'contact' | 'blog' | 'pricing' | 'faq' | 'portfolio';

// Define template interface
interface PageTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  previewImage: string; // Data URL of the preview image
  tags: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  template: any; // The actual template data structure
}

// Define template previews interface to match what createTemplatePreviews returns
interface TemplatePreviews {
  landing: {
    modern: string;
    service: string;
    product: string;
  };
  about: {
    story: string;
    team: string;
  };
  services: {
    cards: string;
    detailed: string;
  };
  contact: {
    basic: string;
    full: string;
  };
  blog: {
    grid: string;
    article: string;
  };
  pricing: {
    simple: string;
    detailed: string;
  };
  faq: {
    accordion: string;
    support: string;
  };
  portfolio: {
    grid: string;
    case: string;
  };
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

// Create a more advanced SVG preview for each specific template
const createEnhancedPreview = (type: string, subtype: string): string => {
  // More vibrant and diverse color palette
  const colorPalettes: Record<string, Record<string, { bg: string, accent: string, highlight: string }>> = {
    landing: {
      modern: { bg: '#0d47a1', accent: '#2196f3', highlight: '#bbdefb' },
      service: { bg: '#1a237e', accent: '#3f51b5', highlight: '#c5cae9' },
      product: { bg: '#01579b', accent: '#0288d1', highlight: '#b3e5fc' },
    },
    about: {
      story: { bg: '#4a148c', accent: '#7b1fa2', highlight: '#e1bee7' },
      team: { bg: '#311b92', accent: '#5e35b1', highlight: '#d1c4e9' },
    },
    services: {
      cards: { bg: '#1b5e20', accent: '#4caf50', highlight: '#c8e6c9' },
      detailed: { bg: '#004d40', accent: '#00897b', highlight: '#b2dfdb' },
    },
    contact: {
      basic: { bg: '#0d47a1', accent: '#1976d2', highlight: '#bbdefb' },
      full: { bg: '#006064', accent: '#0097a7', highlight: '#b2ebf2' },
    },
    blog: {
      grid: { bg: '#263238', accent: '#455a64', highlight: '#cfd8dc' },
      article: { bg: '#37474f', accent: '#546e7a', highlight: '#cfd8dc' },
    },
    pricing: {
      simple: { bg: '#bf360c', accent: '#e64a19', highlight: '#ffccbc' },
      detailed: { bg: '#b71c1c', accent: '#e53935', highlight: '#ffcdd2' },
    },
    faq: {
      accordion: { bg: '#4a148c', accent: '#6a1b9a', highlight: '#e1bee7' },
      support: { bg: '#3e2723', accent: '#5d4037', highlight: '#d7ccc8' },
    },
    portfolio: {
      grid: { bg: '#0d47a1', accent: '#1976d2', highlight: '#bbdefb' },
      case: { bg: '#006064', accent: '#0097a7', highlight: '#b2ebf2' },
    }
  };

  // Select color palette based on template type and subtype
  const categoryColors = colorPalettes[type] || colorPalettes.landing;
  const colors = categoryColors[subtype] || Object.values(categoryColors)[0];

  // Base SVG with improved styling
  const svgBase = `
    <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" preserveAspectRatio="none">
      <defs>
        <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${colors.bg}" />
          <stop offset="100%" stop-color="${colors.accent}" />
        </linearGradient>
        <linearGradient id="buttonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${colors.accent}" />
          <stop offset="100%" stop-color="${colors.highlight}" stop-opacity="0.8" />
        </linearGradient>
        <style type="text/css">
          .bg { fill: ${colors.bg}; }
          .section { fill: rgba(255,255,255,0.05); stroke: rgba(255,255,255,0.4); stroke-width: 1; rx: 6; }
          .header-section { fill: url(#headerGradient); stroke: rgba(255,255,255,0.4); stroke-width: 1; rx: 6; }
          .text { fill: white; font-family: Arial, sans-serif; }
          .title { font-size: 16px; font-weight: bold; }
          .subtitle { font-size: 12px; }
          .small-text { font-size: 9px; fill: rgba(255,255,255,0.7); }
          .button { fill: url(#buttonGradient); stroke: white; stroke-width: 1; rx: 20; }
          .card { fill: rgba(255,255,255,0.1); stroke: ${colors.highlight}; stroke-width: 1; rx: 8; }
          .card-accent { fill: ${colors.accent}; opacity: 0.2; rx: 4; }
          .divider { stroke: ${colors.highlight}; stroke-width: 1; stroke-dasharray: 4 2; }
          .form-field { fill: rgba(255,255,255,0.08); stroke: rgba(255,255,255,0.3); stroke-width: 1; rx: 4; }
          .map { fill: rgba(255,255,255,0.08); stroke: ${colors.highlight}; stroke-width: 1; rx: 6; }
          .circle { fill: ${colors.accent}; stroke: white; stroke-width: 1; opacity: 0.4; }
          .line { stroke: ${colors.highlight}; stroke-width: 1; }
          .grid { stroke: rgba(255,255,255,0.1); stroke-width: 0.5; }
          .highlight { fill: ${colors.highlight}; opacity: 0.15; }
          .icon { fill: ${colors.highlight}; }
        </style>
      </defs>
      <rect width="600" height="400" class="bg" />
      
      <!-- Grid background for design appeal -->
      <g class="grid">
        ${Array(8).fill(0).map((_, i) => 
          `<line x1="0" y1="${i * 50}" x2="600" y2="${i * 50}" />`
        ).join('')}
        ${Array(12).fill(0).map((_, i) => 
          `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="400" />`
        ).join('')}
      </g>
      
      {{CONTENT}}
      
      <!-- Progress Accountants watermark -->
      <text x="570" y="390" text-anchor="end" class="small-text">Progress Accountants</text>
    </svg>
  `;

  // Content templates customized for each template type and subtype
  let content = '';
  
  // LANDING PAGE TEMPLATES
  if (type === 'landing') {
    if (subtype === 'modern') {
      content = `
        <!-- Modern Hero -->
        <rect x="50" y="50" width="500" height="130" class="header-section" />
        <text x="75" y="85" class="text title">Welcome to Progress Accountants</text>
        <text x="75" y="110" class="text subtitle">Professional Financial Services</text>
        <rect x="75" y="130" width="120" height="30" class="button" />
        <text x="135" y="150" class="text subtitle" text-anchor="middle">Get Started</text>
        
        <!-- Image placeholder -->
        <rect x="350" y="70" width="180" height="90" class="highlight" rx="4" />
        <circle cx="390" cy="105" r="15" class="circle" />
        <circle cx="430" cy="95" r="10" class="circle" />
        <circle cx="470" cy="115" r="12" class="circle" />
        
        <!-- Feature Cards -->
        <rect x="50" y="200" width="150" height="100" class="card" />
        <rect x="60" y="210" width="30" height="30" class="card-accent" />
        <rect x="60" y="250" width="130" height="8" class="highlight" />
        <rect x="60" y="265" width="100" height="8" class="highlight" />
        <rect x="60" y="280" width="110" height="8" class="highlight" />
        
        <rect x="225" y="200" width="150" height="100" class="card" />
        <rect x="235" y="210" width="30" height="30" class="card-accent" />
        <rect x="235" y="250" width="130" height="8" class="highlight" />
        <rect x="235" y="265" width="100" height="8" class="highlight" />
        <rect x="235" y="280" width="110" height="8" class="highlight" />
        
        <rect x="400" y="200" width="150" height="100" class="card" />
        <rect x="410" y="210" width="30" height="30" class="card-accent" />
        <rect x="410" y="250" width="130" height="8" class="highlight" />
        <rect x="410" y="265" width="100" height="8" class="highlight" />
        <rect x="410" y="280" width="110" height="8" class="highlight" />
        
        <!-- CTA section -->
        <rect x="50" y="320" width="500" height="60" class="section" />
        <rect x="240" y="335" width="120" height="30" class="button" />
        <text x="300" y="355" class="text subtitle" text-anchor="middle">Contact Us</text>
      `;
    } else if (subtype === 'service') {
      content = `
        <!-- Service Hero -->
        <rect x="50" y="50" width="500" height="130" class="header-section" />
        <text x="300" y="85" class="text title" text-anchor="middle">Professional Accounting Services</text>
        <text x="300" y="110" class="text subtitle" text-anchor="middle">Trust the experts with your finances</text>
        
        <!-- Trust signals -->
        <circle cx="200" cy="150" r="15" class="circle" />
        <text x="230" y="155" class="text subtitle">Certified Experts</text>
        
        <circle cx="380" cy="150" r="15" class="circle" />
        <text x="410" y="155" class="text subtitle">25+ Years</text>
        
        <!-- Service Categories -->
        <rect x="50" y="190" width="235" height="100" class="card" />
        <text x="167" y="220" class="text subtitle" text-anchor="middle">Tax Planning</text>
        <rect x="70" y="240" width="195" height="30" class="highlight" />
        
        <rect x="315" y="190" width="235" height="100" class="card" />
        <text x="432" y="220" class="text subtitle" text-anchor="middle">Business Advisory</text>
        <rect x="335" y="240" width="195" height="30" class="highlight" />
        
        <!-- Testimonial -->
        <rect x="50" y="310" width="500" height="70" class="section" />
        <text x="300" y="335" class="text subtitle" text-anchor="middle">"Exceptional service that transformed our business finances"</text>
        <text x="300" y="360" class="small-text" text-anchor="middle">— John Smith, CEO of Smith Enterprises</text>
      `;
    } else { // product showcase
      content = `
        <!-- Product Hero -->
        <rect x="50" y="50" width="500" height="100" class="header-section" />
        <text x="75" y="85" class="text title">Financial Solutions Suite</text>
        <text x="75" y="110" class="text subtitle">Comprehensive tools for business growth</text>
        
        <!-- Product Showcase -->
        <rect x="50" y="170" width="500" height="160" class="section" />
        
        <rect x="70" y="190" width="140" height="120" class="card" />
        <circle cx="140" cy="220" r="25" class="circle" />
        <text x="140" y="270" class="text subtitle" text-anchor="middle">Tax Planner</text>
        
        <rect x="230" y="190" width="140" height="120" class="card" />
        <circle cx="300" cy="220" r="25" class="circle" />
        <text x="300" y="270" class="text subtitle" text-anchor="middle">Cash Flow</text>
        
        <rect x="390" y="190" width="140" height="120" class="card" />
        <circle cx="460" cy="220" r="25" class="circle" />
        <text x="460" y="270" class="text subtitle" text-anchor="middle">Reporting</text>
        
        <!-- Call to action -->
        <rect x="200" y="350" width="200" height="30" class="button" />
        <text x="300" y="370" class="text subtitle" text-anchor="middle">See Pricing Plans</text>
      `;
    }
  }
  
  // ABOUT PAGE TEMPLATES
  else if (type === 'about') {
    if (subtype === 'story') {
      content = `
        <!-- About Header -->
        <rect x="50" y="50" width="500" height="80" class="header-section" />
        <text x="300" y="85" class="text title" text-anchor="middle">Our Story</text>
        <text x="300" y="110" class="text subtitle" text-anchor="middle">Building Trust in Finance Since 1995</text>
        
        <!-- Timeline -->
        <line x1="100" y1="150" x2="100" y2="330" class="line" />
        <circle cx="100" cy="170" r="8" class="circle" />
        <text x="120" y="175" class="text subtitle">Founded in 1995</text>
        
        <circle cx="100" cy="220" r="8" class="circle" />
        <text x="120" y="225" class="text subtitle">Expanded Services in 2005</text>
        
        <circle cx="100" cy="270" r="8" class="circle" />
        <text x="120" y="275" class="text subtitle">Digital Transformation in 2015</text>
        
        <circle cx="100" cy="320" r="8" class="circle" />
        <text x="120" y="325" class="text subtitle">Today: Serving 500+ Businesses</text>
        
        <!-- Values -->
        <rect x="300" y="160" width="200" height="180" class="card" />
        <text x="400" y="185" class="text title" text-anchor="middle">Our Values</text>
        
        <rect x="320" y="200" width="160" height="20" class="highlight" />
        <rect x="320" y="230" width="160" height="20" class="highlight" />
        <rect x="320" y="260" width="160" height="20" class="highlight" />
        <rect x="320" y="290" width="160" height="20" class="highlight" />
      `;
    } else { // team showcase
      content = `
        <!-- Team Header -->
        <rect x="50" y="50" width="500" height="80" class="header-section" />
        <text x="300" y="85" class="text title" text-anchor="middle">Meet Our Team</text>
        <text x="300" y="110" class="text subtitle" text-anchor="middle">Expert Accountants & Financial Advisors</text>
        
        <!-- Team Grid -->
        <rect x="50" y="150" width="500" height="230" class="section" />
        
        <rect x="70" y="170" width="100" height="100" class="card" />
        <circle cx="120" cy="200" r="30" class="circle" />
        <text x="120" y="250" class="text subtitle" text-anchor="middle">Jane Doe</text>
        <text x="120" y="265" class="small-text" text-anchor="middle">CEO</text>
        
        <rect x="190" y="170" width="100" height="100" class="card" />
        <circle cx="240" cy="200" r="30" class="circle" />
        <text x="240" y="250" class="text subtitle" text-anchor="middle">John Smith</text>
        <text x="240" y="265" class="small-text" text-anchor="middle">CFO</text>
        
        <rect x="310" y="170" width="100" height="100" class="card" />
        <circle cx="360" cy="200" r="30" class="circle" />
        <text x="360" y="250" class="text subtitle" text-anchor="middle">Sarah Lee</text>
        <text x="360" y="265" class="small-text" text-anchor="middle">Tax Advisor</text>
        
        <rect x="430" y="170" width="100" height="100" class="card" />
        <circle cx="480" cy="200" r="30" class="circle" />
        <text x="480" y="250" class="text subtitle" text-anchor="middle">Mike Chen</text>
        <text x="480" y="265" class="small-text" text-anchor="middle">Consultant</text>
        
        <rect x="70" y="280" width="100" height="100" class="card" />
        <circle cx="120" cy="310" r="30" class="circle" />
        <text x="120" y="360" class="text subtitle" text-anchor="middle">Emma Wilson</text>
        <text x="120" y="375" class="small-text" text-anchor="middle">Accountant</text>
        
        <rect x="190" y="280" width="100" height="100" class="card" />
        <circle cx="240" cy="310" r="30" class="circle" />
        <text x="240" y="360" class="text subtitle" text-anchor="middle">David Park</text>
        <text x="240" y="375" class="small-text" text-anchor="middle">Analyst</text>
        
        <rect x="310" y="280" width="100" height="100" class="card" />
        <circle cx="360" cy="310" r="30" class="circle" />
        <text x="360" y="360" class="text subtitle" text-anchor="middle">Lisa Kim</text>
        <text x="360" y="375" class="small-text" text-anchor="middle">Controller</text>
        
        <rect x="430" y="280" width="100" height="100" class="card" />
        <circle cx="480" cy="310" r="30" class="circle" />
        <text x="480" y="360" class="text subtitle" text-anchor="middle">James Taylor</text>
        <text x="480" y="375" class="small-text" text-anchor="middle">Advisor</text>
      `;
    }
  }
  
  // SERVICES TEMPLATES
  else if (type === 'services') {
    if (subtype === 'cards') {
      content = `
        <!-- Services Header -->
        <rect x="50" y="50" width="500" height="80" class="header-section" />
        <text x="300" y="85" class="text title" text-anchor="middle">Our Services</text>
        <text x="300" y="110" class="text subtitle" text-anchor="middle">Comprehensive Financial Solutions</text>
        
        <!-- Service Cards -->
        <rect x="60" y="150" width="220" height="110" class="card" />
        <rect x="75" y="165" width="40" height="40" class="card-accent" />
        <text x="170" y="190" class="text subtitle" text-anchor="middle">Tax Planning</text>
        <rect x="75" y="210" width="190" height="35" class="highlight" />
        
        <rect x="320" y="150" width="220" height="110" class="card" />
        <rect x="335" y="165" width="40" height="40" class="card-accent" />
        <text x="430" y="190" class="text subtitle" text-anchor="middle">Financial Reporting</text>
        <rect x="335" y="210" width="190" height="35" class="highlight" />
        
        <rect x="60" y="270" width="220" height="110" class="card" />
        <rect x="75" y="285" width="40" height="40" class="card-accent" />
        <text x="170" y="310" class="text subtitle" text-anchor="middle">Business Advisory</text>
        <rect x="75" y="330" width="190" height="35" class="highlight" />
        
        <rect x="320" y="270" width="220" height="110" class="card" />
        <rect x="335" y="285" width="40" height="40" class="card-accent" />
        <text x="430" y="310" class="text subtitle" text-anchor="middle">Wealth Management</text>
        <rect x="335" y="330" width="190" height="35" class="highlight" />
      `;
    } else { // detailed services
      content = `
        <!-- Detailed Services Header -->
        <rect x="50" y="50" width="500" height="70" class="header-section" />
        <text x="300" y="85" class="text title" text-anchor="middle">Professional Services</text>
        <text x="300" y="105" class="text subtitle" text-anchor="middle">Tailored to Your Business Needs</text>
        
        <!-- Service Categories -->
        <rect x="50" y="140" width="500" height="240" class="section" />
        
        <rect x="70" y="160" width="130" height="8" class="highlight" />
        <rect x="70" y="175" width="110" height="8" class="highlight" />
        <rect x="70" y="190" width="120" height="8" class="highlight" />
        <rect x="70" y="205" width="90" height="8" class="highlight" />
        
        <rect x="240" y="160" width="280" height="60" class="card" />
        <text x="380" y="190" class="text subtitle" text-anchor="middle">Tax Optimization</text>
        <rect x="260" y="210" width="240" height="0.5" class="line" />
        
        <rect x="70" y="240" width="130" height="8" class="highlight" />
        <rect x="70" y="255" width="110" height="8" class="highlight" />
        <rect x="70" y="270" width="120" height="8" class="highlight" />
        <rect x="70" y="285" width="90" height="8" class="highlight" />
        
        <rect x="240" y="240" width="280" height="60" class="card" />
        <text x="380" y="270" class="text subtitle" text-anchor="middle">Financial Auditing</text>
        <rect x="260" y="290" width="240" height="0.5" class="line" />
        
        <rect x="70" y="320" width="130" height="8" class="highlight" />
        <rect x="70" y="335" width="110" height="8" class="highlight" />
        <rect x="70" y="350" width="120" height="8" class="highlight" />
        <rect x="70" y="365" width="90" height="8" class="highlight" />
        
        <rect x="240" y="320" width="280" height="60" class="card" />
        <text x="380" y="350" class="text subtitle" text-anchor="middle">Business Strategy</text>
        <rect x="260" y="370" width="240" height="0.5" class="line" />
      `;
    }
  }
  
  // CONTACT TEMPLATES
  else if (type === 'contact') {
    if (subtype === 'basic') {
      content = `
        <!-- Contact Header -->
        <rect x="50" y="50" width="500" height="70" class="header-section" />
        <text x="300" y="85" class="text title" text-anchor="middle">Contact Us</text>
        <text x="300" y="105" class="text subtitle" text-anchor="middle">Get in touch with our team</text>
        
        <!-- Contact Form -->
        <rect x="50" y="140" width="230" height="240" class="section" />
        <text x="70" y="165" class="text subtitle">Send us a message</text>
        
        <rect x="70" y="180" width="190" height="30" class="form-field" />
        <text x="80" y="200" class="small-text">Name</text>
        
        <rect x="70" y="220" width="190" height="30" class="form-field" />
        <text x="80" y="240" class="small-text">Email</text>
        
        <rect x="70" y="260" width="190" height="30" class="form-field" />
        <text x="80" y="280" class="small-text">Subject</text>
        
        <rect x="70" y="300" width="190" height="50" class="form-field" />
        <text x="80" y="320" class="small-text">Message</text>
        
        <rect x="70" y="360" width="100" height="30" class="button" />
        <text x="120" y="380" class="text subtitle" text-anchor="middle">Send</text>
        
        <!-- Map -->
        <rect x="300" y="140" width="250" height="240" class="map" />
        <circle cx="425" cy="260" r="10" class="circle" />
        <line x1="425" y1="260" x2="425" y2="280" class="line" />
        <line x1="420" y1="275" x2="425" y2="280" class="line" />
        <line x1="430" y1="275" x2="425" y2="280" class="line" />
      `;
    } else { // full contact center
      content = `
        <!-- Full Contact Header -->
        <rect x="50" y="50" width="500" height="70" class="header-section" />
        <text x="300" y="85" class="text title" text-anchor="middle">Contact Center</text>
        <text x="300" y="105" class="text subtitle" text-anchor="middle">Multiple ways to reach us</text>
        
        <!-- Tabs -->
        <rect x="170" y="130" width="80" height="25" class="button" />
        <text x="210" y="147" class="small-text" text-anchor="middle">General</text>
        
        <rect x="260" y="130" width="80" height="25" class="card" />
        <text x="300" y="147" class="small-text" text-anchor="middle">Support</text>
        
        <rect x="350" y="130" width="80" height="25" class="card" />
        <text x="390" y="147" class="small-text" text-anchor="middle">Sales</text>
        
        <!-- Contact Options -->
        <rect x="50" y="165" width="310" height="215" class="section" />
        
        <!-- Form -->
        <rect x="70" y="180" width="270" height="30" class="form-field" />
        <text x="80" y="200" class="small-text">Name</text>
        
        <rect x="70" y="220" width="270" height="30" class="form-field" />
        <text x="80" y="240" class="small-text">Email</text>
        
        <rect x="70" y="260" width="270" height="30" class="form-field" />
        <text x="80" y="280" class="small-text">Subject</text>
        
        <rect x="70" y="300" width="270" height="50" class="form-field" />
        <text x="80" y="320" class="small-text">Message</text>
        
        <rect x="240" y="360" width="100" height="30" class="button" />
        <text x="290" y="380" class="text subtitle" text-anchor="middle">Send</text>
        
        <!-- Locations -->
        <rect x="380" y="165" width="170" height="215" class="card" />
        <text x="465" y="185" class="text subtitle" text-anchor="middle">Our Offices</text>
        
        <rect x="390" y="200" width="150" height="1" class="line" />
        
        <text x="400" y="220" class="small-text">New York Office</text>
        <rect x="400" y="230" width="130" height="20" class="highlight" />
        
        <text x="400" y="265" class="small-text">London Office</text>
        <rect x="400" y="275" width="130" height="20" class="highlight" />
        
        <text x="400" y="310" class="small-text">Sydney Office</text>
        <rect x="400" y="320" width="130" height="20" class="highlight" />
      `;
    }
  }
  
  // BLOG TEMPLATES
  else if (type === 'blog') {
    if (subtype === 'grid') {
      content = `
        <!-- Blog Header -->
        <rect x="50" y="50" width="500" height="70" class="header-section" />
        <text x="300" y="85" class="text title" text-anchor="middle">Our Blog</text>
        <text x="300" y="105" class="text subtitle" text-anchor="middle">Latest insights and news</text>
        
        <!-- Categories -->
        <rect x="50" y="140" width="500" height="40" class="section" />
        <rect x="70" y="150" width="80" height="20" class="button" />
        <text x="110" y="164" class="small-text" text-anchor="middle">All</text>
        
        <rect x="160" y="150" width="80" height="20" class="card" />
        <text x="200" y="164" class="small-text" text-anchor="middle">Tax</text>
        
        <rect x="250" y="150" width="80" height="20" class="card" />
        <text x="290" y="164" class="small-text" text-anchor="middle">Business</text>
        
        <rect x="340" y="150" width="80" height="20" class="card" />
        <text x="380" y="164" class="small-text" text-anchor="middle">Advisory</text>
        
        <rect x="430" y="150" width="80" height="20" class="card" />
        <text x="470" y="164" class="small-text" text-anchor="middle">News</text>
        
        <!-- Blog Grid -->
        <rect x="50" y="190" width="500" height="190" class="section" />
        
        <rect x="70" y="210" width="140" height="150" class="card" />
        <rect x="70" y="210" width="140" height="70" class="card-accent" />
        <rect x="80" y="290" width="120" height="10" class="highlight" />
        <rect x="80" y="310" width="100" height="10" class="highlight" />
        <rect x="80" y="330" width="80" height="10" class="highlight" />
        
        <rect x="230" y="210" width="140" height="150" class="card" />
        <rect x="230" y="210" width="140" height="70" class="card-accent" />
        <rect x="240" y="290" width="120" height="10" class="highlight" />
        <rect x="240" y="310" width="100" height="10" class="highlight" />
        <rect x="240" y="330" width="80" height="10" class="highlight" />
        
        <rect x="390" y="210" width="140" height="150" class="card" />
        <rect x="390" y="210" width="140" height="70" class="card-accent" />
        <rect x="400" y="290" width="120" height="10" class="highlight" />
        <rect x="400" y="310" width="100" height="10" class="highlight" />
        <rect x="400" y="330" width="80" height="10" class="highlight" />
      `;
    } else { // article template
      content = `
        <!-- Article Header -->
        <rect x="50" y="50" width="500" height="90" class="header-section" />
        <text x="300" y="85" class="text title" text-anchor="middle">Article Title Goes Here</text>
        <text x="300" y="105" class="text subtitle" text-anchor="middle">Comprehensive guide to financial planning</text>
        <text x="300" y="125" class="small-text" text-anchor="middle">Published: April 15, 2025 | Author: Jane Smith | 5 min read</text>
        
        <!-- Article Content -->
        <rect x="100" y="160" width="400" height="220" class="section" />
        
        <!-- Featured image -->
        <rect x="130" y="180" width="340" height="120" class="card-accent" />
        
        <!-- Article text -->
        <rect x="130" y="310" width="340" height="10" class="highlight" />
        <rect x="130" y="330" width="340" height="10" class="highlight" />
        <rect x="130" y="350" width="340" height="10" class="highlight" />
        
        <!-- Sidebar elements -->
        <rect x="50" y="160" width="40" height="220" class="card" />
        <circle cx="70" cy="190" r="10" class="circle" />
        <circle cx="70" cy="230" r="10" class="circle" />
        <circle cx="70" cy="270" r="10" class="circle" />
        <circle cx="70" cy="310" r="10" class="circle" />
      `;
    }
  }
  
  // PRICING TEMPLATES
  else if (type === 'pricing') {
    if (subtype === 'simple') {
      content = `
        <!-- Pricing Header -->
        <rect x="50" y="50" width="500" height="70" class="header-section" />
        <text x="300" y="85" class="text title" text-anchor="middle">Pricing Plans</text>
        <text x="300" y="105" class="text subtitle" text-anchor="middle">Choose the right plan for your business</text>
        
        <!-- Pricing Tables -->
        <rect x="50" y="140" width="500" height="240" class="section" />
        
        <rect x="70" y="160" width="140" height="200" class="card" />
        <rect x="70" y="160" width="140" height="40" class="card-accent" />
        <text x="140" y="185" class="text subtitle" text-anchor="middle">Basic</text>
        <text x="140" y="220" class="text title" text-anchor="middle">$99</text>
        <text x="140" y="240" class="small-text" text-anchor="middle">per month</text>
        <rect x="90" y="260" width="100" height="8" class="highlight" />
        <rect x="90" y="280" width="100" height="8" class="highlight" />
        <rect x="90" y="300" width="100" height="8" class="highlight" />
        <rect x="90" y="320" width="100" height="25" class="button" />
        
        <rect x="230" y="160" width="140" height="200" class="card" />
        <rect x="230" y="160" width="140" height="40" class="card-accent" />
        <text x="300" y="185" class="text subtitle" text-anchor="middle">Pro</text>
        <text x="300" y="220" class="text title" text-anchor="middle">$199</text>
        <text x="300" y="240" class="small-text" text-anchor="middle">per month</text>
        <rect x="250" y="260" width="100" height="8" class="highlight" />
        <rect x="250" y="280" width="100" height="8" class="highlight" />
        <rect x="250" y="300" width="100" height="8" class="highlight" />
        <rect x="250" y="320" width="100" height="25" class="button" />
        
        <rect x="390" y="160" width="140" height="200" class="card" />
        <rect x="390" y="160" width="140" height="40" class="card-accent" />
        <text x="460" y="185" class="text subtitle" text-anchor="middle">Enterprise</text>
        <text x="460" y="220" class="text title" text-anchor="middle">$299</text>
        <text x="460" y="240" class="small-text" text-anchor="middle">per month</text>
        <rect x="410" y="260" width="100" height="8" class="highlight" />
        <rect x="410" y="280" width="100" height="8" class="highlight" />
        <rect x="410" y="300" width="100" height="8" class="highlight" />
        <rect x="410" y="320" width="100" height="25" class="button" />
      `;
    } else { // detailed pricing
      content = `
        <!-- Detailed Pricing Header -->
        <rect x="50" y="50" width="500" height="70" class="header-section" />
        <text x="300" y="85" class="text title" text-anchor="middle">Comprehensive Pricing</text>
        <text x="300" y="105" class="text subtitle" text-anchor="middle">Transparent pricing for all your needs</text>
        
        <!-- Pricing Toggle -->
        <rect x="220" y="130" width="160" height="30" class="section" />
        <rect x="230" y="135" width="60" height="20" class="button" />
        <text x="260" y="150" class="small-text" text-anchor="middle">Monthly</text>
        <text x="340" y="150" class="small-text" text-anchor="middle">Annual</text>
        
        <!-- Pricing Tables -->
        <rect x="50" y="170" width="500" height="210" class="section" />
        
        <rect x="65" y="185" width="150" height="180" class="card" />
        <text x="140" y="210" class="text subtitle" text-anchor="middle">Starter</text>
        <line x1="80" y1="225" x2="200" y2="225" class="line" />
        <text x="140" y="250" class="text title" text-anchor="middle">$99</text>
        <rect x="85" y="270" width="110" height="8" class="highlight" />
        <rect x="85" y="285" width="110" height="8" class="highlight" />
        <rect x="85" y="300" width="110" height="8" class="highlight" />
        <rect x="85" y="315" width="110" height="8" class="highlight" />
        <rect x="95" y="335" width="90" height="20" class="button" />
        
        <rect x="225" y="185" width="150" height="180" class="card" />
        <rect x="225" y="185" width="150" height="180" class="card" />
        <text x="300" y="210" class="text subtitle" text-anchor="middle">Professional</text>
        <line x1="240" y1="225" x2="360" y2="225" class="line" />
        <text x="300" y="250" class="text title" text-anchor="middle">$199</text>
        <rect x="245" y="270" width="110" height="8" class="highlight" />
        <rect x="245" y="285" width="110" height="8" class="highlight" />
        <rect x="245" y="300" width="110" height="8" class="highlight" />
        <rect x="245" y="315" width="110" height="8" class="highlight" />
        <rect x="255" y="335" width="90" height="20" class="button" />
        
        <rect x="385" y="185" width="150" height="180" class="card" />
        <text x="460" y="210" class="text subtitle" text-anchor="middle">Enterprise</text>
        <line x1="400" y1="225" x2="520" y2="225" class="line" />
        <text x="460" y="250" class="text title" text-anchor="middle">Custom</text>
        <rect x="405" y="270" width="110" height="8" class="highlight" />
        <rect x="405" y="285" width="110" height="8" class="highlight" />
        <rect x="405" y="300" width="110" height="8" class="highlight" />
        <rect x="405" y="315" width="110" height="8" class="highlight" />
        <rect x="415" y="335" width="90" height="20" class="button" />
      `;
    }
  }
  
  // FAQ TEMPLATES
  else if (type === 'faq') {
    if (subtype === 'accordion') {
      content = `
        <!-- FAQ Header -->
        <rect x="50" y="50" width="500" height="70" class="header-section" />
        <text x="300" y="85" class="text title" text-anchor="middle">Frequently Asked Questions</text>
        <text x="300" y="105" class="text subtitle" text-anchor="middle">Find answers to common questions</text>
        
        <!-- FAQ Search -->
        <rect x="150" y="140" width="300" height="35" class="form-field" />
        <text x="300" y="162" class="small-text" text-anchor="middle">Search questions...</text>
        
        <!-- FAQ Accordion -->
        <rect x="100" y="190" width="400" height="190" class="section" />
        
        <rect x="120" y="210" width="360" height="35" class="card" />
        <text x="140" y="232" class="text subtitle">How do I get started with your services?</text>
        <text x="460" y="232" class="text subtitle" text-anchor="end">+</text>
        
        <rect x="120" y="255" width="360" height="35" class="card" />
        <text x="140" y="277" class="text subtitle">What payment methods do you accept?</text>
        <text x="460" y="277" class="text subtitle" text-anchor="end">+</text>
        
        <rect x="120" y="300" width="360" height="70" class="card" />
        <text x="140" y="322" class="text subtitle">Do you offer refunds?</text>
        <text x="460" y="322" class="text subtitle" text-anchor="end">-</text>
        <rect x="140" y="335" width="320" height="25" class="highlight" />
      `;
    } else { // support center
      content = `
        <!-- Support Center Header -->
        <rect x="50" y="50" width="500" height="70" class="header-section" />
        <text x="300" y="85" class="text title" text-anchor="middle">Support Center</text>
        <text x="300" y="105" class="text subtitle" text-anchor="middle">Get help and find answers</text>
        
        <!-- Support Categories -->
        <rect x="70" y="140" width="140" height="30" class="button" />
        <text x="140" y="160" class="small-text" text-anchor="middle">FAQs</text>
        
        <rect x="230" y="140" width="140" height="30" class="card" />
        <text x="300" y="160" class="small-text" text-anchor="middle">Guides</text>
        
        <rect x="390" y="140" width="140" height="30" class="card" />
        <text x="460" y="160" class="small-text" text-anchor="middle">Contact</text>
        
        <!-- FAQ Content -->
        <rect x="50" y="180" width="500" height="200" class="section" />
        
        <!-- FAQ Categories -->
        <rect x="70" y="200" width="150" height="160" class="card" />
        <text x="145" y="220" class="text subtitle" text-anchor="middle">Categories</text>
        <line x1="85" y1="235" x2="205" y2="235" class="line" />
        
        <rect x="85" y="245" width="120" height="20" class="highlight" />
        <rect x="85" y="275" width="120" height="20" class="highlight" />
        <rect x="85" y="305" width="120" height="20" class="highlight" />
        <rect x="85" y="335" width="120" height="20" class="highlight" />
        
        <!-- FAQ Items -->
        <rect x="240" y="200" width="290" height="160" class="card" />
        
        <rect x="260" y="220" width="250" height="25" class="highlight" />
        <rect x="260" y="255" width="250" height="25" class="highlight" />
        <rect x="260" y="290" width="250" height="25" class="highlight" />
        <rect x="260" y="325" width="250" height="25" class="highlight" />
      `;
    }
  }
  
  // PORTFOLIO TEMPLATES
  else if (type === 'portfolio') {
    if (subtype === 'grid') {
      content = `
        <!-- Portfolio Header -->
        <rect x="50" y="50" width="500" height="70" class="header-section" />
        <text x="300" y="85" class="text title" text-anchor="middle">Our Portfolio</text>
        <text x="300" y="105" class="text subtitle" text-anchor="middle">Client success stories</text>
        
        <!-- Portfolio Filters -->
        <rect x="50" y="140" width="500" height="40" class="section" />
        <rect x="70" y="150" width="80" height="20" class="button" />
        <text x="110" y="164" class="small-text" text-anchor="middle">All</text>
        
        <rect x="160" y="150" width="80" height="20" class="card" />
        <text x="200" y="164" class="small-text" text-anchor="middle">Small</text>
        
        <rect x="250" y="150" width="80" height="20" class="card" />
        <text x="290" y="164" class="small-text" text-anchor="middle">Medium</text>
        
        <rect x="340" y="150" width="80" height="20" class="card" />
        <text x="380" y="164" class="small-text" text-anchor="middle">Enterprise</text>
        
        <!-- Portfolio Grid -->
        <rect x="50" y="190" width="500" height="190" class="section" />
        
        <rect x="70" y="210" width="220" height="160" class="card" />
        <rect x="70" y="210" width="220" height="120" class="card-accent" />
        <rect x="90" y="340" width="180" height="20" class="highlight" />
        
        <rect x="310" y="210" width="220" height="160" class="card" />
        <rect x="310" y="210" width="220" height="120" class="card-accent" />
        <rect x="330" y="340" width="180" height="20" class="highlight" />
      `;
    } else { // case studies
      content = `
        <!-- Case Studies Header -->
        <rect x="50" y="50" width="500" height="70" class="header-section" />
        <text x="300" y="85" class="text title" text-anchor="middle">Client Case Studies</text>
        <text x="300" y="105" class="text subtitle" text-anchor="middle">In-depth success stories</text>
        
        <!-- Featured Case Study -->
        <rect x="50" y="140" width="500" height="130" class="section" />
        <rect x="70" y="160" width="170" height="90" class="card-accent" />
        
        <rect x="260" y="160" width="270" height="90" class="card" />
        <text x="280" y="180" class="text subtitle">Smith Enterprises: Financial Transformation</text>
        <rect x="280" y="190" width="230" height="10" class="highlight" />
        <rect x="280" y="210" width="230" height="10" class="highlight" />
        <rect x="280" y="230" width="100" height="10" class="highlight" />
        
        <!-- Case Study Grid -->
        <rect x="50" y="290" width="500" height="90" class="section" />
        
        <rect x="70" y="310" width="150" height="50" class="card" />
        <text x="145" y="335" class="small-text" text-anchor="middle">Johnson Manufacturing</text>
        
        <rect x="235" y="310" width="150" height="50" class="card" />
        <text x="310" y="335" class="small-text" text-anchor="middle">ABC Retail</text>
        
        <rect x="400" y="310" width="150" height="50" class="card" />
        <text x="475" y="335" class="small-text" text-anchor="middle">Tech Innovations</text>
      `;
    }
  }
  
  // DEFAULT TEMPLATE
  else {
    content = `
      <text x="300" y="200" text-anchor="middle" class="text title">Template Preview</text>
    `;
  }
  
  // Replace content in the SVG template
  const fullSvg = svgBase.replace('{{CONTENT}}', content);
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(fullSvg)}`;
};

// Create template previews
const TEMPLATE_PREVIEWS: TemplatePreviews = createTemplatePreviews();

// Create templates for each category
const sampleTemplates: PageTemplate[] = [
  // Landing page templates
  {
    id: "landing-hero-1",
    name: "Modern Business Landing",
    description: "A clean, modern landing page with hero section, features, testimonials, and CTA.",
    category: "landing",
    previewImage: TEMPLATE_PREVIEWS.landing.modern,
    tags: ["modern", "business", "conversion"],
    isFeatured: true,
    template: createLandingPageTemplate("Modern Business")
  },
  {
    id: "landing-service-2",
    name: "Service Provider Landing",
    description: "Perfect for accountants and professional services with trust signals and credentials.",
    category: "landing",
    previewImage: TEMPLATE_PREVIEWS.landing.service,
    tags: ["professional", "services", "trust"],
    isNew: true,
    template: createLandingPageTemplate("Service Provider")
  },
  {
    id: "landing-product-3",
    name: "Product Showcase",
    description: "Highlight your product features and benefits with this conversion-focused layout.",
    category: "landing",
    previewImage: TEMPLATE_PREVIEWS.landing.product,
    tags: ["product", "features", "conversion"],
    template: createLandingPageTemplate("Product Showcase")
  },

  // About page templates
  {
    id: "about-story-1",
    name: "Company Story",
    description: "Tell your brand story with timeline, values, and team section.",
    category: "about",
    previewImage: TEMPLATE_PREVIEWS.about.story,
    tags: ["story", "values", "team"],
    template: createAboutPageTemplate("Company Story")
  },
  {
    id: "about-team-2",
    name: "Team Showcase",
    description: "Highlight your team with detailed profiles and expertise areas.",
    category: "about",
    previewImage: TEMPLATE_PREVIEWS.about.team,
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
    previewImage: TEMPLATE_PREVIEWS.services.cards,
    tags: ["services", "pricing", "features"],
    template: createServicesPageTemplate("Service Cards")
  },
  {
    id: "services-detailed-2",
    name: "Detailed Services",
    description: "In-depth service descriptions with process explanation and case studies.",
    category: "services",
    previewImage: TEMPLATE_PREVIEWS.services.detailed,
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
    previewImage: TEMPLATE_PREVIEWS.contact.basic,
    tags: ["contact", "form", "map"],
    template: createContactPageTemplate("Basic Contact")
  },
  {
    id: "contact-full-2",
    name: "Full Contact Center",
    description: "Complete contact center with department routing, FAQ, and multiple office locations.",
    category: "contact",
    previewImage: TEMPLATE_PREVIEWS.contact.full,
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
    previewImage: TEMPLATE_PREVIEWS.blog.grid,
    tags: ["blog", "grid", "categories"],
    template: createBlogPageTemplate("Blog Grid")
  },
  {
    id: "blog-article-2",
    name: "Article Template",
    description: "Clean, readable article template with related posts and author bio.",
    category: "blog",
    previewImage: TEMPLATE_PREVIEWS.blog.article,
    tags: ["article", "readability", "sharing"],
    template: createBlogPageTemplate("Article Template")
  },

  // Pricing page templates
  {
    id: "pricing-simple-1",
    name: "Simple Pricing",
    description: "Clear, straightforward pricing tables with feature comparison.",
    category: "pricing",
    previewImage: TEMPLATE_PREVIEWS.pricing.simple,
    tags: ["pricing", "comparison", "conversion"],
    template: createPricingPageTemplate("Simple Pricing")
  },
  {
    id: "pricing-detailed-2",
    name: "Detailed Pricing",
    description: "Comprehensive pricing with FAQ, testimonials, and feature breakdowns.",
    category: "pricing",
    previewImage: TEMPLATE_PREVIEWS.pricing.detailed,
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
    previewImage: TEMPLATE_PREVIEWS.faq.accordion,
    tags: ["FAQ", "accordion", "categories"],
    template: createFaqPageTemplate("FAQ Accordion")
  },
  {
    id: "faq-support-2",
    name: "Support Center",
    description: "Comprehensive support center with FAQs, guides, and contact options.",
    category: "faq",
    previewImage: TEMPLATE_PREVIEWS.faq.support,
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
    previewImage: TEMPLATE_PREVIEWS.portfolio.grid,
    tags: ["portfolio", "projects", "filtering"],
    template: createPortfolioPageTemplate("Portfolio Grid")
  },
  {
    id: "portfolio-case-2",
    name: "Case Studies",
    description: "In-depth case studies with process, results, and testimonials.",
    category: "portfolio",
    previewImage: TEMPLATE_PREVIEWS.portfolio.case,
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