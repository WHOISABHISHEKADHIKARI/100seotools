# Article Card Style Guide

## Overview

The Article Card component has been redesigned with a modern, accessible, and performant approach. This style guide documents the design system, usage patterns, and implementation guidelines for consistent application across the platform.

## Design Principles

### 1. Visual Hierarchy
- **Primary**: Article title (largest, boldest text)
- **Secondary**: Description content (readable body text)
- **Tertiary**: Category and metadata (smaller, muted text)
- **Interactive**: Hover states and focus indicators

### 2. Accessibility First
- WCAG 2.1 AA compliant color contrast ratios
- Keyboard navigation support with visible focus indicators
- Screen reader optimized with proper ARIA attributes
- Touch-friendly target sizes (minimum 44x44px)

### 3. Progressive Enhancement
- Mobile-first responsive design
- Graceful degradation for older browsers
- Performance-optimized animations
- Reduced motion support

## Design Tokens

### Typography Scale
```css
/* Headings */
--font-size-xl: 1.25rem;  /* 20px - Article Title */
--font-size-lg: 1.125rem; /* 18px - Large screens */
--font-size-base: 1rem;   /* 16px - Base size */
--font-size-sm: 0.875rem; /* 14px - Description */
--font-size-xs: 0.75rem;  /* 12px - Category/Meta */

/* Font Weights */
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;

/* Line Heights */
--line-height-tight: 1.3;
--line-height-normal: 1.5;
```

### Spacing System (8px base unit)
```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
```

### Color Palette

#### Light Mode
```css
/* Card Colors */
--card-bg: #ffffff;
--card-border: #e5e7eb;
--card-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);

/* Text Colors */
--text-primary: #111827;   /* Gray 900 */
--text-secondary: #6b7280;  /* Gray 500 */
--text-brand: #0ea5e9;     /* Brand 500 */
--text-brand-hover: #0284c7; /* Brand 600 */

/* Accent Colors */
--category-bg: #f0f9ff;    /* Brand 50 */
--category-text: #0369a1;  /* Brand 700 */
--divider: #f3f4f6;        /* Gray 100 */
```

#### Dark Mode
```css
/* Card Colors */
--card-bg: #1f2937;        /* Gray 800 */
--card-border: #4b5563;    /* Gray 600 */
--card-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);

/* Text Colors */
--text-primary: #f9fafb;   /* Gray 50 */
--text-secondary: #d1d5db; /* Gray 300 */
--text-brand: #38bdf8;     /* Brand 400 */
--text-brand-hover: #7dd3fc; /* Brand 300 */

/* Accent Colors */
--category-bg: rgba(2, 132, 199, 0.1); /* Brand 600 with opacity */
--category-text: #7dd3fc;  /* Brand 300 */
--divider: #374151;        /* Gray 700 */
```

## Component Structure

### HTML Structure
```html
<article class="article-card" role="article" aria-labelledby="article-title-[id]" aria-describedby="article-desc-[id]">
  <!-- Optional Image Header -->
  <div class="article-card-image">
    <img src="/path/to/image.jpg" alt="Article title" />
    <div class="image-overlay"></div>
  </div>
  
  <!-- Content Area -->
  <div class="article-card-content">
    <!-- Header: Category and Read Time -->
    <div class="article-card-header">
      <span class="article-card-category">Category</span>
      <span class="article-card-read-time">5 min read</span>
    </div>
    
    <!-- Title -->
    <h3 class="article-card-title" id="article-title-[id]">Article Title</h3>
    
    <!-- Description -->
    <p class="article-card-description" id="article-desc-[id]">Article description...</p>
    
    <!-- Footer: Author and Action -->
    <div class="article-card-footer">
      <div class="article-card-author">
        <img src="/path/to/avatar.jpg" alt="Author name" />
        <div>
          <span class="author-name">Author Name</span>
          <time class="publish-date">Jan 15, 2024</time>
        </div>
      </div>
      <div class="article-card-action">
        <span class="action-text">Read more</span>
        <svg><!-- Arrow icon --></svg>
      </div>
    </div>
  </div>
  
  <!-- Interactive Overlay -->
  <div class="article-card-overlay"></div>
</article>
```

## Interactive States

### Default State
- Subtle shadow for depth
- Clean background
- Clear typography hierarchy
- Accessible color contrast

### Hover State
- Enhanced shadow elevation
- Slight scale transform (1.01)
- Background color shift
- Smooth transition (200ms ease-out)
- Image zoom effect (105% scale)
- Action text appears
- Arrow icon translates right

### Focus State
- Visible focus ring (2px solid brand-500)
- Focus offset (2px)
- High contrast indicator
- Keyboard navigation support

### Active State
- Reduced shadow
- Slight scale reduction (0.99)
- Immediate feedback
- Touch-optimized

### Loading State
- Shimmer animation overlay
- Maintains card structure
- Accessibility-friendly

## Responsive Design

### Mobile First (320px+)
- Full-width cards
- 16px base font size
- Touch-optimized spacing
- Single column layout
- Reduced image height (160px)
- Stacked footer elements

### Tablet (640px+)
- 2-column grid
- Maintained readability
- Consistent spacing
- Enhanced typography

### Desktop (1024px+)
- 3-column grid
- Optimal line length (45-75 characters)
- Enhanced hover interactions
- Maximum content width

### Wide (1280px+)
- 4-column grid
- Consistent proportions
- Enhanced visual hierarchy
- Optimized white space

## Accessibility Guidelines

### WCAG 2.1 AA Compliance
- **Color Contrast**: All text meets 4.5:1 minimum ratio
- **Touch Targets**: Minimum 44x44px for interactive elements
- **Focus Indicators**: Visible focus rings with 3:1 contrast
- **Screen Reader Support**: Proper ARIA labels and roles

### ARIA Implementation
```html
<article role="article" 
         aria-labelledby="article-title-[id]"
         aria-describedby="article-desc-[id]"
         tabindex="0">
```

### Keyboard Navigation
- Tab navigation for interactive cards
- Enter/Space activation
- Focus management
- Skip links support

## Performance Optimization

### CSS Optimization
- Utility-first approach with Tailwind
- Purged unused styles
- Minimized custom CSS
- Efficient specificity

### Animation Performance
- GPU-accelerated transforms
- Will-change optimization
- RequestAnimationFrame for smooth transitions
- Reduced motion support

### Loading Strategy
- Progressive enhancement
- Lazy loading for images
- Critical CSS inline
- Non-blocking resources

## Usage Examples

### Basic Article Card
```jsx
<ArticleCard
  title="SEO Best Practices for 2024"
  description="Learn the latest SEO techniques and strategies to improve your website's search engine rankings."
  category="SEO"
  readTime="8 min read"
  href="/blog/seo-best-practices-2024"
/>
```

### Full Featured Card
```jsx
<ArticleCard
  title="Complete Guide to Technical SEO"
  description="A comprehensive guide covering all aspects of technical SEO including site architecture, page speed optimization, and mobile-first indexing."
  category="Technical SEO"
  readTime="15 min read"
  author="Sarah Johnson"
  authorAvatar="/authors/sarah-johnson.jpg"
  image="/images/technical-seo-guide.jpg"
  href="/blog/technical-seo-complete-guide"
  publishedAt="2024-01-15"
  priority={true}
/>
```

### Non-Interactive Card
```jsx
<ArticleCard
  title="Featured Article"
  description="This card is not clickable and serves as a display component."
  category="Featured"
  readTime="5 min read"
/>
```

## Cross-Browser Compatibility

### Supported Browsers
- Chrome 120+ (Full support)
- Firefox 115+ (Full support)
- Safari 16+ (Full support)
- Edge 120+ (Full support)

### Fallback Support
- CSS Grid with Flexbox fallback
- Custom properties with static values
- Modern JavaScript with ES5 fallback
- Touch events with mouse fallback

### Vendor Prefixes
- Autoprefixer for vendor compatibility
- Feature detection for progressive enhancement
- Polyfills for older browsers
- Graceful degradation

## Testing Guidelines

### Visual Testing
- Screenshot comparison testing
- Cross-device visual regression
- Color contrast validation
- Typography consistency checks

### Accessibility Audit
- Automated accessibility testing
- Manual keyboard navigation
- Screen reader compatibility
- Color blindness simulation

### Performance Metrics
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1
- First Input Delay < 100ms

## Maintenance Guidelines

### Regular Testing
- Monthly cross-browser testing
- Quarterly accessibility audits
- Performance monitoring
- User feedback collection

### Updates
- Design system synchronization
- Browser compatibility updates
- Accessibility guideline updates
- Performance optimization reviews

This style guide ensures consistent implementation and maintenance of the Article Card component across the entire platform while maintaining high standards for accessibility, performance, and user experience.