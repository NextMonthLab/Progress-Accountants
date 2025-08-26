# Progress Accountants - SmartSite Platform

## Overview
Progress Accountants' SmartSite platform is a comprehensive website management solution, built with a React/TypeScript frontend and Node.js/Express backend. It provides professional service firms with AI-powered features, business intelligence tools, and a multi-tenant architecture. The platform aims to offer a sophisticated system for website management, enhancing business capabilities and market presence.

## User Preferences
Preferred communication style: Simple, everyday language.

## Developer Handoff Status
- January 27, 2025: Comprehensive developer handoff documentation created in DEVELOPER_HANDOFF.md
- Project ready for external developer management with full technical documentation
- All systems operational and deployment-ready

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite
- **UI/UX**: Radix UI components with Tailwind CSS for styling, supporting dark mode and a professional theme.
- **State Management**: TanStack Query for server state.
- **Routing**: React Router for navigation.

### Backend Architecture
- **Runtime**: Node.js with Express.js and TypeScript.
- **Authentication**: Passport.js with local strategy and JWT.
- **API Design**: RESTful APIs with error handling.

### Database Architecture
- **Primary Database**: PostgreSQL with Drizzle ORM.
- **Schema Management**: Drizzle Kit for migrations.
- **Multi-tenancy**: UUID-based tenant isolation.

### Core Features
- **Multi-Tenant System**: UUID-based tenant identification, role-based access control (Super Admin, Admin, Editor, User), configurable branding, and clonable business templates.
- **AI Gateway**: Supports OpenAI GPT-4o, Anthropic Claude Sonnet 4, and Ollama (Mistral 7B) with intelligent routing, graceful fallbacks, and usage tracking.
- **Content Management**: Advanced drag-and-drop page builder, version control for content, built-in SEO tools, and media management.
- **Business Intelligence**: Analytics for innovation, AI-powered conversation insights, system health monitoring, and basic CRM integration.
- **Communication Tools**: Customizable contact forms, SendGrid email integration, built-in support system, and industry newsfeed.

### Data Flow
- **Request Flow**: Client requests processed through Express.js, authenticated, authorized by RBAC, then business logic interacts with the database.
- **AI Processing Flow**: Requests are routed to appropriate AI services based on user tier, processed, logged, and returned with usage tracking.
- **Data Persistence**: Tenant data is isolated, user sessions are custom-stored, file uploads are local, and analytics use time-series data.

## External Dependencies

### AI Services
- **OpenAI API**: For premium AI features.
- **Anthropic API**: As a fallback AI option.
- **Ollama**: For local AI model integration (Mistral 7B).

### Email Services
- **SendGrid**: For transactional email delivery.

### Development & Database
- **Drizzle ORM**: For database interactions.
- **Replit**: For development environment and hosting.
- **PostgreSQL**: Primary database storage.

### Frontend Libraries
- **Radix UI**: For accessible UI components.
- **Framer Motion**: For animations.
- **Date-fns**: For date manipulation.
- **React Query**: For server state management.