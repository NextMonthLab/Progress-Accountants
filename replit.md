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
- June 18, 2025: Completed frontend-only production build following RAPLET protocol - ready for Replit Deployment
- June 18, 2025: Fixed deployment configuration to use production commands only (removed 'dev' references)
- June 18, 2025: Created manual deployment fix instructions due to .replit file edit restrictions
- June 18, 2025: Confirmed .replit file edit restrictions - deployment solution provided via progress-frontend-clean/ directory
- June 18, 2025: Created Hetzner deployment package with Docker configuration for static hosting
- June 18, 2025: Completed production hardening - removed all backend dependencies, fixed mobile responsiveness, optimized for static deployment
- June 18, 2025: Executed RAPLET Final Hardening Protocol - bulletproof static deployment with asset optimization, pure embed model, and mobile layout hardening
- June 18, 2025: Eliminated 22-second loading delays and help system warnings - instant page loading achieved
- June 18, 2025: Removed all animation delays and framer-motion transitions causing 9+ second load times - replaced with instant render components
- June 18, 2025: FINAL SOLUTION: Preserved visual scroll animations while eliminating backend health monitoring delays - frontend now loads instantly with smooth aesthetics
- June 18, 2025: RAPLET SURGICAL REPAIR COMPLETE: Purged all health systems, optimized assets, hardened mobile responsiveness, created production Docker configuration for Hetzner deployment
- June 18, 2025: Committed Docker deployment files to GitHub - docker-compose.hetzner.yml, Dockerfile.optimized, nginx.conf now available for Hetzner pull
- June 18, 2025: Package lock resolution complete - generated package-lock.json for strict Docker builds, container reproducibility stabilized
- June 18, 2025: Fixed Docker peer dependency mismatch - locked all versions without floating dependencies, ensured tailwindcss-animate compatibility
- June 18, 2025: Upgraded Dockerfile to node:20-alpine for npm compatibility with package-lock.json generated under npm 11.x.x
- June 18, 2025: Regenerated package-lock.json with full cross-platform metadata for Docker CI reproducibility - includes all transitive dependencies and platform hashes
- June 18, 2025: Fixed Vite module resolution error by regenerating node_modules and restoring working dependency state
- June 18, 2025: Fixed TailwindCSS PostCSS plugin error by installing @tailwindcss/postcss and updating configuration
- June 18, 2025: Reverted PostCSS configuration to standard TailwindCSS setup after styling broke completely
- June 18, 2025: Fixed TailwindCSS styling breakdown by downgrading to TailwindCSS 3.4.0 and reverting PostCSS configuration
- June 18, 2025: Fixed mobile horizontal scrolling drift and team image display issues with responsive CSS fixes
- June 18, 2025: Updated team hero image to use background-size: contain to ensure full team photo visibility on mobile and iPad devices
- June 18, 2025: Fixed homepage team photo cropping on mobile and iPad - changed from hidden md:block to always visible with background-size: contain
- June 18, 2025: Updated all phone numbers across the website to the correct number: 01295 477 250
- June 18, 2025: RAPLET pre-hardening compliance completed - fixed CSS dependencies, regenerated package-lock.json, validated production build ready for Hetzner Docker deployment
- June 18, 2025: Created production deployment guide due to dev command blocking deployment
- June 18, 2025: Updated podcast studio address to correct location: 1st Floor Beaumont House, Beaumont Road, OX16 1RH
- June 18, 2025: Successfully completed clean frontend extraction protocol - removed all admin functionality, authentication, and backend dependencies while preserving public website features
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