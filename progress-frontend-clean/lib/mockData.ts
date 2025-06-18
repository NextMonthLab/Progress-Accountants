// Mock data service for standalone frontend
export const mockBusinessIdentity = {
  core: {
    businessName: "Progress Accountants",
    tagline: "Forward-thinking Accountants for UK Businesses",
    description: "Empowering your business with strategic financial planning, expert tax optimisation, and tailored insights—delivered with tech-savvy clarity.",
  },
  personality: {
    usps: [
      "Specialists in digital, construction, film & music industries",
      "Tech-driven accounting powered by Xero, QuickBooks & real-time dashboards",
      "Friendly, expert team who truly understand your business"
    ],
    missionStatement: "We don't just talk about growth. We build the tools that drive it.",
  },
  market: {
    targetAudience: "UK Businesses",
    geographicFocus: "United Kingdom",
  },
  services: [
    "Accounting & Bookkeeping",
    "Tax Planning & Returns", 
    "Business Consulting",
    "Payroll Services",
    "Financial Dashboards",
    "Industry Specialist Services"
  ]
};

export const mockPages = [
  "/",
  "/about", 
  "/services",
  "/team",
  "/contact",
  "/industries/film",
  "/industries/music", 
  "/industries/construction",
  "/industries/professional-services",
  "/why-us",
  "/calculator"
];

export const mockSeoConfig = {
  id: 1,
  tenantId: null,
  routePath: "/",
  metaTitle: "Progress Accountants | Forward-thinking Accounting for UK Businesses",
  metaDescription: "Expert accountants specializing in digital, construction, film & music industries. Tech-driven solutions with Xero & QuickBooks integration.",
  keywords: "accountants, UK, Xero, QuickBooks, tax planning, business consulting",
  ogTitle: "Progress Accountants | Forward-thinking Accounting",
  ogDescription: "Empowering UK businesses with strategic financial planning and expert tax optimization.",
  canonicalUrl: "https://progressaccountants.com"
};

export const mockClients = [
  {
    id: 1,
    name: "Mitchell Construction Ltd",
    email: "david@mitchellconstruction.co.uk",
    phone: "01295 123456",
    company: "Mitchell Construction Ltd",
    status: "active",
    lastContact: "2024-12-15",
    notes: "Construction industry specialist client"
  },
  {
    id: 2,
    name: "Pemberton Film Productions",
    email: "sarah@pembertonfilms.com",
    phone: "01295 234567",
    company: "Pemberton Film Productions",
    status: "active",
    lastContact: "2024-12-10",
    notes: "Film industry tax relief specialist"
  },
  {
    id: 3,
    name: "Wilson & Associates",
    email: "james@wilsonassoc.co.uk",
    phone: "01295 345678",
    company: "Wilson & Associates",
    status: "active",
    lastContact: "2024-12-08",
    notes: "Professional services client"
  }
];

// Mock API functions that return promises to mimic real API calls
export const mockApi = {
  getBusinessIdentity: () => Promise.resolve(mockBusinessIdentity),
  getPages: () => Promise.resolve(mockPages),
  getSeoConfig: () => Promise.resolve(mockSeoConfig),
  getTenant: () => Promise.resolve({ id: "demo", name: "Progress Accountants Demo" }),
  createSupportSession: () => Promise.resolve({ 
    success: true, 
    session: { id: Date.now(), createdAt: new Date().toISOString() }
  })
};