# Progress Accountants - Frontend Only

This is a clean, standalone frontend-only version of the Progress Accountants website. All admin functionality, authentication, and backend dependencies have been surgically removed for separate hosting.

## Features

✅ **Clean Public Pages**: Homepage, About, Services, Team, Contact
✅ **Industry Pages**: Film, Music, Construction, Professional Services  
✅ **Legal Pages**: Privacy Policy, Terms of Service, Cookie Policy
✅ **Embedded Chatbot**: External chatbot integration maintained
✅ **Responsive Design**: Full mobile and desktop compatibility
✅ **Modern UI**: Radix UI components with Tailwind CSS
✅ **Static Deployment Ready**: Optimized for Netlify, Vercel, Hetzner

## Removed Components

❌ All admin panels and dashboards
❌ Authentication system (useAuth, login/logout)
❌ User management and permissions
❌ Backend API dependencies
❌ Database connections
❌ Admin-only tools and features

## Quick Start

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Preview build
npm run preview
```

## Deployment

This frontend is ready for static hosting on:

- **Netlify**: Deploy from GitHub with auto-build
- **Vercel**: Import project and deploy
- **Hetzner**: Upload dist/ folder to static hosting

### Build Output

The `npm run build` command creates a `dist/` folder with optimized static files ready for deployment.

## External Integrations

- **Chatbot**: Embedded via external script (progress-accountants-uk-chatbot)
- **Contact Forms**: External iframe integration
- **Calendly**: Direct booking integration for consultations

## File Structure

```
src/
├── components/     # UI components (Navbar, Footer, etc.)
├── pages/         # Route components  
├── lib/           # Utilities and data
├── hooks/         # React hooks
└── assets/        # Static assets
```

## Environment Variables

No sensitive environment variables required. See `.env.example` for optional configuration.

## Security

This frontend contains no sensitive data, API keys, or admin functionality. Safe for public deployment.