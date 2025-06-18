# Progress Accountants - Frontend

Clean, production-ready frontend application for Progress Accountants built with React, TypeScript, and Vite.

## Features

- **Modern React Application**: Built with React 18 and TypeScript
- **Professional UI**: Radix UI components with Tailwind CSS styling
- **Responsive Design**: Mobile-first approach with dark mode support
- **Smart Site Integration**: Client dashboard with iframe embedding
- **External Integrations**: Calendly booking, contact forms, chatbot embed
- **Industry Pages**: Specialized pages for Film, Music, Construction, Professional Services
- **Business Tools**: Calculator, SME support hub, resource center

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Configure VITE_API_BASE_URL if using with backend
   ```

3. **Development Server**
   ```bash
   npm run dev
   ```

4. **Production Build**
   ```bash
   npm run build
   ```

## Deployment

### Static Hosting (Netlify, Vercel, etc.)
```bash
npm run build
# Deploy the 'dist' folder
```

### Environment Variables
- `VITE_API_BASE_URL`: Backend API URL (optional for standalone mode)
- `VITE_MODE`: Application mode (defaults to 'client')

## Architecture

- **Frontend-Only**: Operates independently without backend dependencies
- **Mock Data**: Graceful fallbacks for API calls in standalone mode
- **Asset Management**: All images and assets included in public directory
- **Route Configuration**: Complete routing for all business pages

## Key Pages

- `/` - Homepage with business overview
- `/about` - Company information and team
- `/services` - Accounting services overview
- `/team` - Staff profiles and qualifications
- `/contact` - Contact forms and office information
- `/client-dashboard` - Smart Site integration
- `/industries/*` - Industry-specific pages
- `/business-calculator` - Business planning tools
- `/sme-support-hub` - SME resources and support

## External Integrations

- **Calendly**: Booking system integration
- **Contact Forms**: Lead capture and inquiry forms
- **Chatbot**: External chatbot embed script
- **PDF Generation**: Downloadable business resources

## Production Ready

This frontend package is completely self-contained and ready for deployment to any static hosting platform. All features work in standalone mode with graceful API fallbacks.