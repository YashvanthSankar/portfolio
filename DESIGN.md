# Design System / Brand Book

This document outlines the design elements, fonts, colors, tools, and components used in this portfolio project to ensure consistency and provide guidance for contributors or viewers.

## Fonts

- **Sans-serif**: Geist Sans, Inter (fallback)
- **Monospace**: Geist Mono

These fonts are loaded via CSS variables and provide a modern, clean aesthetic suitable for web development portfolios.

## Colors

### Primary Palette
- **Primary**: `hsl(190 100% 50%)` - A vibrant cyan color used for primary accents
- **Primary Foreground**: `hsl(0 0% 100%)` - White text on primary elements

### Background Colors
- **Dark Mode Background**: `#09090b` - Near-black background for dark theme
- **Light Mode Background**: `#fafaf9` - Off-white background for light theme

### Accent Colors
- **Blue**: `#3b82f6` (blue-500) - Used in gradients and orbs
- **Red**: `#ef4444` (red-500) - Used in gradients and orbs
- **Zinc**: Various shades of zinc for borders and subtle elements (e.g., zinc-950, zinc-700)

### Text Colors
- **Dark Mode Text**: `#ffffff` - White text
- **Light Mode Text**: `#09090b` - Black text

## Tools and Technologies

### Core Framework
- **Next.js 16**: React framework for production
- **React 19**: UI library
- **TypeScript**: Type-safe JavaScript

### Styling and UI
- **Tailwind CSS v4**: Utility-first CSS framework
- **Shadcn/ui**: Component library with New York style
- **Next Themes**: Theme switching (dark/light mode)

### Animations and Effects
- **Framer Motion**: Animation library
- **Motion**: Additional animation utilities
- **Tailwind CSS Animate**: CSS-based animations

### Icons and Assets
- **Lucide React**: Icon library

### Additional Libraries
- **clsx**: Conditional CSS classes
- **tailwind-merge**: Merge Tailwind classes
- **Three.js**: 3D graphics (types included)

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing

## Design Elements and Components

### UI Components (Custom)
Located in `components/ui/`:
- **Spotlight**: Dynamic lighting effect
- **Background Boxes**: Interactive animated background
- **Moving Border**: Animated border effects
- **Text Generate Effect**: Typewriter-style text animation
- **Flip Words**: Word rotation animation
- **Glowing Effect**: Subtle glow animations
- **Card Spotlight**: Card hover effects with lighting
- **Timeline**: Vertical timeline component

### Section Components
Located in `components/sections/`:
- **Hero**: Main landing section with spotlight and profile
- **About (Bento)**: Bento grid layout for about section
- **Projects**: Showcase of work/projects
- **Experience**: Timeline-based experience display
- **Tech Marquee**: Scrolling technology logos
- **Contact**: Contact information and form
- **Footer**: Site footer
- **Navbar**: Navigation bar

### Key Design Features
- **Dark/Light Mode**: Full theme switching support
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: Framer Motion for micro-interactions
- **Gradient Orbs**: Subtle background elements
- **Minimal Scrollbar**: Custom scrollbar styling
- **Selection Styling**: Custom text selection colors

### Component Sources
- **Shadcn/ui**: Base UI components
- **Aceternity UI**: Advanced effects and components
- **Magic UI**: Additional UI components

## Usage Guidelines

- Maintain the color palette for consistency
- Use Geist fonts for headings and body text
- Leverage existing animations for interactive elements
- Follow the component structure in `components/` directory
- Ensure accessibility with proper contrast ratios
- Test components in both dark and light modes

## File Structure

```
components/
├── ui/           # Reusable UI components
├── sections/     # Page sections
└── portfolio.tsx # Main portfolio component

app/
├── globals.css   # Global styles and CSS variables
└── layout.tsx    # Root layout with theme provider
```

This design system ensures a cohesive, modern, and performant portfolio that showcases technical skills through clean, animated interfaces.</content>
<parameter name="filePath">/mnt/d/1-coding/portfolio/DESIGN.md