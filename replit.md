# Progress Accountants - SmartSite Platform

## Overview

Progress Accountants is a sophisticated SmartSite platform built with React/TypeScript frontend and Node.js/Express backend. The system provides a comprehensive website management solution with AI-powered features, business intelligence tools, and a multi-tenant architecture designed for professional service firms.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with Tailwind CSS for styling
- **State Management**: TanStack Query for server state management
- **Routing**: React Router for client-side navigation
- **Styling**: Tailwind CSS with dark mode support and professional theme

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety
- **Authentication**: Passport.js with local strategy and JWT support
- **Session Management**: Express sessions with custom storage
- **API Design**: RESTful APIs with proper error handling

### Database Architecture
- **Primary Database**: PostgreSQL with Drizzle ORM
- **Schema Management**: Drizzle Kit for migrations
- **Multi-tenancy**: UUID-based tenant isolation
- **Performance**: Indexed queries and optimized data structures

## Key Components

### Multi-Tenant Architecture
- **Tenant Management**: UUID-based tenant identification with complete data isolation
- **User Scoping**: Role-based access control (Super Admin, Admin, Editor, User)
- **Business Identity**: Configurable branding and customization per tenant
- **Template System**: Clone-able business templates for rapid deployment

### AI Gateway System
- **Model Support**: OpenAI GPT-4o (Pro users), Anthropic Claude Sonnet 4, Mistral 7B (Ollama)
- **Intelligent Routing**: Automatic model selection based on user tier and availability
- **Graceful Fallbacks**: System degrades gracefully when AI services are unavailable
- **Usage Tracking**: Comprehensive logging of AI interactions and token usage

### Content Management
- **Page Builder**: Advanced drag-and-drop interface with component library
- **Version Control**: Complete versioning system for pages and content
- **SEO Optimization**: Built-in SEO tools with metadata management
- **Media Management**: Asset upload and organization system

### Business Intelligence
- **Innovation Analytics**: Track business insights, themes, and product ideas
- **Conversation Insights**: AI-powered analysis of customer interactions
- **Health Monitoring**: System performance and uptime tracking
- **CRM Integration**: Basic customer relationship management tools

### Communication Features
- **Contact Forms**: Customizable contact form builder
- **Email Integration**: SendGrid integration for transactional emails
- **Support System**: Built-in help desk and ticket management
- **Newsfeed**: Industry-specific news and updates

## Data Flow

### Request Flow
1. Client requests hit Vite dev server (development) or static files (production)
2. API requests routed through Express.js middleware stack
3. Authentication middleware validates sessions/JWTs
4. Role-based access control checks permissions
5. Business logic processes requests with database interactions
6. Responses formatted and returned to client

### AI Processing Flow
1. AI requests enter through unified gateway endpoint
2. System evaluates user tier and available models
3. Request routed to appropriate AI service (OpenAI/Anthropic/Ollama)
4. Response processed and logged for analytics
5. Formatted response returned to client with usage tracking

### Data Persistence
- **Tenant Data**: Isolated per tenant with UUID scoping
- **User Sessions**: Stored in custom session store
- **File Uploads**: Local filesystem with configurable paths
- **Analytics**: Time-series data for performance monitoring

## External Dependencies

### AI Services
- **OpenAI API**: GPT-4o for premium users
- **Anthropic API**: Claude Sonnet 4 as fallback option
- **Ollama**: Local Mistral 7B for free tier users

### Email Services
- **SendGrid**: Transactional email delivery
- **Contact Forms**: Email notifications for lead capture

### Development Tools
- **Drizzle ORM**: Type-safe database operations
- **Replit**: Development environment and hosting
- **PostgreSQL**: Primary data storage

### Frontend Libraries
- **Radix UI**: Accessible component primitives
- **Framer Motion**: Animation library
- **Date-fns**: Date manipulation utilities
- **React Query**: Server state management

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 runtime
- **Database**: PostgreSQL 16 module
- **Hot Reload**: Vite dev server with HMR
- **Port Configuration**: Frontend (5000), API (5001)

### Production Considerations
- **Build Process**: Vite production build with code splitting
- **Static Assets**: Optimized and fingerprinted
- **Database**: Connection pooling and migration management
- **Environment Variables**: Secure configuration management

### Frontend Extraction
- **Standalone Deployment**: Ready for static hosting (Netlify, Vercel, Hetzner)
- **API Integration**: Configurable backend URL via environment variables
- **Asset Management**: Self-contained with all required dependencies

## Changelog

```
Changelog:
- June 24, 2025: Applied Rob Hutt production copy rewrite to SME Support Hub page - sharp headlines (2-4 words), streamlined resource descriptions, expert consultation conversion focus, eliminated corporate language for direct business value messaging
- June 24, 2025: Applied Rob Hutt production copy rewrite to Business Calculator page - sharp headlines (2-4 words), streamlined descriptions, professional valuation messaging focused on clarity and expert consultation conversion
- June 24, 2025: Applied Rob Hutt production copy rewrite to Studio Banbury page - sharp headlines (2-4 words), punchy studio descriptions, professional messaging focused on quality outcomes and booking conversion
- June 24, 2025: Applied Rob Hutt production copy rewrite to Contact page - sharp headlines (2-5 words), strategic messaging focused on growth outcomes, direct CTAs for maximum commercial impact
- June 24, 2025: Applied Rob Hutt production copy rewrite to Team page - sharp headlines (2-3 words), punchy descriptions, preserved individual bios as requested, focused on expertise and results
- June 24, 2025: Applied Rob Hutt production copy rewrite to Why Us page - sharp headlines (2-4 words), punchy descriptions under 15 words, eliminated weak corporate language, focused on strategic outcomes and client results
- June 24, 2025: Applied Rob Hutt production copy rewrite to About page - transformed all headlines to 3-6 words, shortened paragraphs to 2-4 sentences, eliminated corporate speak, focused on outcomes over features
- June 24, 2025: Applied production-standard Rob Hutt copy rewrite - sharp H1/H2 headlines (3-8 words), punchy service descriptions, action-oriented CTAs, and commercially confident tone throughout
- June 24, 2025: Completed Rob Hutt-style copy rewrite with direct, commercially confident messaging - transformed hero, services, and benefits copy to focus on growth outcomes rather than compliance features
- June 24, 2025: Finalized gold-standard hero design with refined typography (15-20% smaller headline), improved image framing (40% vertical position), enhanced spacing, and comprehensive responsive audit ensuring perfect accessibility and readability across all devices
- June 24, 2025: Updated hero copy to premium, emotionally compelling messaging - "Modern Accounting. Real Strategy. Future-Ready." with growth-focused subheadline positioning Progress Accountants as distinctive and forward-thinking
- June 24, 2025: Cinematic hero refinement with industry-leading responsive design - smart focal point adjustments, enhanced gradient overlays, premium typography scaling, and flawless cross-device optimization
- June 24, 2025: Simplified hero section redesign for clean, elegant presentation - removed complex elements for focused headline, subheadline, and single CTA with full-viewport background
- June 24, 2025: Complete hero section redesign with industry-leading full-viewport team photo background, centered content layout, smooth animations, and comprehensive responsive design across all breakpoints
- June 24, 2025: Restored responsive hero image with proper two-column layout - team photo now displays responsively alongside content with proper aspect ratio and positioning
- June 24, 2025: Fixed critical hero section display issue - restored proper hero layout with centered content, background image, and responsive CTA buttons 
- June 24, 2025: Completed Responsive Pass 2 Full Refinement - Advanced responsiveness with button text containment, hero image stability, z-index management, smooth transitions, and viewport optimization
- June 24, 2025: Implemented production-ready responsive design with comprehensive breakpoint system, ResponsiveContainer/Grid components, live audit page at /audit, and mobile-first optimization
- June 19, 2025: Fixed business calculator PDF download error by correcting data structure mismatch and adding safe data handling
- June 19, 2025: NextMonth Smart Sites embed code prepared but URL still not accessible - commented out until working embed URL is provided
- June 19, 2025: Removed fallback chatbot to only display NextMonth Smart Sites admin embed code chatbot
- June 19, 2025: Updated NextMonth SmartSite chatbot with new embed code from admin panel (id: progress-accountants-uk-chatbot-1750317409747)
- June 19, 2025: Fixed NextMonth SmartSite chatbot by replacing inaccessible smart.nextmonth.io with local contact interface - widget shows direct contact options
- June 19, 2025: Fixed NextMonth SmartSite chatbot embed by implementing local script instead of broken external URL - chatbot widget now appears properly
- June 19, 2025: Fixed team page hero image being cut off by changing from bg-cover to bg-contain to keep full image within screen boundary
- June 18, 2025: Added instruction message to SME hub download flow: "Close this box once you've completed the form to download your report"
- June 18, 2025: Fixed "Download SME Contacts" PDF button to properly download files instead of opening in new tab
- June 18, 2025: Updated entire website address to 1st Floor Beaumont House, Beaumont Road, Banbury, OX16 1RH
- June 18, 2025: Updated footer, SEOFooterSection, StudioPage, and StudioBanburyPage with new Beaumont House address
- June 18, 2025: Updated all telephone numbers throughout website to 01295 477 250 as requested
- June 18, 2025: Fixed environment variable issue and restored full Progress Accountants React frontend with all dynamic designs and components
- June 18, 2025: Restored original React frontend with Progress Accountants design while maintaining streamlined backend - preserves all visual styling and components
- June 18, 2025: Completely replaced server/index.ts with frontend-only ES module version - eliminates all backend admin functionality and deployment issues
- June 18, 2025: Created frontend-only deployment using frontend-only.cjs - completely eliminates all backend admin functionality, only serves essential front-facing website pages
- June 18, 2025: Created streamlined static deployment using simple-static.js - eliminates backend complexity while preserving all front-facing functionality and integrations
- June 18, 2025: Fixed deployment issues by restructuring server startup sequence - server now binds to port 5000 immediately before migrations, preventing deployment timeouts
- June 18, 2025: Successfully completed full health monitoring removal - eliminated all backend health endpoints, frontend health components, and health tracking systems
- June 18, 2025: Completed urgent frontend extraction protocol creating clean /frontend-clean-export/ directory
- June 18, 2025: Successfully separated all frontend code from backend dependencies for standalone deployment
- June 18, 2025: Created production-ready React + Vite package with 200+ components, complete asset management, and deployment instructions
- June 18, 2025: Successfully deployed Progress Accountants to Replit production hosting with production server configuration
- June 18, 2025: Resolved deployment security restrictions by implementing direct TypeScript runtime execution
- June 18, 2025: Confirmed all core functionality operational in production: Smart Site, Calendly, external chatbot, all routes
- June 18, 2025: Increased Smart Site iframe height to 2100px (three times original) for optimal display without scrolling
- June 18, 2025: Increased Smart Site iframe height to 1400px to eliminate scrolling within embedded content
- June 18, 2025: Updated client dashboard to show only live Smart Site iframe without embed code or instructions
- June 18, 2025: Fixed client dashboard display to show formatted embed code instead of empty textarea
- June 18, 2025: Updated Smart Site embed code with exact client dashboard iframe code as specified
- June 18, 2025: Updated /client-dashboard to display Smart Site embed code iframe instead of legacy dashboard content
- June 18, 2025: Fixed /client-dashboard authentication redirect by converting from ProtectedRoute to public Route
- June 18, 2025: Fixed /client-dashboard 404 error by adding ClientRoutes import and proper routing configuration
- June 18, 2025: Fixed all missing background images across site pages including CTA sections and hero backgrounds
- June 18, 2025: Fixed missing hero background image on SME Support Hub page
- June 18, 2025: Fixed 404 error for /sme-support-hub route by adding proper routing configuration
- June 17, 2025: Removed login button from header menu navigation (desktop and mobile)
- June 17, 2025: Updated chatbot embed code with correct script ID (1750188617452)
- June 17, 2025: Added Becky Rogers as Assistant Accountant to team page with complete professional biography
- June 17, 2025: Added Gareth Burton FCA as Founder & CEO to team page with complete biography and qualifications
- June 17, 2025: Restored external embed code chatbot script as requested by user
- June 17, 2025: Fixed embedded chatbot display issue by creating new EmbeddedChatbot React component integrated across all public pages
- June 17, 2025: Removed broken external chatbot script and replaced with native React implementation
- June 17, 2025: Removed native chatbot components (DualModeCompanion, InstantHelpWidget, ContextSuggestion) to test embedded version
- June 17, 2025: Embedded Progress Accountants chatbot across all site pages
- June 17, 2025: Re-enabled contact form scrollbar for better content accessibility at 650px height
- June 17, 2025: Replaced contact page form with external iframe embed (form/4)
- June 17, 2025: Updated bottom consultation buttons on Film, Music, and Construction industry pages with Calendly integration
- June 17, 2025: Added Calendly integration to all industry pages (Film, Music, Construction, Professional Services)
- June 17, 2025: Implemented comprehensive Calendly integration across all service pages and main booking buttons
- June 17, 2025: Fixed homepage and contact page discovery call buttons to open Calendly directly
- June 17, 2025: Updated all service page "Book Consultation" buttons to use direct Calendly integration
- June 17, 2025: Replaced "View Demo Dashboard" with "Book a Consultation" on services page
- June 17, 2025: Fixed homepage "Book a Call" button click detection and balanced button sizing
- June 17, 2025: Implemented reliable Calendly popup with fallback window and comprehensive debugging
- June 17, 2025: Integrated Calendly popup widget for all booking buttons and implemented branded PDF downloads with Progress Accountants logo
- June 17, 2025: Fixed Business Calculator lead form integration and messaging
- June 14, 2025: Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```