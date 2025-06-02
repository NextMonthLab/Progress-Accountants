# Progress Website Design System & Style Guide

This comprehensive guide contains all the design elements, colors, components, and styling patterns from the Progress 2025 Event website that can be applied to your main Progress website.

## 🎨 Color Palette

### Primary Brand Colors
- **Progress Purple**: `#7B3FE4` (HSL: 262 83% 58%)
- **Progress Blue**: `#3FA4E4` (HSL: 217 91% 60%)
- **Accent Teal**: `#059669` (HSL: 172 94% 26%)

### Extended Color Variables
```css
:root {
  /* Primary Colors */
  --primary-blue: 217 91% 60%;
  --primary-purple: 262 83% 58%;
  --primary-light: 250 82% 67%;
  --accent-teal: 172 94% 26%;
  
  /* Progress Brand Specific */
  --progress-dark-purple: 270 70% 45%;
  --progress-light-purple: 270 70% 65%;
  --progress-dark-blue: 205 65% 47%;
  --progress-light-blue: 201 75% 65%;
  
  /* Dark Theme Colors */
  --background: 240 10% 3.9%; /* #0A0A0F */
  --foreground: 0 0% 98%; /* #FAFAFA */
  --card: 240 10% 3.9%;
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
}
```

### Dark Theme Implementation
```css
body {
  @apply font-sans antialiased bg-black text-white;
  font-family: 'Inter', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  @apply text-white;
}

p {
  @apply text-gray-200;
}
```

## 🌈 Gradient Effects

### Primary Gradient
```css
.gradient-bg {
  @apply bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4];
}

.gradient-text {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4];
}
```

### Advanced Gradient Borders
```css
.progress-gradient-border {
  @apply relative rounded-lg p-[1px];
  background: linear-gradient(135deg, hsl(var(--progress-dark-purple)), hsl(var(--progress-dark-blue)));
}
```

## 🔤 Typography

### Font Family
- **Primary Font**: Inter (Google Fonts)
- **Import**: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');`

### Responsive Typography
```css
@media (max-width: 640px) {
  h1 {
    @apply text-3xl leading-tight;
  }
  h2 {
    @apply text-2xl leading-tight;
  }
  p {
    @apply text-base leading-relaxed;
  }
}
```

## 🎯 Button Components

### Gradient Button Variants
```jsx
interface GradientButtonProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  variant?: "primary" | "accent" | "outline" | "white";
}

// Variant Styles:
// Primary: "gradient-bg text-white hover:shadow-lg"
// Accent: "bg-accent-teal hover:bg-teal-600 text-white"
// Outline: "border-2 border-primary-purple text-primary-purple hover:bg-primary-purple hover:text-white"
// White: "bg-white text-primary-purple hover:bg-gray-100"
```

### Enhanced Button Styles
```css
.progress-button {
  @apply relative overflow-hidden transition-all duration-300 ease-in-out;
  position: relative;
  z-index: 1;
}

.progress-button::before {
  content: '';
  @apply absolute top-0 left-0 w-full h-full transition-all duration-300 ease-in-out;
  background: linear-gradient(135deg, hsl(var(--progress-dark-purple)), hsl(var(--progress-dark-blue)));
  z-index: -1;
}

.progress-button:hover::before {
  @apply opacity-90 scale-105;
}
```

## 📱 Responsive Design

### Container Spacing
```css
.container {
  @apply px-[52px] sm:px-[60px] md:px-[68px];
}
```

### Mobile-First Approach
- All components designed mobile-first
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

## 🃏 Card Components

### Progress Card Styles
```css
.progress-card {
  @apply border border-purple-100 transition-all duration-300 shadow-sm;
}

.progress-card:hover {
  @apply -translate-y-1 shadow-md border-purple-200;
}

.dark-theme-card {
  @apply bg-zinc-800 text-white border-zinc-700;
}
```

### Speaker Card Component
```jsx
interface SpeakerCardProps {
  image: string;
  name: string;
  title: string;
  description: string;
}
```

### Highlight Card Component
```jsx
interface HighlightCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}
```

## 📋 Form Styling

### Enhanced Form Components
```css
.form-input-enhanced {
  @apply w-full px-4 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600;
}

.form-label-enhanced {
  @apply font-medium text-gray-900 mb-2 block;
}

.form-error-enhanced {
  @apply mt-1 text-sm text-red-600 font-medium;
}

.form-select-enhanced {
  @apply w-full px-4 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600;
}
```

### Form Input Visibility
```css
::placeholder {
  color: #4B5563 !important; /* gray-700 */
  opacity: 1 !important;
  font-weight: 500 !important;
}

input, textarea, select {
  color: #000000 !important; 
  background-color: #ffffff !important;
  font-weight: 500 !important;
}
```

## 🎭 Animation & Motion

### Framer Motion Effects
```jsx
// Hover Scale Animation
<motion.div
  whileHover={{ scale: 1.05 }}
  transition={{ duration: 0.2 }}
>

// Fade In Animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
```

## 🎨 Background Patterns

### Hero Pattern
```css
.hero-pattern {
  background-color: #F9FAFB;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B5CF6' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
```

## 🔧 Layout Components

### Header Navigation
- Sticky navigation with gradient background
- Logo on left, navigation links center, CTA button right
- Mobile hamburger menu with overlay

### Footer Design
- Dark background with white text
- Multi-column layout with company info, links, contact
- Subtle gradient borders

## 📐 Spacing & Layout

### Consistent Spacing Scale
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)
- 3xl: 4rem (64px)

### Grid Systems
```css
/* 12-column grid for complex layouts */
.grid-12 {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4;
}

/* 3-column feature grid */
.feature-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8;
}
```

## 🎪 Special Effects

### Shadow Styling
```css
/* Subtle shadows for cards */
.shadow-progress {
  box-shadow: 0 4px 6px -1px rgba(123, 63, 228, 0.1), 0 2px 4px -1px rgba(123, 63, 228, 0.06);
}

/* Enhanced shadows for hover states */
.shadow-progress-lg {
  box-shadow: 0 10px 15px -3px rgba(123, 63, 228, 0.1), 0 4px 6px -2px rgba(123, 63, 228, 0.05);
}
```

## 📱 Mobile Optimization

### Touch-Friendly Interactions
- Minimum 44px touch targets
- Adequate spacing between interactive elements
- Optimized form inputs for mobile devices

### Performance Considerations
- Lazy loading for images
- Optimized font loading with display=swap
- Minimal CSS for critical rendering path

## 🎨 Brand Applications

### Logo Usage
- Primary logo: White on dark backgrounds
- Secondary logo: Purple gradient on light backgrounds
- Minimum size: 120px width

### Brand Voice in Design
- Professional yet approachable
- Tech-forward aesthetic
- Clean, minimalist layouts
- Strategic use of whitespace

## 🔄 Implementation Notes

### Tailwind CSS Setup
```javascript
// tailwind.config.ts extensions needed
module.exports = {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        'progress-purple': '#7B3FE4',
        'progress-blue': '#3FA4E4',
        'accent-teal': '#059669'
      }
    }
  }
}
```

### Required Dependencies
- Tailwind CSS
- Framer Motion (for animations)
- Lucide React (for icons)
- Inter font from Google Fonts

This design system provides a complete foundation for implementing the Progress brand aesthetic across your main website while maintaining consistency with the event microsite.