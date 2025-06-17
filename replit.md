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