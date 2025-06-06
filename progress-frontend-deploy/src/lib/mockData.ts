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