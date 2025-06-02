# Progress Components Guide

## Navigation Components

### Primary Navigation
```tsx
// Dark navigation with glass morphism effect
<nav className="flex items-center justify-between p-6 bg-black/20 backdrop-blur-sm">
  <div className="flex items-center space-x-2">
    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
      <span className="text-white font-bold">P</span>
    </div>
    <span className="text-white font-semibold text-xl">PROGRESS</span>
  </div>
  
  <div className="flex items-center space-x-8">
    <Link className="text-white hover:text-purple-300">Home</Link>
    <Link className="text-white hover:text-purple-300">Services</Link>
    <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
      Request Invite
    </Button>
  </div>
</nav>
```

## Card Components

### Event Card
```tsx
<Card className="bg-gradient-to-br from-purple-600 to-blue-600 border-0 text-white">
  <CardContent className="p-8">
    <h2 className="text-2xl font-bold mb-6">Exclusive Business Growth Event</h2>
    
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
        <Calendar className="h-5 w-5 mx-auto mb-2" />
        <div className="text-sm font-medium">Thursday</div>
        <div className="text-xs opacity-90">19th June</div>
      </div>
      {/* Additional info blocks */}
    </div>
  </CardContent>
</Card>
```

### Experience Card
```tsx
<Card className="bg-black/40 backdrop-blur-sm border-white/10 group hover:bg-black/60">
  <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-blue-600/20">
    {/* Video/Image content */}
  </div>
  <CardContent className="p-6 text-white">
    <h3 className="text-xl font-bold mb-3">Growth Room VR</h3>
    <p className="text-gray-300 mb-4">Experience description</p>
    <Button variant="outline" className="border-purple-500 text-purple-400">
      Interactive Experience
    </Button>
  </CardContent>
</Card>
```

## Button Variants

### Primary Button
```tsx
<Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
  Request Your Invitation
  <ArrowRight className="ml-2 h-4 w-4" />
</Button>
```

### Outline Button
```tsx
<Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white">
  Interactive Experience
</Button>
```

### Glass Button
```tsx
<Button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20">
  Learn More
</Button>
```

## Layout Patterns

### Hero Section
```tsx
<section className="px-6 py-16">
  <div className="max-w-7xl mx-auto">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-8">
        {/* Content */}
      </div>
      <div className="relative">
        {/* Visual element */}
      </div>
    </div>
  </div>
</section>
```

### Content Grid
```tsx
<div className="grid md:grid-cols-2 gap-8">
  {/* Card components */}
</div>
```

## Interactive Elements

### Status Indicators
```tsx
<div className="flex items-center space-x-3">
  <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
    <span className="text-purple-400 text-xs">✓</span>
  </div>
  <span className="text-gray-300">Limited to 100 attendees</span>
</div>
```

### Information Blocks
```tsx
<div className="bg-black/40 backdrop-blur-sm border-white/10 p-6 rounded-lg">
  <div className="flex items-start space-x-3">
    <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
      <span className="text-yellow-400">⚡</span>
    </div>
    <div>
      <h3 className="text-white font-semibold mb-2">High Demand</h3>
      <p className="text-gray-300 text-sm">Priority given to local business owners</p>
    </div>
  </div>
</div>
```

## Form Components

### Form Container
```tsx
<Card className="bg-black/40 backdrop-blur-sm border-white/10">
  <CardContent className="p-8">
    <h3 className="text-xl font-bold text-white mb-6">Ready to attend?</h3>
    <p className="text-gray-300 mb-8">Complete your invitation request</p>
    
    {/* Form fields */}
    
    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
      Submit Request
    </Button>
  </CardContent>
</Card>
```

## Animation Classes

### Hover Effects
```css
.hover-scale {
  transition: transform 0.3s ease;
}

.hover-scale:hover {
  transform: scale(1.05);
}

.hover-glow {
  transition: box-shadow 0.3s ease;
}

.hover-glow:hover {
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
}
```

### Backdrop Effects
```css
.glass-morphism {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.gradient-border {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2));
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

## Dark Theme Utilities

### Background Gradients
```css
.bg-progress-dark {
  background: linear-gradient(135deg, #0F172A 0%, #581C87 50%, #1E293B 100%);
}

.bg-card-dark {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
}
```

### Text Colors
```css
.text-progress-primary { color: #8B5CF6; }
.text-progress-secondary { color: #3B82F6; }
.text-muted-dark { color: #94A3B8; }
.text-white-90 { color: rgba(255, 255, 255, 0.9); }
```

## Responsive Patterns

### Mobile First
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Responsive grid */}
</div>
```

### Container Sizes
```tsx
<div className="max-w-7xl mx-auto px-6">
  {/* Main content container */}
</div>
```

## Accessibility Features

### Focus States
```css
.focus-progress:focus {
  outline: 2px solid #8B5CF6;
  outline-offset: 2px;
}
```

### Screen Reader Support
```tsx
<Button aria-label="Request invitation to business growth event">
  Request Invite
</Button>
```