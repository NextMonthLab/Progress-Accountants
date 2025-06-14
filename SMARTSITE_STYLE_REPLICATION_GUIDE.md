# SmartSite Admin Dashboard Style Replication Guide

This comprehensive guide provides everything needed to replicate the exact visual styling from the SmartSite admin dashboard.

## Core Theme Configuration

### 1. theme.json
```json
{
  "primary": "#000000",
  "variant": "professional", 
  "appearance": "dark",
  "radius": 4
}
```

### 2. Tailwind Configuration (tailwind.config.ts)
```typescript
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "blob": {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "glow": {
          "0%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
          "100%": { opacity: "0.4" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "blob": "blob 7s infinite",
        "shimmer": "shimmer 4s ease-in-out infinite",
        "glow": "glow 5s ease-in-out infinite",
      },
      transitionTimingFunction: {
        "in-expo": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
```

## Complete Admin CSS Styling System

### 3. admin.css - Create this file in your styles directory
```css
/* admin.css - Complete SmartSite Admin Dashboard Styling System */

:root {
  /* Admin dashboard colors - Light mode */
  --admin-primary: #4F46E5;
  --admin-primary-hover: #6366F1;
  --admin-secondary: #E0F2FE;
  --admin-secondary-hover: #BAE6FD;
  --admin-secondary-text: #0284C7;
  --admin-settings-bg: #f1f5f9;
  --admin-settings-hover: #e2e8f0;
  --admin-settings-text: #334155;
  --admin-card-bg: #ffffff;
  --admin-card-border: #e2e8f0;
  --admin-text-primary: #1e293b;
  --admin-text-secondary: #64748b;
  --admin-bg-main: #f8fafc;
}

/* Ultra-Premium Dark Theme - Professional Grade */
.dark {
  --admin-primary: #8B5CF6;
  --admin-primary-hover: #A78BFA;
  --admin-secondary: #1F2937;
  --admin-secondary-hover: #374151;
  --admin-secondary-text: #9CA3AF;
  --admin-settings-bg: #1F2937;
  --admin-settings-hover: #374151;
  --admin-settings-text: #F9FAFB;
  --admin-card-bg: #1F2937;
  --admin-card-border: rgba(139, 92, 246, 0.2);
  --admin-text-primary: #F9FAFB;
  --admin-text-secondary: #9CA3AF;
  --admin-bg-main: #111827;
  --admin-gradient-primary: linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #3B82F6 100%);
  --admin-gradient-secondary: linear-gradient(135deg, #1F2937 0%, #374151 100%);
  --admin-gradient-card: linear-gradient(145deg, #1F2937 0%, #2D3748 100%);
  --admin-gradient-button: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
  --admin-shadow-light: rgba(139, 92, 246, 0.15);
  --admin-shadow-medium: rgba(0, 0, 0, 0.4);
  --admin-shadow-heavy: rgba(0, 0, 0, 0.6);
  --admin-glow-primary: 0 0 20px rgba(139, 92, 246, 0.3);
  --admin-glow-secondary: 0 0 15px rgba(99, 102, 241, 0.2);
}

/* Admin button styles - ensures they don't leak into public pages */
.admin-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.admin-btn-primary {
  background-color: var(--admin-primary);
  color: white;
}

.admin-btn-primary:hover {
  background-color: var(--admin-primary-hover);
}

.admin-btn-secondary {
  background-color: var(--admin-secondary);
  color: var(--admin-secondary-text);
}

.admin-btn-secondary:hover {
  background-color: var(--admin-secondary-hover);
}

.admin-btn-settings {
  background-color: var(--admin-settings-bg);
  color: var(--admin-settings-text);
}

.admin-btn-settings:hover {
  background-color: var(--admin-settings-hover);
}

/* Force Dark Cards for Admin Dashboard - Nuclear Override */
.admin-dashboard div {
  background-color: #1f2937 !important;
  background-image: none !important;
  color: white !important;
}

/* Restore background for main container and header */
.admin-dashboard,
.admin-dashboard .admin-header {
  background-color: #0f172a !important;
}

/* Force text colors */
.admin-dashboard div p,
.admin-dashboard div span,
.admin-dashboard div h1,
.admin-dashboard div h2,
.admin-dashboard div h3,
.admin-dashboard div h4 {
  color: white !important;
}

.admin-dashboard div .text-gray-400,
.admin-dashboard div .text-gray-500,
.admin-dashboard div .text-gray-600 {
  color: #9ca3af !important;
}

/* Keep buttons contrasted */
.admin-dashboard button.bg-white {
  background-color: white !important;
  color: black !important;
}

.admin-dashboard .text-white {
  color: white !important;
}

.admin-dashboard .text-gray-300 {
  color: #d1d5db !important;
}

.admin-dashboard .text-gray-400 {
  color: #9ca3af !important;
}

.admin-dashboard .text-gray-900 {
  color: white !important;
}

.admin-dashboard .text-gray-600 {
  color: #d1d5db !important;
}

.admin-dashboard .text-gray-500 {
  color: #9ca3af !important;
}

/* Ultra-Premium Card System */
.admin-card,
[data-admin] .card,
[data-admin] .Card,
body:has([data-admin]) .card,
.admin-layout .card {
  background: #1f2937 !important;
  border: 1px solid var(--admin-card-border) !important;
  border-radius: 1.25rem !important;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.12),
    0 4px 16px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.05) !important;
  color: white !important;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
  backdrop-filter: blur(12px) saturate(180%) !important;
  position: relative !important;
  overflow: hidden !important;
}

.dark .admin-card::before,
.dark [data-admin] .card::before,
.dark .admin-layout .card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(139, 92, 246, 0.1) 0%, 
    rgba(99, 102, 241, 0.05) 50%, 
    transparent 100%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.admin-card:hover,
[data-admin] .card:hover,
.admin-layout .card:hover {
  transform: translateY(-6px) scale(1.01) !important;
  box-shadow: 
    0 24px 64px rgba(0, 0, 0, 0.15),
    0 12px 32px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(139, 92, 246, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
}

.dark .admin-card:hover::before,
.dark [data-admin] .card:hover::before,
.dark .admin-layout .card:hover::before {
  opacity: 1;
}

/* Ensure admin containers are never oval */
[data-admin] *,
.admin-layout *,
body:has([data-admin]) * {
  border-radius: inherit !important;
}

[data-admin] *[class*="rounded-full"],
.admin-layout *[class*="rounded-full"],
body:has([data-admin]) *[class*="rounded-full"] {
  border-radius: 0.5rem !important;
}

/* Ultra-Premium Dashboard Layout */
.admin-dashboard {
  background: var(--admin-bg-main) !important;
  min-height: 100vh;
  color: var(--admin-text-primary) !important;
  position: relative !important;
}

.dark .admin-dashboard::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(ellipse at top left, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at top right, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at bottom center, rgba(59, 130, 246, 0.08) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.dark .admin-dashboard::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.05) 0%, transparent 25%),
    radial-gradient(circle at 75% 75%, rgba(99, 102, 241, 0.05) 0%, transparent 25%);
  pointer-events: none;
  z-index: 0;
  animation: glow 20s ease-in-out infinite alternate;
}

@keyframes glow {
  0% { opacity: 0.5; }
  100% { opacity: 1; }
}

/* Premium Typography System */
.admin-text-primary,
[data-admin] h1,
[data-admin] h2,
[data-admin] h3,
[data-admin] .text-gray-800,
.admin-layout h1,
.admin-layout h2,
.admin-layout h3,
.admin-layout .text-gray-800 {
  color: var(--admin-text-primary) !important;
  font-weight: 600 !important;
  letter-spacing: -0.025em !important;
}

.admin-text-secondary,
[data-admin] p,
[data-admin] .text-gray-500,
[data-admin] .text-gray-600,
.admin-layout p,
.admin-layout .text-gray-500,
.admin-layout .text-gray-600 {
  color: var(--admin-text-secondary) !important;
  font-weight: 400 !important;
}

/* Premium Stats Cards */
.admin-stats-card {
  background: var(--admin-gradient-secondary) !important;
  border: 1px solid var(--admin-card-border) !important;
  border-radius: 1.25rem !important;
  padding: 2rem !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative !important;
  overflow: hidden !important;
}

.admin-stats-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.admin-stats-card:hover {
  transform: translateY(-8px) scale(1.02) !important;
  box-shadow: 
    0 20px 60px var(--admin-shadow-heavy),
    0 8px 32px var(--admin-shadow-light) !important;
}

.dark .admin-stats-card {
  background: var(--admin-gradient-secondary) !important;
  box-shadow: 
    0 8px 32px var(--admin-shadow-medium),
    inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
}

/* Premium Admin Header */
.admin-header,
[data-admin] .bg-white,
.admin-layout .bg-white {
  background: var(--admin-gradient-secondary) !important;
  border: 1px solid var(--admin-card-border) !important;
  border-radius: 1.25rem !important;
  position: relative !important;
  overflow: hidden !important;
}

.dark .admin-header::before,
.dark [data-admin] .bg-white::before,
.dark .admin-layout .bg-white::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, transparent 50%);
  pointer-events: none;
}

/* Premium Tab System */
.admin-tabs-list,
[data-admin] .TabsList,
.admin-layout .TabsList,
[data-admin] [role="tablist"],
.admin-layout [role="tablist"] {
  background: var(--admin-gradient-secondary) !important;
  border: 1px solid var(--admin-card-border) !important;
  border-radius: 1rem !important;
  padding: 0.375rem !important;
  position: relative !important;
  backdrop-filter: blur(8px) !important;
}

.admin-tabs-trigger,
[data-admin] .TabsTrigger,
.admin-layout .TabsTrigger,
[data-admin] [role="tab"],
.admin-layout [role="tab"] {
  border-radius: 0.75rem !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  color: var(--admin-text-secondary) !important;
  font-weight: 500 !important;
  padding: 0.75rem 1.25rem !important;
  position: relative !important;
}

.admin-tabs-trigger[data-state="active"],
[data-admin] .TabsTrigger[data-state="active"],
.admin-layout .TabsTrigger[data-state="active"],
[data-admin] [role="tab"][data-state="active"],
.admin-layout [role="tab"][data-state="active"] {
  background: var(--admin-gradient-primary) !important;
  color: white !important;
  box-shadow: 
    0 4px 16px var(--admin-shadow-light),
    0 2px 8px rgba(79, 70, 229, 0.3) !important;
  transform: translateY(-1px) !important;
}

/* Ultra-Premium Button System */
[data-admin] .Button,
[data-admin] button,
.admin-layout .Button,
.admin-layout button {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
  border-radius: 1rem !important;
  font-weight: 600 !important;
  position: relative !important;
  overflow: hidden !important;
  backdrop-filter: blur(8px) !important;
}

[data-admin] .bg-teal-500,
.admin-layout .bg-teal-500,
.admin-btn-primary {
  background: var(--admin-gradient-button) !important;
  border: 1px solid rgba(139, 92, 246, 0.3) !important;
  box-shadow: 
    var(--admin-glow-primary),
    0 8px 24px rgba(139, 92, 246, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
  color: white !important;
}

[data-admin] .bg-teal-500::before,
.admin-layout .bg-teal-500::before,
.admin-btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

[data-admin] .bg-teal-500:hover,
.admin-layout .bg-teal-500:hover,
.admin-btn-primary:hover {
  background: linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%) !important;
  transform: translateY(-3px) scale(1.02) !important;
  box-shadow: 
    var(--admin-glow-primary),
    0 16px 40px rgba(139, 92, 246, 0.4),
    0 8px 20px rgba(139, 92, 246, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
}

[data-admin] .bg-teal-500:hover::before,
.admin-layout .bg-teal-500:hover::before,
.admin-btn-primary:hover::before {
  left: 100%;
}

/* Professional Form Controls */
[data-admin] input,
[data-admin] textarea,
[data-admin] select,
.admin-layout input,
.admin-layout textarea,
.admin-layout select {
  background: var(--admin-gradient-card) !important;
  border: 1px solid var(--admin-card-border) !important;
  border-radius: 1rem !important;
  padding: 1rem 1.25rem !important;
  color: var(--admin-text-primary) !important;
  font-size: 0.95rem !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  backdrop-filter: blur(8px) !important;
}

[data-admin] input:focus,
[data-admin] textarea:focus,
[data-admin] select:focus,
.admin-layout input:focus,
.admin-layout textarea:focus,
.admin-layout select:focus {
  outline: none !important;
  border-color: var(--admin-primary) !important;
  box-shadow: 
    0 0 0 3px rgba(139, 92, 246, 0.1),
    var(--admin-glow-secondary),
    inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
  transform: translateY(-1px) !important;
}

[data-admin] input::placeholder,
[data-admin] textarea::placeholder,
.admin-layout input::placeholder,
.admin-layout textarea::placeholder {
  color: var(--admin-text-secondary) !important;
  opacity: 0.7 !important;
}

/* Ultra-Premium Slider System */
.admin-slider-container {
  width: 100%;
  padding: 1.5rem 0;
  position: relative;
}

.admin-slider-track {
  height: 6px;
  background: rgba(31, 41, 55, 0.8);
  border-radius: 1rem;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(8px);
}

.admin-slider-fill {
  height: 100%;
  background: var(--admin-gradient-primary);
  border-radius: 1rem;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--admin-glow-secondary);
}

.admin-slider-thumb {
  width: 20px;
  height: 20px;
  background: var(--admin-gradient-button);
  border: 2px solid var(--admin-text-primary);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%) translateX(-50%);
  cursor: pointer;
  box-shadow: var(--admin-glow-primary);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.admin-slider-thumb:hover {
  transform: translateY(-50%) translateX(-50%) scale(1.2);
  box-shadow: 
    var(--admin-glow-primary),
    0 8px 24px rgba(139, 92, 246, 0.4);
}

.admin-slider-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-size: 0.875rem;
  color: var(--admin-text-secondary);
  font-weight: 500;
}

/* Enhanced Tab System */
.admin-tabs-list {
  background: var(--admin-gradient-card) !important;
  border: 1px solid var(--admin-card-border) !important;
  border-radius: 1.25rem !important;
  padding: 0.5rem !important;
  backdrop-filter: blur(12px) saturate(180%) !important;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
}

/* Premium Layout System */
[data-admin],
.admin-layout {
  background: var(--admin-bg-main) !important;
  position: relative !important;
  z-index: 1 !important;
}

[data-admin] *,
.admin-layout * {
  border-color: var(--admin-card-border) !important;
}

/* Premium Grid System */
.admin-grid {
  display: grid !important;
  gap: 1.5rem !important;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
}

.admin-grid-stats {
  display: grid !important;
  gap: 1.5rem !important;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)) !important;
}

/* Premium Badge System */
.admin-badge {
  background: var(--admin-gradient-primary) !important;
  color: white !important;
  border-radius: 0.5rem !important;
  padding: 0.25rem 0.75rem !important;
  font-size: 0.75rem !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  box-shadow: 0 2px 8px var(--admin-shadow-light) !important;
}

/* Enhanced Scrollbars */
.dark ::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.dark ::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.dark ::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  transition: background 0.2s ease;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
```

## Implementation Instructions

### 1. File Structure
Create these files in your project:
```
/src/styles/admin.css
theme.json
tailwind.config.ts
```

### 2. Import Admin Styles
Add to your main CSS or component:
```css
@import './styles/admin.css';
```

### 3. HTML Structure
Use these class combinations for components:

#### Dashboard Container
```html
<div class="admin-dashboard dark" data-admin>
  <!-- Your content -->
</div>
```

#### Cards
```html
<div class="admin-card">
  <!-- Card content -->
</div>
```

#### Buttons
```html
<button class="admin-btn admin-btn-primary">Primary Button</button>
<button class="admin-btn admin-btn-secondary">Secondary Button</button>
```

#### Stats Cards
```html
<div class="admin-stats-card">
  <!-- Stats content -->
</div>
```

#### Form Controls
```html
<input class="w-full" placeholder="Input field">
<textarea class="w-full" placeholder="Textarea"></textarea>
```

### 4. Key CSS Classes

**Layout Classes:**
- `.admin-dashboard` - Main dashboard container
- `.admin-layout` - Alternative layout wrapper
- `[data-admin]` - Data attribute for scoping

**Component Classes:**
- `.admin-card` - Premium cards with hover effects
- `.admin-stats-card` - Special stats cards
- `.admin-header` - Header styling
- `.admin-btn-*` - Button variants
- `.admin-badge` - Badge components

**Grid Classes:**
- `.admin-grid` - Standard grid layout
- `.admin-grid-stats` - Stats-specific grid

### 5. Color Variables
The system uses CSS custom properties that automatically adapt to light/dark themes:

**Primary Colors:**
- `var(--admin-primary)` - Main accent color
- `var(--admin-secondary)` - Secondary background
- `var(--admin-card-bg)` - Card backgrounds

**Gradients:**
- `var(--admin-gradient-primary)` - Primary gradient
- `var(--admin-gradient-secondary)` - Secondary gradient
- `var(--admin-gradient-button)` - Button gradient

**Shadows & Effects:**
- `var(--admin-glow-primary)` - Primary glow effect
- `var(--admin-shadow-light)` - Light shadows
- `var(--admin-shadow-heavy)` - Heavy shadows

### 6. Required Dependencies
Install these Tailwind plugins:
```bash
npm install tailwindcss-animate @tailwindcss/typography
```

## Usage Examples

### Complete Admin Page
```jsx
export default function AdminPage() {
  return (
    <div className="admin-dashboard dark" data-admin>
      <div className="admin-header p-6 mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      
      <div className="admin-grid-stats mb-8">
        <div className="admin-stats-card">
          <h3>Total Users</h3>
          <p className="text-3xl font-bold">1,234</p>
        </div>
        <div className="admin-stats-card">
          <h3>Revenue</h3>
          <p className="text-3xl font-bold">$12,345</p>
        </div>
      </div>
      
      <div className="admin-grid">
        <div className="admin-card p-6">
          <h2>Settings</h2>
          <button className="admin-btn admin-btn-primary mt-4">
            Configure
          </button>
        </div>
      </div>
    </div>
  );
}
```

This complete styling system will replicate the exact visual appearance of the SmartSite admin dashboard, including all animations, hover effects, gradients, and responsive behaviors.