# Perplexity Prism Design System

A modern, clean, and highly-polished design system inspired by Perplexity AI, built with Tailwind CSS and React.

## 🎨 Color Palette

### Primary Colors
- **Primary 50-900**: Blue gradient from light to dark
- **Primary 500**: `#3b82f6` - Main brand color
- **Primary 600**: `#2563eb` - Hover states
- **Primary 700**: `#1d4ed8` - Active states

### Secondary Colors
- **Secondary 50-900**: Purple gradient for accents
- **Secondary 500**: `#a855f7` - TLDR panels, highlights
- **Secondary 600**: `#9333ea` - Secondary actions

### Neutral Colors
- **Gray 50**: `#f9fafb` - Background
- **Gray 100**: `#f3f4f6` - Secondary background
- **Gray 200**: `#e5e7eb` - Borders
- **Gray 500**: `#6b7280` - Secondary text
- **Gray 700**: `#374151` - Primary text
- **Gray 900**: `#111827` - Headings

### Semantic Colors
- **Success**: Green for positive actions
- **Warning**: Yellow for caution states
- **Error**: Red for error states

## 📝 Typography

### Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Font Weights
- **300**: Light
- **400**: Regular
- **500**: Medium
- **600**: Semibold
- **700**: Bold
- **800**: Extrabold

### Text Sizes
- **xs**: 0.75rem (12px) - Labels, captions
- **sm**: 0.875rem (14px) - Body text
- **base**: 1rem (16px) - Default
- **lg**: 1.125rem (18px) - Subheadings
- **xl**: 1.25rem (20px) - Headings
- **2xl**: 1.5rem (24px) - Large headings

## 🧩 Components

### Buttons

#### Primary Button
```jsx
<button className="btn-primary">
  Primary Action
</button>
```

#### Secondary Button
```jsx
<button className="btn-secondary">
  Secondary Action
</button>
```

#### Ghost Button
```jsx
<button className="btn-ghost">
  Ghost Action
</button>
```

### Inputs

#### Standard Input
```jsx
<input className="input" placeholder="Enter text..." />
```

#### Search Input
```jsx
<input className="input-search" placeholder="Search..." />
```

### Cards

#### Standard Card
```jsx
<div className="card p-6">
  Card content
</div>
```

#### Elevated Card
```jsx
<div className="card-elevated p-6">
  Elevated card content
</div>
```

## 🎯 Spacing System

### Base Spacing
- **1**: 0.25rem (4px)
- **2**: 0.5rem (8px)
- **3**: 0.75rem (12px)
- **4**: 1rem (16px)
- **6**: 1.5rem (24px)
- **8**: 2rem (32px)
- **12**: 3rem (48px)
- **16**: 4rem (64px)

### Component Spacing
- **Card padding**: `p-6` (24px)
- **Button padding**: `px-4 py-2` (16px horizontal, 8px vertical)
- **Input padding**: `px-3 py-2` (12px horizontal, 8px vertical)
- **Section spacing**: `space-y-6` (24px between elements)

## 🎨 Shadows

### Shadow Scale
- **xs**: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- **sm**: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)`
- **md**: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
- **lg**: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
- **xl**: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`

### Special Shadows
- **card**: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)`
- **card-hover**: `0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
- **floating**: `0 8px 32px rgba(0, 0, 0, 0.12)`

## 🔄 Animations

### Transition Durations
- **Fast**: 150ms
- **Normal**: 200ms
- **Slow**: 300ms

### Animation Classes
```css
.animate-fade-in    /* Fade in animation */
.animate-slide-up   /* Slide up from bottom */
.animate-scale-in   /* Scale in from center */
.animate-pulse-soft /* Soft pulsing effect */
```

### Hover Effects
- **Cards**: Shadow elevation on hover
- **Buttons**: Color and shadow changes
- **Inputs**: Border color and background changes

## 🎨 Gradients

### Primary Gradient
```css
bg-gradient-to-br from-primary-500 to-primary-600
```

### Secondary Gradient
```css
bg-gradient-to-br from-secondary-500 to-secondary-600
```

### Background Gradients
```css
bg-gradient-to-br from-gray-50 to-gray-100
```

## 📱 Responsive Design

### Breakpoints
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### Mobile-First Approach
- Start with mobile styles
- Add responsive modifiers for larger screens
- Use `max-w-4xl mx-auto` for content containers

## ♿ Accessibility

### Focus States
- All interactive elements have visible focus rings
- Focus ring color: `ring-primary-500`
- Focus ring offset: `ring-offset-2`

### Color Contrast
- All text meets WCAG AA standards
- Minimum contrast ratio: 4.5:1 for normal text
- Minimum contrast ratio: 3:1 for large text

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Tab order follows logical document flow
- Escape keys close modals and dropdowns

## 🎯 Component Guidelines

### Cards
- Use rounded corners (`rounded-xl` or `rounded-2xl`)
- Include subtle shadows (`shadow-sm` to `shadow-lg`)
- Add hover effects for interactive cards
- Use consistent padding (`p-6`)

### Buttons
- Use semantic colors (primary, secondary, ghost)
- Include icons when appropriate
- Maintain consistent sizing
- Provide loading states

### Forms
- Use clear labels
- Provide helpful placeholder text
- Show validation states
- Group related fields

### Navigation
- Use clear visual hierarchy
- Provide breadcrumbs for complex flows
- Include search functionality
- Show active states

## 🚀 Performance

### CSS Optimization
- Use Tailwind's purge feature
- Minimize custom CSS
- Leverage CSS custom properties
- Use efficient selectors

### Animation Performance
- Use `transform` and `opacity` for animations
- Avoid animating layout properties
- Use `will-change` sparingly
- Prefer CSS animations over JavaScript

## 📋 Usage Examples

### Creating a New Component
```jsx
import React from 'react';
import { SomeIcon } from 'lucide-react';

const MyComponent = ({ children, className = '' }) => {
  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-center space-x-3 mb-4">
        <SomeIcon className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">Title</h3>
      </div>
      <div className="text-sm text-gray-700">
        {children}
      </div>
    </div>
  );
};

export default MyComponent;
```

### Adding New Styles
```css
/* Add to index.css in the appropriate @layer */

@layer components {
  .my-custom-component {
    @apply bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200;
  }
}
```

This design system provides a consistent, modern, and accessible foundation for building beautiful user interfaces that match the quality and polish of Perplexity AI.
