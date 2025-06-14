# SmartSite Style Package - Quick Setup

Copy these 3 files to replicate the exact SmartSite admin styling:

## 1. theme.json
```json
{
  "primary": "#000000",
  "variant": "professional", 
  "appearance": "dark",
  "radius": 4
}
```

## 2. tailwind.config.ts
```typescript
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "glow": {
          "0%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
          "100%": { opacity: "0.4" },
        },
      },
      animation: {
        "glow": "glow 5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
```

## 3. styles/admin.css
```css
:root {
  --admin-primary: #4F46E5;
  --admin-card-border: #e2e8f0;
  --admin-text-primary: #1e293b;
  --admin-bg-main: #f8fafc;
}

.dark {
  --admin-primary: #8B5CF6;
  --admin-card-border: rgba(139, 92, 246, 0.2);
  --admin-text-primary: #F9FAFB;
  --admin-bg-main: #111827;
  --admin-gradient-primary: linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #3B82F6 100%);
  --admin-gradient-secondary: linear-gradient(135deg, #1F2937 0%, #374151 100%);
}

.admin-dashboard {
  background: var(--admin-bg-main) !important;
  min-height: 100vh;
  color: var(--admin-text-primary) !important;
}

.admin-card {
  background: #1f2937 !important;
  border: 1px solid var(--admin-card-border) !important;
  border-radius: 1.25rem !important;
  color: white !important;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
}

.admin-card:hover {
  transform: translateY(-6px) scale(1.01) !important;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.15) !important;
}
```

## Usage:
```html
<div className="admin-dashboard dark" data-admin>
  <div className="admin-card p-6">
    <h2>Your Content</h2>
  </div>
</div>
```