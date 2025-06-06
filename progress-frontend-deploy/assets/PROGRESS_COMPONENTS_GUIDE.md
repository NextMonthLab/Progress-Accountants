# Progress Website - Component Library Guide

This guide provides ready-to-use React components from the Progress event website that you can implement directly in your main Progress website.

## 🔧 Core Components

### 1. Gradient Button Component

```jsx
import { motion } from "framer-motion";
import { Link } from "wouter"; // or your router of choice
import { cn } from "@/lib/utils";

interface GradientButtonProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  variant?: "primary" | "accent" | "outline" | "white";
}

export default function GradientButton({ 
  href, 
  className, 
  children, 
  variant = "primary" 
}: GradientButtonProps) {
  const getButtonClass = () => {
    switch (variant) {
      case "primary":
        return "gradient-bg text-white hover:shadow-lg";
      case "accent":
        return "bg-accent-teal hover:bg-teal-600 text-white";
      case "outline":
        return "border-2 border-primary-purple text-primary-purple hover:bg-primary-purple hover:text-white";
      case "white":
        return "bg-white text-primary-purple hover:bg-gray-100";
      default:
        return "gradient-bg text-white hover:shadow-lg";
    }
  };

  return (
    <Link href={href}>
      <motion.a 
        className={cn(
          "px-6 py-3 rounded-md font-medium transition-colors inline-block",
          getButtonClass(),
          className
        )}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.a>
    </Link>
  );
}
```

### 2. Speaker/Team Card Component

```jsx
import { motion } from "framer-motion";

interface SpeakerCardProps {
  image: string;
  name: string;
  title: string;
  description: string;
}

export default function SpeakerCard({ image, name, title, description }: SpeakerCardProps) {
  return (
    <motion.div 
      className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden dark-theme-card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="aspect-square overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 dark-theme-text">{name}</h3>
        <p className="text-purple-600 dark:text-purple-400 font-medium mb-3">{title}</p>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
```

### 3. Highlight Card Component

```jsx
import { motion } from "framer-motion";

interface HighlightCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function HighlightCard({ icon, title, description }: HighlightCardProps) {
  return (
    <motion.div 
      className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg dark-theme-card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 dark-theme-text">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
    </motion.div>
  );
}
```

### 4. Progress Logo Component

```jsx
export default function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-sm">P</span>
      </div>
      <span className="text-xl font-bold gradient-text">Progress</span>
    </div>
  );
}
```

### 5. Header Navigation Component

```jsx
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import GradientButton from "./GradientButton";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/team", label: "Team" },
    { href: "/contact", label: "Contact" }
  ];

  return (
    <header className="bg-black/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a className={`text-sm font-medium transition-colors hover:text-purple-400 ${
                  location === item.href ? "text-purple-400" : "text-gray-300"
                }`}>
                  {item.label}
                </a>
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <GradientButton href="/contact" variant="primary">
              Get Started
            </GradientButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900 rounded-lg mt-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a
                    className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-purple-400"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                </Link>
              ))}
              <div className="pt-4">
                <GradientButton href="/contact" variant="primary" className="w-full text-center">
                  Get Started
                </GradientButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
```

### 6. Footer Component

```jsx
import { Link } from "wouter";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Logo />
            <p className="text-gray-400 text-sm leading-relaxed">
              Forward-thinking accountancy services for modern businesses.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link href="/accounting"><a className="text-gray-400 hover:text-purple-400 transition-colors">Accounting</a></Link></li>
              <li><Link href="/tax"><a className="text-gray-400 hover:text-purple-400 transition-colors">Tax Planning</a></Link></li>
              <li><Link href="/consulting"><a className="text-gray-400 hover:text-purple-400 transition-colors">Business Consulting</a></Link></li>
              <li><Link href="/payroll"><a className="text-gray-400 hover:text-purple-400 transition-colors">Payroll Services</a></Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about"><a className="text-gray-400 hover:text-purple-400 transition-colors">About Us</a></Link></li>
              <li><Link href="/team"><a className="text-gray-400 hover:text-purple-400 transition-colors">Our Team</a></Link></li>
              <li><Link href="/careers"><a className="text-gray-400 hover:text-purple-400 transition-colors">Careers</a></Link></li>
              <li><Link href="/news"><a className="text-gray-400 hover:text-purple-400 transition-colors">News</a></Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-gray-400 text-sm">
              <p>123 Business Street</p>
              <p>City, State 12345</p>
              <p>Phone: (555) 123-4567</p>
              <p>Email: hello@progress.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 Progress Accountants. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
```

### 7. Layout Wrapper Component

```jsx
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
```

## 🎨 CSS Utilities

### Essential CSS Classes (add to your main CSS file)

```css
/* Gradient utilities */
.gradient-bg {
  @apply bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4];
}

.gradient-text {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4];
}

/* Dark theme utilities */
.dark-theme-text {
  @apply text-white;
}

.dark-theme-paragraph {
  @apply text-gray-200;
}

.dark-theme-card {
  @apply bg-zinc-800 text-white border-zinc-700;
}

/* Enhanced button styles */
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

## 📱 Responsive Patterns

### Grid Layouts

```jsx
// 3-column feature grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {/* Content */}
</div>

// 2-column content layout
<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
  {/* Content */}
</div>

// 4-column service grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Content */}
</div>
```

## 🔧 Required Dependencies

For your package.json:

```json
{
  "dependencies": {
    "framer-motion": "^10.x.x",
    "lucide-react": "^0.x.x",
    "clsx": "^2.x.x",
    "tailwind-merge": "^2.x.x"
  }
}
```

## 🎯 Implementation Tips

1. **Color Variables**: Add the CSS variables from the design system to your main CSS file
2. **Font Loading**: Import Inter font in your main CSS file
3. **Dark Theme**: Apply `bg-black text-white` to your body element
4. **Animations**: Import Framer Motion for smooth interactions
5. **Icons**: Use Lucide React for consistent iconography

This component library gives you all the building blocks to recreate the Progress brand aesthetic on your main website while maintaining design consistency and professional quality.