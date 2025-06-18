# Progress Design System

## Brand Identity

### Logo & Branding
- **Primary Logo**: Purple gradient arrow with "PROGRESS" wordmark
- **Tagline**: "Accountants | Business Growth Specialists"
- **Brand Voice**: Professional, innovative, growth-focused

### Color Palette

#### Primary Colors
- **Purple Primary**: `#8B5CF6` (Primary brand color)
- **Purple Dark**: `#7C3AED` (Hover states)
- **Blue Accent**: `#3B82F6` (Secondary interactions)

#### Background Colors
- **Dark Base**: `#0F172A` (Slate-900)
- **Purple Gradient**: `from-purple-900 to-slate-800`
- **Card Background**: `bg-black/40 backdrop-blur-sm`

#### Accent Colors
- **Success**: `#10B981` (Emerald-500)
- **Warning**: `#F59E0B` (Amber-500)
- **Error**: `#EF4444` (Red-500)

### Typography

#### Font Families
- **Primary**: System font stack with fallbacks
- **Headers**: Bold weights (600-700)
- **Body**: Regular weight (400)
- **Small Text**: Light weight (300)

#### Font Sizes
- **Hero Text**: `text-5xl` (48px)
- **Section Headers**: `text-3xl` (30px)
- **Card Titles**: `text-xl` (20px)
- **Body Text**: `text-base` (16px)
- **Small Text**: `text-sm` (14px)

## Component Patterns

### Cards
```css
.progress-card {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}
```

### Buttons
- **Primary**: Purple gradient with hover effects
- **Secondary**: Outline style with brand colors
- **Ghost**: Transparent with hover states

### Layout Patterns
- **Dark Theme**: Default appearance
- **Grid Systems**: CSS Grid for complex layouts
- **Spacing**: Consistent 8px grid system
- **Breakpoints**: Mobile-first responsive design

## Event & Content Layouts

### Event Cards
- Gradient backgrounds (purple to blue)
- Icon-based information display
- Date, time, location in structured grid
- Call-to-action buttons prominently placed

### Experience Sections
- Two-column grid on desktop
- Video placeholders with play buttons
- Interactive hover states
- Progress branding throughout

### Form Designs
- Dark card containers
- Multi-step processes
- Clear visual hierarchy
- Accessibility considerations

## Interactive Elements

### Hover States
- Subtle scale transforms
- Color transitions
- Shadow depth changes
- Background opacity shifts

### Animation Guidelines
- Smooth transitions (300ms)
- Easing functions for natural movement
- Loading states with branded elements
- Progressive enhancement approach

## Accessibility

### Color Contrast
- WCAG AA compliance minimum
- High contrast text on backgrounds
- Focus indicators clearly visible
- Color not sole means of communication

### Navigation
- Keyboard accessible
- Screen reader friendly
- Clear focus management
- Semantic HTML structure