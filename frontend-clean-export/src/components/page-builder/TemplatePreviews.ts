// Enhanced template preview creation helper functions
// This ensures we have properly typed template previews that can be used consistently

// Create SVG template previews and return them as data URLs for use in the UI
export function createTemplatePreviews() {
  // Various template categories and their subtypes
  const templateTypes = {
    landing: ['modern', 'service', 'product'],
    about: ['story', 'team'],
    services: ['cards', 'detailed'],
    contact: ['basic', 'full'],
    blog: ['grid', 'article'],
    pricing: ['simple', 'detailed'],
    faq: ['accordion', 'support'],
    portfolio: ['grid', 'case']
  };
  
  // Generate all template previews
  const previews: Record<string, Record<string, string>> = {};
  
  Object.entries(templateTypes).forEach(([category, subtypes]) => {
    previews[category] = {};
    subtypes.forEach(subtype => {
      previews[category][subtype] = createEnhancedPreview(category, subtype);
    });
  });
  
  return previews;
}

// Helper function to create detailed SVG previews
function createEnhancedPreview(type: string, subtype: string): string {
  // Color palettes for different template types
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

  // Select appropriate colors based on template type and subtype
  const categoryColors = colorPalettes[type] || colorPalettes.landing;
  const subtypeKey = subtype as keyof typeof categoryColors;
  const colors = categoryColors[subtypeKey] || Object.values(categoryColors)[0];

  // Create base SVG with consistent styling
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

  // Return placeholder for unknown template types
  let content = `<text x="300" y="200" text-anchor="middle" class="text title">Template Preview</text>`;
  
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
  
  // Generate the final SVG with content
  const fullSvg = svgBase.replace('{{CONTENT}}', content);
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(fullSvg)}`;
}