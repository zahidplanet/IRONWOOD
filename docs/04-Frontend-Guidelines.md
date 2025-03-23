# IRONWOOD Frontend Guidelines

## Design Philosophy
The IRONWOOD platform embraces a futuristic, glassmorphic UI that conveys sophistication, innovation, and clarity. The interface should feel like an extension of the physical space—clean, minimal, and technologically advanced. All elements should support quick comprehension of complex medical and operational data while maintaining a cohesive visual language across all user roles.

## Typography

### Primary Font Family
- **Font**: SF Pro Display / SF Pro Text (Apple's system font)
- **Fallback**: Inter, Roboto, system-ui
- **Usage**: All primary interface elements, headings, and body text

### Secondary Font Family
- **Font**: Space Grotesk
- **Fallback**: Montserrat, sans-serif
- **Usage**: Numerical data, charts, statistics, and accent text

### Font Sizes
- Heading 1: 48px / 3rem (Dashboard titles, main page headers)
- Heading 2: 32px / 2rem (Section headers, modal titles)
- Heading 3: 24px / 1.5rem (Card headers, sidebar navigation)
- Heading 4: 20px / 1.25rem (Sub-sections, emphasized content)
- Body: 16px / 1rem (Standard text, descriptions)
- Small: 14px / 0.875rem (Secondary information, metadata)
- Micro: 12px / 0.75rem (Labels, captions, timestamps)

### Font Weights
- Light: 300 (Decorative elements, large display text)
- Regular: 400 (Body text, descriptions)
- Medium: 500 (Navigation, buttons)
- Semi-bold: 600 (Sub-headings, emphasized content)
- Bold: 700 (Primary headings, key statistics)

## Color Palette

### Primary Colors
- **Deep Space Blue**: #0B1026 (Primary background)
- **Medical Teal**: #00B8D4 (Primary accent, important actions)
- **Neon Purple**: #6E56CF (Secondary accent, highlights)
- **Clinical White**: #F8FAFC (Text, foreground elements)

### Secondary Colors
- **Soft Mint**: #42E695 (Success states, positive metrics)
- **Electric Coral**: #FF6B6B (Error states, warnings, alerts)
- **Amber Gold**: #FFD166 (Caution, pending states)
- **Lavender Mist**: #B8C0FF (Secondary information, subtle accents)

### Neutral Colors
- **Space Black**: #000814 (Deep backgrounds, darkest elements)
- **Cosmic Gray**: #1E293B (Card backgrounds, secondary surfaces)
- **Nebula Gray**: #475569 (Borders, dividers)
- **Stellar Gray**: #94A3B8 (Inactive elements, disabled states)
- **Lunar Light**: #E2E8F0 (Light backgrounds, hover states)

### Opacity Guidelines
- Glassmorphic surfaces: 10-30% opacity
- Modal overlays: 30-50% opacity
- Hover states: 10-15% white overlay
- Active states: 15-25% white overlay
- Disabled states: 40% opacity

## Glassmorphic Effects

### Card Components
- Background: rgba(30, 41, 59, 0.7) (Cosmic Gray with 70% opacity)
- Backdrop filter: blur(10px)
- Border: 1px solid rgba(255, 255, 255, 0.125)
- Border radius: 16px
- Box shadow: 0 8px 32px rgba(0, 0, 0, 0.1)

### Modal Components
- Background: rgba(30, 41, 59, 0.85) (Cosmic Gray with 85% opacity)
- Backdrop filter: blur(20px)
- Border: 1px solid rgba(255, 255, 255, 0.2)
- Border radius: 24px
- Box shadow: 0 16px 48px rgba(0, 0, 0, 0.2)

### Dropdown & Tooltip Components
- Background: rgba(30, 41, 59, 0.9) (Cosmic Gray with 90% opacity)
- Backdrop filter: blur(8px)
- Border: 1px solid rgba(255, 255, 255, 0.1)
- Border radius: 12px
- Box shadow: 0 4px 16px rgba(0, 0, 0, 0.15)

## Spacing & Layout

### Grid System
- Base unit: 4px
- Column system: 12-column grid
- Breakpoints:
  - Mobile: 320px - 767px
  - Tablet: 768px - 1023px
  - Desktop: 1024px - 1439px
  - Large Desktop: 1440px+

### Spacing Scale
- 2xs: 4px (0.25rem) - Minimal spacing, tight elements
- xs: 8px (0.5rem) - Icons to text, close elements
- sm: 16px (1rem) - Standard padding, related items
- md: 24px (1.5rem) - Card padding, section spacing
- lg: 32px (2rem) - Component separation
- xl: 48px (3rem) - Major section breaks
- 2xl: 64px (4rem) - Page breaks, major containers

### Layout Rules
- Maintain a consistent 24px (md) padding inside all containers
- Group related controls and information with 16px (sm) spacing
- Separate distinct sections with 32px (lg) spacing
- Maintain a vertical rhythm using multiples of the base unit (4px)
- Use negative space strategically to create focal points around important data
- Main content area should have 48px (xl) padding from screen edges on desktop
- Dashboard cards should have consistent heights within rows

## Animation & Motion

### Principles
- All animations should feel quick, responsive, and purposeful
- Transitions should enhance rather than delay the user experience
- Use motion to establish visual hierarchy and draw attention to changes
- Reserve more pronounced animations for significant state changes

### Timing Guidelines
- Ultra-fast: 100ms (Micro-interactions, button clicks)
- Fast: 200ms (Hover states, focus changes)
- Standard: 300ms (Page transitions, component mounting)
- Deliberate: 500ms (Complex animations, emphasis)

### Animation Types
- **Fade**: Use for appearing/disappearing elements (opacity 0 → 1)
- **Scale**: Use for emphasizing importance (transform: scale(0.97) → scale(1))
- **Slide**: Use for related content (transform: translateX/Y)
- **Blur**: Use with glassmorphic elements (filter: blur)
- **Color Shift**: Use to indicate state changes

### Framer Motion Presets
```jsx
// Standard fade in for cards
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3, ease: "easeOut" }
}

// Scale up for emphasis
const scaleUp = {
  initial: { scale: 0.97, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] }
}

// Slide in from bottom
const slideUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.3, ease: "easeOut" }
}

// Stagger children
const staggerContainer = {
  animate: { 
    transition: { 
      staggerChildren: 0.07
    } 
  }
}
```

## UI Component Library

### Primary Framework
- **Chakra UI** with custom glassmorphic theme extensions

### Custom Components
- **GlassCard**: Base container for dashboard metrics and content
- **GlassModal**: Overlay dialog with backdrop blur
- **GlassButton**: Primary and secondary action buttons
- **MetricDisplay**: Specialized component for KPI visualization
- **NavigationItem**: Consistent sidebar navigation elements
- **ChartContainer**: Wrapper for data visualization components
- **AlertBadge**: Notification and status indicators
- **UserAvatar**: Consistent user identification element
- **TabNavigation**: Content organization system
- **SearchField**: Unified search interface component

### Component States
All interactive components should have clearly defined states:
- Default
- Hover
- Focus
- Active
- Disabled
- Loading
- Error

## Icon System

### Primary Icon Set
- **Phosphor Icons** (https://phosphoricons.com/)
  - Style: Fill
  - Weight: Regular
  - Standard size: 24px

### Secondary Icon Set
- **Custom medical-specific icons** for specialized functionality

### Icon Usage Guidelines
- Use consistent sizing within similar contexts
- Maintain 8px (xs) spacing between icons and related text
- Use color sparingly for emphasis; prefer monochrome icons
- Ensure all icons have appropriate text labels or tooltips
- Icon weights should match the visual weight of adjacent text

### Key Icon Categories
- Navigation icons
- Action icons
- Status indicators
- Medical specialties
- Facility management
- IoT and data metrics
- User role indicators
- Notification types

## Accessibility Guidelines

- Maintain a minimum contrast ratio of 4.5:1 for text elements
- Support keyboard navigation for all interactive elements
- Implement focus states that are visible and consistent
- Provide text alternatives for all non-text content
- Ensure all functionality is available without relying on color perception
- Support screen readers with appropriate ARIA attributes
- Enable text resizing without loss of content or functionality
- Design components to work with various zoom levels and viewport sizes

## Responsive Design Principles

- Adopt a mobile-first approach where possible
- Use flexible grid layouts that adapt to different screen sizes
- Collapse multi-column layouts to single columns on smaller screens
- Convert detailed tables to cards on mobile devices
- Adjust typography scale for different viewport sizes
- Hide secondary information on smaller screens
- Ensure touch targets are at least 44×44px on mobile
- Implement alternative navigation patterns for mobile (e.g., bottom tabs) 